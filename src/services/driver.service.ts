import { StatusCodes } from "http-status-codes";

import { OrderStatus } from "@/generated/prisma/enums";
import DriverRepository from "@/repositories/driver.repository";
import { AppError } from "@/types/error";
import { OrderWhereClause } from "@/types/order/order";

export class DriverService {
  private driverRepository: DriverRepository;

  constructor() {
    this.driverRepository = new DriverRepository();
  }

  async getDriverOrdersByStatus(
    driver_id: number,
    status: OrderStatus | undefined
  ) {
    if (status && !Object.values(OrderStatus).includes(status)) {
      throw new AppError("Invalid status value", StatusCodes.BAD_REQUEST);
    }

    const whereClause: OrderWhereClause = {
      driver_id: driver_id,
      status: status,
    };

    const orders =
      await this.driverRepository.getDriverOrdersByStatus(whereClause);
    return orders;
  }

  async getDriverOrderById(driver_id: number, order_id: number) {
    const whereClause: OrderWhereClause = {
      driver_id: driver_id,
      id: order_id,
    };
    const order = await this.driverRepository.getDriverOrderById(whereClause);
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }
    return order;
  }
  async getDriverPayments(driver_id: number) {
    const payments = await this.driverRepository.getDriverPayments(driver_id);
    return payments;
  }
  
}
