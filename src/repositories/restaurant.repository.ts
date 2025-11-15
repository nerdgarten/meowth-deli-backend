import { Prisma } from "@/generated/prisma/browser";
import { VerificationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";

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

  async getRestaurantsByStatus(status: VerificationStatus) {
    return prisma.restaurant.findMany({
      where: { verification_status: status },
    });
  }

  async updateRestaurnatProfileById(
    id: number,
    data: Prisma.RestaurantUpdateInput
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
