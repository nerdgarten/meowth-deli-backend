import { StatusCodes } from "http-status-codes";
import { prisma } from "@/libs/prisma";

import CustomerRepository from "@/repositories/customer.repository";
import { AppError } from "@/types/error";
import {
  ICustomer,
  ICreateOrderRequest,
  IOrderDishRepository,
  IDriver,
  IRestaurant,
} from "@/types/user";
import {
  MockPaymentResult,
  PaymentRequest,
  OrderStatusInfo,
} from "@/types/order";
import { OrderStatus, type Order } from "@/generated/prisma/client";

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

    const items = order.orderDishes?.map((orderDish: any) => ({
      name: orderDish.dish?.name || "Unknown Item",
      quantity: orderDish.amount,
      price: orderDish.dish?.price || 0,
    }));

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

  async getAllOrdersWithStatus(customerId: number, statusFilter?: string) {
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
      status: "verified",
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

  private async simulatePaymentGateway(paymentRequest: PaymentRequest) {
    // Simulate async payment processing
    await new Promise((res) => setTimeout(res, 1000));
    return {
      success: Math.random() > 0.2,
      message: "Mock payment processed",
    };
  }

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

  private getTrackingInfo(order: any) {
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
