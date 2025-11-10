import { prisma } from "@/libs/prisma";
import { RestaurantWhereClause } from "@/types/restaurant/restaurant";

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
  async findDishesByRestaurantId(restaurantId: number) {
    return prisma.dish.findMany({
      where: { restaurant_id: restaurantId },
    });
  }
  async findTransactionsByRestaurantId(restaurantId: number, startDate?: Date, endDate?: Date) {
    return prisma.order.findMany({
      where: {
        restaurant_id: restaurantId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        orderDishes: {
          include: {
            dish: true,
          },
        },
        payments: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
