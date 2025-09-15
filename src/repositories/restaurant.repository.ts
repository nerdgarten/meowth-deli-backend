import { prisma } from "@/libs/prisma";

export default class RestaurantRepository {
  async findRestaurantsByStatus(
    whereClause: object,
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
}
