import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { VerificationStatus, OrderStatus } from "@/generated/prisma/enums";
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

  async getRestaurantOrders(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const status = req.query.status as OrderStatus | undefined;
      
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
        return;
      }
      
      // Validate status if provided
      if (status && !Object.values(OrderStatus).includes(status)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid order status" });
        return;
      }
      
      const orders = await this.restaurantService.getRestaurantOrders(userId, status);
      
      res.status(StatusCodes.OK).json(orders);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during get restaurant orders:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const orderId = parseInt(req.params.orderId);
      const { status } = req.body;
      
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
        return;
      }
      
      if (isNaN(orderId) || !status) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Valid orderId and status are required" });
        return;
      }
      
      const allowedStatuses: OrderStatus[] = [OrderStatus.preparing, OrderStatus.rejected];
      if (!allowedStatuses.includes(status as OrderStatus)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid status. Can only update to 'preparing' or 'rejected'" });
        return;
      }
      
      const updatedOrder = await this.restaurantService.updateOrderStatus(userId, orderId, status as OrderStatus);
      
      res.status(StatusCodes.OK).json(updatedOrder);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error("Unexpected error during order status update:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async getDishesByRestaurantId(req: Request, res: Response) {
    try {
      const restaurantId = Number(req.params.id);

      const dishes = await this.restaurantService.getDishesByRestaurantId(restaurantId);
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
      const restaurant = await this.restaurantService.getRestaurantById(restaurantId);
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
}
