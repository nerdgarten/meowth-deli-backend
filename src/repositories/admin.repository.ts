import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";

export default class AdminRepository {
  private readonly userSelect = {
    id: true,
    email: true,
    roles: true
  } as const;

  private readonly defaultOptions = {
    include: { 
      user: { 
        select: {
          id: true,
          email: true,
          roles: true
        } 
      } 
    },
    orderBy: { id: "desc" as const }
  };

  async listRestaurants(where?: Prisma.RestaurantWhereInput) {
    return prisma.restaurant.findMany({
      where,
      ...this.defaultOptions
    });
  }

  async updateRestaurant(restaurantId: number, data: Prisma.RestaurantUpdateInput) {
    return prisma.restaurant.update({
      where: { id: restaurantId },
      data,
      include: this.defaultOptions.include
    });
  }

  // Driver methods
  async listDrivers(where?: Prisma.DriverWhereInput) {
    return prisma.driver.findMany({
      where,
      ...this.defaultOptions
    });
  }

  async updateDriver(driverId: number, data: Prisma.DriverUpdateInput) {
    return prisma.driver.update({
      where: { id: driverId },
      data,
      include: this.defaultOptions.include
    });
  }
}