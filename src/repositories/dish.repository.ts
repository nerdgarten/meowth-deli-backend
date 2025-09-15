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

  async createDish(data: {
    restaurant_id: number;
    name: string;
    allergy?: string;
    price: number;
    detail?: string;
  }) {
    return prisma.dish.create({
      data,
    });
  }
}
