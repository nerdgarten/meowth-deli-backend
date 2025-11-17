import { Prisma } from "@/generated/prisma/client";
import { VerificationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";
import { AppError } from "@/types/error";
import { StatusCodes } from "http-status-codes";

export default class DriverRepository {
  async getDrivers(onlyActive = true) {
    return prisma.driver.findMany({
      where: {
        is_available: onlyActive ? true : undefined,
        user: {
          is_deleted: false,
        },
      },
      orderBy: { id: "desc" },
    });
  }

  async getDriverProfileById(id: number) {
    try {
      return prisma.driver.findUnique({ where: { id } });
    } catch (err: unknown) {
      console.error("DriverRepository.getDriverProfileById error", err);
      throw new AppError(
        "Failed to fetch driver profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDriverByStatus(status: VerificationStatus) {
    try {
      return prisma.driver.findMany({ where: { verification_status: status } });
    } catch (err: unknown) {
      console.error("DriverRepository.getDriverByStatus error", err);
      throw new AppError(
        "Failed to fetch drivers by status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateDriverProfileById(
    driverId: number,
    data: Prisma.DriverUpdateInput
  ) {
    try {
      return prisma.driver.update({ where: { id: driverId }, data: data });
    } catch (err: unknown) {
      console.error("DriverRepository.updateDriverProfileById error", err);
      throw new AppError(
        "Failed to update driver profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
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
