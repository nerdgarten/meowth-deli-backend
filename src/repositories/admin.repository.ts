import { Prisma, VerificationStatus } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";

export default class AdminRepository {
  private readonly userSelect = {
    id: true,
    email: true,
    roles: true,
  } as const;

  private readonly defaultOptions = {
    include: {
      user: {
        select: {
          id: true,
          email: true,
          roles: true,
        },
      },
    },
    orderBy: { id: "desc" as const },
  };

  async listRestaurants(where?: Prisma.RestaurantWhereInput) {
    return prisma.restaurant.findMany({
      where,
      ...this.defaultOptions,
    });
  }

  async updateRestaurant(restaurantId: number, status: VerificationStatus) {
    return prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        verification_status: status,
      },
      include: this.defaultOptions.include,
    });
  }

  async listDrivers(where?: Prisma.DriverWhereInput) {
    return prisma.driver.findMany({
      where,
      ...this.defaultOptions,
    });
  }

  async updateDriver(driverId: number, status: VerificationStatus) {
    return prisma.driver.update({
      where: { id: driverId },
      data: {
        verification_status: status,
      },
      include: this.defaultOptions.include,
    });
  }
  async listRestaurantReviews() {
    return prisma.restaurantReview.findMany({
      include: {
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
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async deleteRestaurantReview(reviewId: number) {
    return prisma.restaurantReview.delete({
      where: { id: reviewId },
    });
  }
}
