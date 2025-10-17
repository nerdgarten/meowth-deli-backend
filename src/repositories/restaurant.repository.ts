import { prisma } from "@/libs/prisma";
import { RestaurantWhereClause } from "@/types/restaurant/restaurant";
import { OrderStatus } from "@/generated/prisma/client";

export default class RestaurantRepository {
  async findRestaurantsByStatus(
    whereClause: RestaurantWhereClause,
    limit: number,
    offset: number
  ) {
    return prisma.restaurant.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
    });
  }

  async findRestaurantById(id: number) {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async updateRestaurantAvailability(id: number, is_available: boolean) {
    return prisma.restaurant.update({
      where: { id },
      data: { is_available },
    });
  }
  async getOrdersByRestaurantId(restaurantId: number, status?: OrderStatus) {
    return prisma.order.findMany({
      where: {
        orderDishes: {
          some: {
            dish: {
              restaurant_id: restaurantId
            }
          }
        },
        status: status
      },
      include: {
        customer: true,
        driver: true,
        orderDishes: {
          include: {
            dish: true
          }
        },
        payments: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async findOrderById(orderId: number) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderDishes: {
          include: {
            dish: true
          }
        }
      }
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        customer: true,
        driver: true,
        orderDishes: {
          include: {
            dish: true
          }
        },
        payments: true
      }
    });
  }
}
