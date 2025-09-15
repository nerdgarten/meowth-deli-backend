import { VerificationStatus } from "@/generated/prisma";
import RestaurantService from "@/services/restaurant.service";
import { AppError } from "@/types/error";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class RestaurantController {
  private restaurantService: RestaurantService;

  constructor() {
    this.restaurantService = new RestaurantService();
  }

  async getRestaurantsByStatus(req: Request, res: Response) {
    try {
      const { status, limit, offset } = req.query;
      const result = await this.restaurantService.getRestaurantsByStatus(
        (status as VerificationStatus) || undefined,
        Number(limit) || 10,
        Number(offset) || 0
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during get restaurants:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async searchDishes(req: Request, res: Response) {
    try {
      const { keyword, limit, offset } = req.query;
      const result = await this.restaurantService.searchDishes(
        String(keyword),
        Number(limit) || 10,
        Number(offset) || 0
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during dish search:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
}
