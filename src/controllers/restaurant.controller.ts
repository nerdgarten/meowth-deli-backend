import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/enums";
import RestaurantService from "@/services/restaurant.service";
import { AppError } from "@/types/error";

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

  async updateRestaurantAvailability(req: Request, res: Response) {
    try {
      const { is_available, user_id } = req.body;
      const userId = Number(user_id);

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
        return;
      }

      if (typeof is_available !== "boolean") {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "is_available must be a boolean value" });
        return;
      }

      const updatedRestaurant =
        await this.restaurantService.updateRestaurantAvailability(
          userId,
          is_available
        );

      res.status(StatusCodes.OK).json(updatedRestaurant);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error(
        "Unexpected error during restaurant availability update:",
        error
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
  async getDishesByRestaurantId(req: Request, res: Response) {
    try {
      const restaurantId = Number(req.params.id);

      const dishes =
        await this.restaurantService.getDishesByRestaurantId(restaurantId);
      res.status(StatusCodes.OK).json(dishes);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error(
        "Unexpected error during restaurant availability update:",
        error
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
  async getRestaurantById(req: Request, res: Response) {
    try {
      const restaurantId = Number(req.params.id);
      const restaurant =
        await this.restaurantService.getRestaurantById(restaurantId);
      res.status(StatusCodes.OK).json(restaurant);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error(
        "Unexpected error during restaurant availability update:",
        error
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
  async getRestaurantPayments(req: Request, res: Response) {
    try {
      const { id, role } = req.user!;
      if (role !== "restaurant") {
        res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
        return;
      }
      const payments = await this.restaurantService.getRestaurantPayments(id);
      res.status(StatusCodes.OK).json(payments);
    } catch (error: unknown) {
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
}
