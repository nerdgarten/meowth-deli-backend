import { prisma } from "@/libs/prisma";
import { DriverWhereClause } from "@/types/driver/driver";

export default class DriverRepository {
  async getDriverOrdersByStatus(whereClause: DriverWhereClause) {
    return prisma.order.findMany({
      where: whereClause
    });
  }
}
