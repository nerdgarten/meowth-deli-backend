import { StatusCodes } from "http-status-codes";

import DriverRepository from "@/repositories/driver.repository";
import { AppError } from "@/types/error";

export default class DriverService {
  private driverRepository: DriverRepository;

  constructor() {
    this.driverRepository = new DriverRepository();
  }

  async getDriverById(driverId: number) {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }

    return driver;
  }
}
