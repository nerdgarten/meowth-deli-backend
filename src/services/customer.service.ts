import { StatusCodes } from "http-status-codes";

import { OrderStatus, VerificationStatus, type Order } from "@/generated/prisma/client";
import { prisma,  } from "@/libs/prisma";
import CustomerRepository from "@/repositories/customer.repository";
import { AppError } from "@/types/error";
import {
  MockPaymentResult,
  PaymentRequest,
  OrderStatusInfo,
  OrderDishWithRestaurant
} from "@/types/order";
import {
  ICustomer,
  ICreateOrderRequest,
  IOrderDishRepository,
} from "@/types/user";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomerProfile(userId: number) {
    const profile = await this.customerRepository.getCustomerProfile(userId);
    if (!profile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return profile;
  }

  async updateCustomerProfile(userId: number, data: Partial<ICustomer>) {
    const updatedProfile = await this.customerRepository.updateCustomerProfile(
      userId,
      data
    );
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return updatedProfile;
  }
  async getCustomerOrderHistory(
    userId: number,
    options?: {
      page?: number;
      limit?: number;
      status?: OrderStatus;
      sortBy?: "created_at" | "total_amount";
      sortOrder?: "asc" | "desc";
    }
  ) {
    const [totalCount, orders] =
      await this.customerRepository.getCustomerOrderHistory(userId, options);

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const totalPages = Math.ceil(totalCount / limit);

    // Format the response with pagination metadata
    return {
      orders: orders.map((order) => ({
        ...order,
        // Calculate item count for quick reference
        itemCount: order.orderDishes.reduce(
          (sum, item) => sum + item.amount,
          0
        ),
        // Get first restaurant name for display
        restaurantName:
          order.orderDishes[0]?.dish?.restaurant?.name || "Unknown",
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getCustomerOrderById(userId: number, orderId: number) {
    const order = await this.customerRepository.getCustomerOrderById(
      userId,
      orderId
    );

    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }

    // Calculate additional useful information
    const itemCount = order.orderDishes.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const subtotal = order.orderDishes.reduce(
      (sum, item) => sum + item.dish.price * item.amount,
      0
    );

    return {
      ...order,
      itemCount,
      subtotal,
      // Group dishes by restaurant for better display
      dishesByRestaurant: this.groupDishesByRestaurant(order.orderDishes),
    };
  }

  async getOrderStatistics(userId: number) {
    const statistics = await this.customerRepository.getOrderStatistics(
      userId
    );

    // Transform the grouped data into a more readable format
    const stats = {
      totalOrders: 0,
      totalSpent: 0,
      ordersByStatus: {} as Record<string, { count: number; total: number }>,
    };

    statistics.forEach((stat) => {
      stats.totalOrders += stat._count.id;
      stats.totalSpent += stat._sum.total_amount || 0;
      stats.ordersByStatus[stat.status] = {
        count: stat._count.id,
        total: stat._sum.total_amount || 0,
      };
    });

    return stats;
  }

  async getReorderItems(userId: number, orderId: number) {
    const order = await this.customerRepository.getCustomerOrderById(
      userId,
      orderId
    );

    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }

    // Return items formatted for reordering
    return order.orderDishes.map((item) => ({
      dishId: item.dish.id,
      dishName: item.dish.name,
      restaurantId: item.dish.restaurant.id,
      restaurantName: item.dish.restaurant.name,
      price: item.dish.price,
      amount: item.amount,
      remark: item.remark,
      allergy: item.dish.allergy,
      isOutOfStock: item.dish.is_out_of_stock,
    }));
  }

  private groupDishesByRestaurant(orderDishes: OrderDishWithRestaurant[]) {
    type GroupedResult = {
      restaurant: OrderDishWithRestaurant["dish"]["restaurant"];
      dishes: Array<OrderDishWithRestaurant["dish"] & {
        amount: number;
        remark?: string | null;
      }>;
    };

    const grouped = orderDishes.reduce<Record<number, GroupedResult>>((acc, item) => {
      const restaurantId = item.dish.restaurant.id;
      if (!acc[restaurantId]) {
        acc[restaurantId] = {
          restaurant: item.dish.restaurant,
          dishes: [],
        };
      }
      acc[restaurantId].dishes.push({
        ...item.dish,
        amount: item.amount,
        remark: item.remark,
      });
      return acc;
    }, {});

    return Object.values(grouped);
  }


  // ========================
  // ORDER CREATION SECTION
  // ========================

  async createOrder(
    customerId: number,
    orderData: ICreateOrderRequest
  ): Promise<Order> {
    // Validate input
    this.validateOrderInput(orderData);

    // Validate restaurant
    const restaurant = await this.validateRestaurant(orderData.restaurant_id);

    // Validate dishes
    const dishDetails = await this.validateDishes(
      orderData.dishes.map((d) => d.dish_id),
      restaurant.id
    );
    // Calculate total amount and driver fee
    const { totalAmount, driverFee } = this.calculateOrderCosts(
      dishDetails,
      orderData.dishes,
      restaurant.fee_rate
    );
    // Prepare mapped dishes
    const mappedDishes: IOrderDishRepository[] = orderData.dishes.map(
      (dish) => ({
        dishId: dish.dish_id,
        quantity: dish.quantity,
        note: dish.note,
      })
    );

    // Create order
    
    return this.customerRepository.createOrder({
      customerId,
      restaurant_id: restaurant.id,
      location: orderData.location,
      note: orderData.note,
      total_amount: totalAmount,
      driver_fee: driverFee,
      dishes: mappedDishes,
    });
  }

  private validateOrderInput(orderData: ICreateOrderRequest) {
    if (!orderData.location?.trim()) {
      throw new AppError("Location is required", StatusCodes.BAD_REQUEST);
    }

    if (!orderData.dishes?.length) {
      throw new AppError("At least one dish is required", StatusCodes.BAD_REQUEST);
    }

    const isValidDishes = orderData.dishes.every(
      (dish) => dish.dish_id > 0 && dish.quantity > 0
    );

    if (!isValidDishes) {
      throw new AppError(
        "Invalid dish format. Each dish must have a valid dish ID and quantity > 0",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  private async validateRestaurant(restaurantId: number) {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
        // is_available: true,
      },
      select: {
        id: true,
        name: true,
        fee_rate: true,
      },
    });

    if (!restaurant) {
      throw new AppError(
        "Restaurant not found or unavailable",
        StatusCodes.NOT_FOUND
      );
    }

    return restaurant;
  }

  private async validateDishes(dishIds: number[], restaurantId: number) {
    const dishDetails = await prisma.dish.findMany({
      where: {
        id: { in: dishIds },
        restaurant_id: restaurantId,
        is_out_of_stock: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        restaurant_id: true,
      },
    });

    if (dishDetails.length !== dishIds.length) {
      const foundDishIds = dishDetails.map((d) => d.id);
      const missingDishIds = dishIds.filter((id) => !foundDishIds.includes(id));

      throw new AppError(
        `Dishes not found or out of stock: ${missingDishIds.join(", ")}`,
        StatusCodes.BAD_REQUEST
      );
    }

    return dishDetails;
  }

  private calculateOrderCosts(
    dishDetails: Array<{ id: number; price: number }>,
    orderDishes: Array<{ dish_id: number; quantity: number }>,
    feeRate: number
  ) {
    const totalAmount = orderDishes.reduce((total, dish) => {
      const dishDetail = dishDetails.find((d) => d.id === dish.dish_id);
      return total + (dishDetail?.price ?? 0) * dish.quantity;
    }, 0);

    const driverFee = totalAmount * feeRate;
    return { totalAmount, driverFee };
  }

  // ========================
  // ORDER STATUS & PAYMENT
  // ========================

  async getOrderStatus(
    customerId: number,
    orderId: number
  ): Promise<OrderStatusInfo> {
    const order = await this.customerRepository.getOrderWithDetails(
      orderId,
      customerId
    );

    if (!order) {
      throw new AppError("Order not found or access denied", StatusCodes.NOT_FOUND);
    }

    const statusDescription = this.getStatusDescription(order.status);

    const items: Array<{ name: string; quantity: number; price: number }> = 
    order.orderDishes?.map((orderDish) => ({
      name: orderDish.dish.name,
      quantity: orderDish.amount,
      price: orderDish.dish.price,
    })) ?? [];

    const restaurantName =
      order.orderDishes?.[0]?.dish?.restaurant?.name || "Restaurant";

    return {
      orderId: order.id,
      currentStatus: order.status,
      statusDescription,
      restaurantName,
      orderDate: order.created_at,
      lastUpdatedAt: order.updated_at,
      estimatedDeliveryTime: undefined,
      totalAmount: order.total_amount,
      items,
      trackingInfo: this.getTrackingInfo(order),
    };
  }

  async getAllOrdersWithStatus(customerId: number, statusFilter?: OrderStatus) {
    const orders = await this.customerRepository.getCustomerOrders(
      customerId,
      statusFilter
    );

    return orders.map((order) => ({
      orderId: order.id,
      currentStatus: order.status,
      statusDescription: this.getStatusDescription(order.status),
      restaurantName: "Restaurant",
      totalAmount: order.total_amount,
      orderDate: order.created_at,
      lastUpdatedAt: order.updated_at,
      estimatedDeliveryTime: undefined,
      itemCount: order._count?.orderDishes || 0,
    }));
  }

  async processMockPayment(
    customerId: number,
    orderId: number,
    payment: PaymentRequest
  ): Promise<MockPaymentResult> {
    const order = await this.customerRepository.getOrderWithDetails(
      orderId,
      customerId
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status !== OrderStatus.pending) {
      throw new AppError("This order cannot be paid for now", 400);
    }

    // Simulate payment logic
    const transactionId = `TX-${Date.now()}`;
    const newStatus = OrderStatus.success;
    await this.customerRepository.createPayment({
      order_id: order.id,
      payment_method_id: 1, // assuming mock payment method
      status: VerificationStatus.pending,
      image: null,
    });

    // Update order status
    await this.customerRepository.updateOrderStatus(order.id, newStatus);

    return {
      success: true,
      transactionId,
      message: "Mock payment successful",
      timestamp: new Date(),
      orderId: order.id,
      newOrderStatus: newStatus,
    };
  }

  // ========================
  // HELPER METHODS
  // ========================

  private getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      [OrderStatus.pending]: "Your order is awaiting payment",
      [OrderStatus.success]: "Restaurant has confirmed your order",
      [OrderStatus.preparing]: "Your order is being prepared",
      [OrderStatus.delivered]: "Your order has been delivered",
      [OrderStatus.rejected]: "Your order has been rejected",
    };

    return descriptions[status] || "Unknown status";
  }

  private getTrackingInfo(order: {
    status: OrderStatus;
    driver?: { firstname: string; lastname: string; tel: string } | null;
  }) {
    if (order.status === OrderStatus.delivered && order.driver) {
      return {
        driverName: `${order.driver.firstname} ${order.driver.lastname}`,
        driverPhone: order.driver.tel,
        estimatedArrival: undefined,
      };
    }
    return undefined;
  }

}
