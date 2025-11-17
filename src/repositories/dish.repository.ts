import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/libs/prisma";
import { Allergy } from "@/types/allergy";
import { DishWhereClause } from "@/types/dish/dish";

export default class DishRepository {
  async getAllDishes() {
    return prisma.dish.findMany();
  }

  async getDishById(id: number) {
    return prisma.dish.findUnique({
      where: { id },
    });
  }

  async isDishOwnerByUser(dishId: number, userId: number) {
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      include: {
        restaurant: true,
      },
    });

    if (!dish) {
      return false;
    }

    return dish.restaurant.id === userId;
  }

  async getDishesByRestaurantId(restaurantId: number) {
    return prisma.dish.findMany({
      where: { restaurant_id: restaurantId },
    });
  }

  async getFavoriteDishByUserId(userId: number, restaurantId: number) {
    return prisma.dish.findMany({
      where: {
        restaurant_id: restaurantId,
        favorites: {
          some: {
            customer_id: userId,
          },
        },
      },
    });
  }

  async createDish(data: Prisma.DishCreateInput) {
    return prisma.dish.create({ data });
  }

  async updateDish(data: Prisma.DishUpdateInput, id: number) {
    return prisma.dish.update({
      where: { id },
      data,
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
    });
  }

  async updateFavoriteDishByUserId(
    userId: number,
    dishId: number,
    isFavorite: boolean
  ) {
    if (isFavorite) {
      await prisma.favoriteDish.create({
        data: {
          customer_id: userId,
          dish_id: dishId,
        },
      });
    } else {
      await prisma.favoriteDish.deleteMany({
        where: {
          customer_id: userId,
          dish_id: dishId,
        },
      });
    }
  }

  async isFavoriteDishByUserId(userId: number, dishId: number) {
    const favorite = await prisma.favoriteDish.findFirst({
      where: {
        customer_id: userId,
        dish_id: dishId,
      },
    });
    return !!favorite;
  }
}
