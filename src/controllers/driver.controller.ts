import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { OrderStatus } from "@/generated/prisma/browser";
import { DriverService } from "@/services/driver.service";
import { AppError } from "@/types/error";

export class DriverController {
  private driverService: DriverService;

  constructor() {
    this.driverService = new DriverService();
  }

  async getDriverOrdersByStatus(req: Request, res: Response) {
    try {
      const { id } = req.user!;
      const { status } = req.query;

      const orders = await this.driverService.getDriverOrdersByStatus(id, (status as OrderStatus) || undefined);
      res.status(StatusCodes.OK).json(orders);
    }
    catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during get driver orders:", error);
      
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async getDriverOrderById(req: Request, res: Response) {
    try {
      const { id } = req.user!;
      const order_id = req.params.id;

      const orders = await this.driverService.getDriverOrderById(id, Number(order_id));
      res.status(StatusCodes.OK).json(orders);
    }
    catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during get driver order by id:", error);
      
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
}