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

// findCustomerLocation(
//   locationId: number,
//   customerId: number
// ): Promise<Location | null> {
//   return prisma.location.findFirst({
//     where: {
//       id: locationId,
//       customer_id: customerId,
//     },
//   });
// }

// listCustomerLocations(customerId: number): Promise<Location[]> {
//   return prisma.location.findMany({
//     where: {
//       customer_id: customerId,
//     },
//     orderBy: {
//       updated_at: "desc",
//     },
//   });
// }

// updateLocation(
//   locationId: number,
//   data: Partial<ILocation>
// ): Promise<Location> {
//   const updateData: Prisma.LocationUpdateInput = {};

//   if (data.address !== undefined) {
//     updateData.address = data.address;
//   }

//   if (data.customer_id !== undefined) {
//     updateData.customer = {
//       connect: {
//         id: data.customer_id,
//       },
//     };
//   }

//   if (data.is_default !== undefined) {
//     updateData.is_default = data.is_default;
//   }

//   return prisma.location.update({
//     where: {
//       id: locationId,
//     },
//     data: updateData,
//   });
// }

// setDefaultLocation(
//   customerId: number,
//   locationId: number
// ): Promise<Location> {
//   return prisma.$transaction(async (tx) => {
//     await tx.location.updateMany({
//       where: {
//         customer_id: customerId,
//         NOT: {
//           id: locationId,
//         },
//       },
//       data: {
//         is_default: false,
//       },
//     });

//     return tx.location.update({
//       where: {
//         id: locationId,
//       },
//       data: {
//         is_default: true,
//       },
//     });
//   });
// }
