import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import DishService from "@/services/dish.service";
import { AppError } from "@/types/error";

export class DishController {
  private dishService: DishService;

  constructor() {
    this.dishService = new DishService();
  }

  async searchDishes(req: Request, res: Response) {
    try {
      const { keyword, limit, offset } = req.query;
      const result = await this.dishService.searchDishes(
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
