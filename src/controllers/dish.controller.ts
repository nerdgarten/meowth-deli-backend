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

  async createDish(req: Request, res: Response) {
    try {
      const { dishData, user_id } = req.body;
      const userId = Number(user_id);

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
        return;
      }

      const newDish = await this.dishService.createDish(userId, dishData);

      res.status(StatusCodes.CREATED).json(newDish);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during dish creation:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async getAllDishes(req: Request, res: Response) {
    try {
      const { limit, offset } = req.query;
      const dishes = await this.dishService.getAllDishes(
        Number(limit) || 10,
        Number(offset) || 0
      );

      res.status(StatusCodes.OK).json(dishes);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during dish retrieval:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async getDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dish = await this.dishService.getDishById(Number(id));

      res.status(StatusCodes.OK).json(dish);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during dish retrieval:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async updateDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { updateData, user_id } = req.body;
      const userId = Number(user_id);

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
        return;
      }

      const updatedDish = await this.dishService.updateDish(
        Number(id),
        updateData,
        userId
      );

      res.status(StatusCodes.OK).json(updatedDish);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during dish update:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async deleteDish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { user_id } = req.body;
      const userId = Number(user_id);

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
        return;
      }

      const result = await this.dishService.deleteDish(Number(id), userId);

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during dish deletion:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async updateDishStockStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { is_out_of_stock, user_id } = req.body;
      const userId = Number(user_id);

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
        return;
      }

      if (typeof is_out_of_stock !== "boolean") {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "is_out_of_stock must be a boolean value" });
        return;
      }

      const updatedDish = await this.dishService.updateDishStockStatus(
        Number(id),
        userId,
        is_out_of_stock
      );

      res.status(StatusCodes.OK).json(updatedDish);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during dish stock status update:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
}
