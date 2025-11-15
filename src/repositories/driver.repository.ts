import { Prisma } from "@/generated/prisma/browser";
import { VerificationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";

export default class DriverRepository {
  async getDrivers() {
    return prisma.driver.findMany({
      orderBy: { id: "desc" },
    });
  }

  async getDriverProfileById(id: number) {
    return prisma.driver.findUnique({
      where: { id },
    });
  }

  async getDriverByStatus(status: VerificationStatus) {
    return prisma.driver.findMany({
      where: { verification_status: status },
    });
  }

  async updateDriverProfileById(
    driverId: number,
    data: Prisma.DriverUpdateInput
  ) {
    return prisma.driver.update({
      where: { id: driverId },
      data: data,
    });
  }

  async updateDriverAvailabilityById(id: number, is_available: boolean) {
    return prisma.driver.update({
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

*/
