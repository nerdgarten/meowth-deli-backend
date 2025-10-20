import { StatusCodes } from "http-status-codes";

import { OrderStatus } from "@/generated/prisma/enums";
import DriverRepository from "@/repositories/driver.repository";
import { DriverWhereClause } from "@/types/driver/driver";
import { AppError } from "@/types/error";

export class DriverService {
  private driverRepository: DriverRepository;

  constructor() {
    this.driverRepository = new DriverRepository();
  }

  async getDriverOrdersByStatus(driver_id: number, status: OrderStatus | undefined) {

    if (status && !Object.values(OrderStatus).includes(status)) {
      throw new AppError("Invalid status value", StatusCodes.BAD_REQUEST);
    }

    const whereClause: DriverWhereClause = {
      driver_id: driver_id,
      status: status,
    };

    const orders = await this.driverRepository.getDriverOrdersByStatus(whereClause);
    return orders;
  }
}
