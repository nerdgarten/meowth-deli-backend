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
}
