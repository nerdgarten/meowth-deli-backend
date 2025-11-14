import { VerificationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";

// import { OrderWhereClause } from "@/types/order/order";

export default class DriverRepository {
  async getDriverOrdersByStatus(status: VerificationStatus) {
    return prisma.order.findMany({
      where: {
        driver: {
          verification_status: status,
        },
      },
    });
  }

  // async getDriverOrderById(whereClause: OrderWhereClause) {
  //   return prisma.order.findFirst({
  //     where: whereClause,
  //   });
  // }
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
