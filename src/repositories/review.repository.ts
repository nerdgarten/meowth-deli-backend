import { prisma } from "@/libs/prisma";

import type { Prisma } from "@/generated/prisma/client";

const DRIVER_REVIEW_INCLUDE = {
  customer: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  },
  driver: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  },
};

const RESTAURANT_REVIEW_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
    },
  },
  restaurant: {
    select: {
      id: true,
      name: true,
    },
  },
};

export default class ReviewRepository {
  async getDriverReviewsById(driverId: number) {
    return prisma.driverReview.findMany({
      where: { driver_id: driverId },
      include: DRIVER_REVIEW_INCLUDE,
    });
  }

  async getRestaurantReviewsById(restaurantId: number) {
    return prisma.restaurantReview.findMany({
      where: { restaurant_id: restaurantId },
      include: RESTAURANT_REVIEW_INCLUDE,
    });
  }

  async createDriverReview(data: Prisma.DriverReviewCreateInput) {
    return prisma.driverReview.create({
      data,
      include: DRIVER_REVIEW_INCLUDE,
    });
  }

  async createRestaurantReview(data: Prisma.RestaurantReviewCreateInput) {
    return prisma.restaurantReview.create({
      data,
      include: RESTAURANT_REVIEW_INCLUDE,
    });
  }
}
