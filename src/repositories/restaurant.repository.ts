import { StatusCodes } from "http-status-codes";

import { Prisma } from "@/generated/prisma/client";
import { VerificationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";
import { AppError } from "@/types/error";

export default class RestaurantRepository {
  async getRestaurants() {
    try {
      return prisma.restaurant.findMany({
        include: {
          location: true,
        },
        orderBy: { id: "desc" },
      });
    } catch (err: unknown) {
      console.error("RestaurantRepository.getRestaurants error", err);
      throw new AppError(
        "Failed to fetch restaurants",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getRestaurantProfileById(id: number) {
    try {
      return prisma.restaurant.findUnique({
        include: {
          location: true,
        },
        where: { id },
      });
    } catch (err: unknown) {
      console.error("RestaurantRepository.getRestaurantProfileById error", err);
      throw new AppError(
        "Failed to fetch restaurant profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
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
    try {
      return prisma.restaurant.findMany({
        where: { verification_status: status },
        include: {
          location: true,
        },
      });
    } catch (err: unknown) {
      console.error("RestaurantRepository.getRestaurantsByStatus error", err);
      throw new AppError(
        "Failed to fetch restaurants by status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateRestaurnatProfileById(
    id: number,
    data: Prisma.RestaurantUpdateInput
  ) {
    try {
      return prisma.restaurant.update({
        where: { id },
        data: data,
        include: {
          location: true,
        },
      });
    } catch (err: unknown) {
      console.error(
        "RestaurantRepository.updateRestaurnatProfileById error",
        err
      );
      throw new AppError(
        "Failed to update restaurant profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
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
