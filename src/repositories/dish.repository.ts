import { prisma } from "@/libs/prisma";

export default class DishRepository {
  async findDishesByKeyword(
    whereClause: object,
    limit: number,
    offset: number
  ) {
    return prisma.dish.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
    });
  }
}
