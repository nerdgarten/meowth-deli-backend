import { prisma } from "@/libs/prisma";
import { Prisma, type Location } from "@/generated/prisma/client";
import { ILocation } from "@/types/location";

export default class LocationRepository {
  createLocation(data: ILocation): Promise<Location> {
    return prisma.location.create({
      data: {
        customer_id: data.customer_id,
        address: data.address,
        is_default: data.is_default ?? undefined,
      },
    });
  }

  findCustomerLocation(
    locationId: number,
    customerId: number
  ): Promise<Location | null> {
    return prisma.location.findFirst({
      where: {
        id: locationId,
        customer_id: customerId,
      },
    });
  }

  listCustomerLocations(customerId: number): Promise<Location[]> {
    return prisma.location.findMany({
      where: {
        customer_id: customerId,
      },
      orderBy: {
        updated_at: "desc",
      },
    });
  }

  updateLocation(
    locationId: number,
    data: Partial<ILocation>
  ): Promise<Location> {
    const updateData: Prisma.LocationUpdateInput = {};

    if (data.address !== undefined) {
      updateData.address = data.address;
    }

    if (data.customer_id !== undefined) {
      updateData.customer = {
        connect: {
          id: data.customer_id,
        },
      };
    }

    if (data.is_default !== undefined) {
      updateData.is_default = data.is_default;
    }

    return prisma.location.update({
      where: {
        id: locationId,
      },
      data: updateData,
    });
  }

  setDefaultLocation(
    customerId: number,
    locationId: number
  ): Promise<Location> {
    return prisma.$transaction(async (tx) => {
      await tx.location.updateMany({
        where: {
          customer_id: customerId,
          NOT: {
            id: locationId,
          },
        },
        data: {
          is_default: false,
        },
      });

      return tx.location.update({
        where: {
          id: locationId,
        },
        data: {
          is_default: true,
        },
      });
    });
  }
}
