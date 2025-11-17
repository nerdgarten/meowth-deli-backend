import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import DishService from "@/services/dish.service";
import { AppError } from "@/types/error";
import { resultingFilePath } from "@/utils/fileConfig";
import { handleError } from "@/utils/handleError";

export class DishController {
  private dishService: DishService;

  constructor() {
    this.dishService = new DishService();
  }

  async createDish(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      if (!userId)
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);
      let filePath: string | undefined = undefined;
      if (req.file) {
        filePath = resultingFilePath(req);
      }

      const newDish = await this.dishService.createDish({
        restaurant_id: userId,
        ...req.body,
        image: filePath,
      });

      res.status(StatusCodes.CREATED).json(newDish);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async getAllDishes(req: Request, res: Response) {
    try {
      const dishes = await this.dishService.getAllDishes();

      res.status(StatusCodes.OK).json(dishes);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async getDishById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dish = await this.dishService.getDishById(Number(id));

      res.status(StatusCodes.OK).json(dish);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async getDishesByRestaurantId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dishes = await this.dishService.getDishesByRestaurantId(Number(id));

      res.status(StatusCodes.OK).json(dishes);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async getFavoriteDishesByUserId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { restaurantId } = req.params;
      console.log("restaurantId", restaurantId);
      console.log("userId", userId);

      if (!userId)
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);

      const dishes = await this.dishService.getFavoriteDishesByUserId(
        userId,
        Number(restaurantId)
      );

      res.status(StatusCodes.OK).json(dishes);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async updateDish(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!userId)
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);

      let filePath: string | undefined = undefined;
      if (req.file) {
        filePath = resultingFilePath(req);
      }

      const updatedDish = await this.dishService.updateDish(
        Number(id),
        userId,
        { ...req.body, image: filePath }
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
      const userId = req.user!.id;
      const { id } = req.params;

      if (!userId)
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);

      const result = await this.dishService.deleteDish(Number(id), userId);

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async updateDishStockStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const { is_out_of_stock } = req.body;

      if (!userId)
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);

      if (typeof is_out_of_stock !== "boolean")
        throw new AppError(
          "is_out_of_stock must be a boolean value",
          StatusCodes.BAD_REQUEST
        );

      const updatedDish = await this.dishService.updateDishStockStatus(
        Number(id),
        userId,
        is_out_of_stock
      );

      res.status(StatusCodes.OK).json(updatedDish);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async updateFavoriteDishByUserId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { dishId, isFavorite } = req.body;

      if (!userId)
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);

      if (typeof isFavorite !== "boolean")
        throw new AppError(
          "isFavorite must be a boolean value",
          StatusCodes.BAD_REQUEST
        );

      await this.dishService.updateFavoriteDishByUserId(
        userId,
        Number(dishId),
        isFavorite
      );

      res
        .status(StatusCodes.OK)
        .json({ message: "Favorite dish status updated successfully" });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async checkFavoriteDish(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { dishId } = req.params;

      if (!userId)
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);

      const isFavorite = await this.dishService.checkFavoriteDish(
        userId,
        Number(dishId)
      );

      res.status(StatusCodes.OK).json({ isFavorite });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }
}
