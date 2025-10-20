import { StatusCodes } from "http-status-codes";

import CustomerRepository from "@/repositories/customer.repository";
import { AppError } from "@/types/error";
import { ICustomer } from "@/types/user";

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
      status?: string;
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

  private groupDishesByRestaurant(orderDishes: any[]) {
    const grouped = orderDishes.reduce((acc, item) => {
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
}
