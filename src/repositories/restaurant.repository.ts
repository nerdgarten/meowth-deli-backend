import { Prisma } from "@/generated/prisma/browser";
import { VerificationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";

export default class RestaurantRepository {
  async getRestaurants() {
    return prisma.restaurant.findMany({
      include: {
        location: true,
      },
      orderBy: { id: "desc" },
    });
  }

  async getRestaurantProfileById(id: number) {
    return prisma.restaurant.findUnique({
      include: {
        location: true,
      },
      where: { id },
    });
  }

  async getFavoriteRestaurantByUserId(userId: number) {
    return prisma.restaurant.findMany({
      where: {
        favorites: {
          some: {
            customer_id: userId,
          },
        },
      },
      include: {
        location: true,
      },
    });
  }

  async getRestaurantsByStatus(status: VerificationStatus) {
    return prisma.restaurant.findMany({
      where: { verification_status: status },
      include: {
        location: true,
      },
    });
  }

  async updateRestaurnatProfileById(
    id: number,
    data: Prisma.RestaurantUpdateInput
  ) {
    return prisma.restaurant.update({
      where: { id },
      data: data,
      include: {
        location: true,
      },
    });
  }

  async updateRestaurantAvailabilityById(id: number, is_available: boolean) {
    return prisma.restaurant.update({
      where: { id },
      data: { is_available },
      include: {
        location: true,
      },
    });
  }

  async updateFavoriteRestaurantByUserId(
    userId: number,
    restaurantId: number,
    isFavorite: boolean
  ) {
    if (isFavorite) {
      await prisma.favoriteRestaurant.create({
        data: {
          customer_id: userId,
          restaurant_id: restaurantId,
        },
      });
    } else {
      await prisma.favoriteRestaurant.deleteMany({
        where: {
          customer_id: userId,
          restaurant_id: restaurantId,
        },
      });
    }
  }
}
