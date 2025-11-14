import { VerificationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";
import { IRestaurantProfile } from "@/types/users/restaurant";

export default class RestaurantRepository {
  async getRestaurants() {
    return prisma.restaurant.findMany({
      orderBy: { id: "desc" },
    });
  }

  async getRestaurantProfileById(id: number) {
    return prisma.restaurant.findUnique({
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
    });
  }

  async findRestaurantsByStatus(
    status: VerificationStatus,
    limit: number,
    offset: number
  ) {
    return prisma.restaurant.findMany({
      where: {
        verification_status: status,
      },
      take: limit,
      skip: offset,
    });
  }

  async updateRestaurnatProfileById(
    id: number,
    data: Partial<IRestaurantProfile>
  ) {
    return prisma.restaurant.update({
      where: { id },
      data: data,
    });
  }

  async updateRestaurantAvailabilityById(id: number, is_available: boolean) {
    return prisma.restaurant.update({
      where: { id },
      data: { is_available },
    });
  }
}

/*
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
*/
