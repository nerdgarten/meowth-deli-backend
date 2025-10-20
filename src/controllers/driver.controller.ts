import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import DriverService from "@/services/driver.service";
import { AppError } from "@/types/error";

export class DriverController {
  private driverService: DriverService;

  constructor() {
    this.driverService = new DriverService();
  }

  async getDriverById(req: Request, res: Response) {
    try {
      const driverId = parseInt(req.params.driverId, 10);
      const driver = await this.driverService.getDriverById(driverId);

      res.status(StatusCodes.OK).json(driver);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
}
