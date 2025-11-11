import { Allergy } from "@/types/allergy";
import { prisma } from "@/libs/prisma";
import { DishWhereClause } from "@/types/dish/dish";

export default class DishRepository {
  async findDishesByKeyword(
    whereClause: DishWhereClause,
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
    allergy: Allergy[];
    price: number;
    detail?: string;
  }) {
    return prisma.dish.create({
      data,
    });
  }

  async findAllDishes(limit?: number, offset?: number) {
    return prisma.dish.findMany({
      take: limit,
      skip: offset,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  }

  async findDishById(id: number) {
    return prisma.dish.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  }

  async updateDish(
    id: number,
    data: Partial<{
      name: string;
      allergy: Allergy[];
      price: number;
      detail?: string;
      is_out_of_stock?: boolean;
    }>
  ) {
    return prisma.dish.update({
      where: { id },
      data,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  }

  async deleteDish(id: number) {
    return prisma.dish.delete({
      where: { id },
    });
  }

  async updateDishStockStatus(id: number, is_out_of_stock: boolean) {
    return prisma.dish.update({
      where: { id },
      data: { is_out_of_stock },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
  }
}
