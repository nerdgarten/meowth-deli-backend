import { prisma } from "@/libs/prisma";
import { OrderWhereClause } from "@/types/order/order";

export default class DriverRepository {
  async getDriverOrdersByStatus(whereClause: OrderWhereClause) {
    return prisma.order.findMany({
      where: whereClause
    });
  }
  async getDriverOrderById(whereClause: OrderWhereClause) {
    return prisma.order.findFirst({
      where: whereClause
    });
  }
}

