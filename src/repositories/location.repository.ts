import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";

export default class LocationRepository {
  async createCustomerLocation(data: Prisma.CustomerLocationCreateInput) {
    return await prisma.customerLocation.create({
      data: data,
      include: {
        location: true,
      },
    });
  }

  async isCustomerLocation(customerId: number, locationId: number) {
    const count = await prisma.customerLocation.count({
      where: {
        customer_id: customerId,
        location_id: locationId,
      },
    });
    return count > 0;
  }

  async getLocationByCustomerId(customerId: number) {
    return prisma.customerLocation.findMany({
      where: { customer_id: customerId },
      include: { location: true },
    });
  }

  async getLocationById(locationId: number) {
    return prisma.location.findUnique({
      where: { id: locationId },
    });
  }

  async createRestaurantLocation(data: Prisma.LocationCreateInput) {
    return await prisma.location.create({
      data: data,
      include: {
        restaurant: true,
      },
    });
  }

  async getLocationByRestaurantId(restaurantId: number) {
    return prisma.location.findFirst({
      where: {
        restaurant: {
          id: restaurantId,
        },
      },
    });
  }

  async createDriverLocation(data: Prisma.LocationCreateInput) {
    return await prisma.location.create({
      data: data,
      include: {
        driver: true,
      },
    });
  }

  async getLocationByDriverId(driverId: number) {
    return prisma.location.findFirst({
      where: {
        driver: {
          id: driverId,
        },
      },
    });
  }

  async updateLocationById(
    locationId: number,
    data: Prisma.LocationUpdateInput
  ) {
    return prisma.location.update({
      where: { id: locationId },
      data: data,
    });
  }
}
