import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/enums";
import RestaurantService from "@/services/restaurant.service";
import { handleError } from "@/utils/handleError";

export class RestaurantController {
  private restaurantService: RestaurantService;

  constructor() {
    this.restaurantService = new RestaurantService();
  }

  async getRestaurantProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile =
        await this.restaurantService.getRestaurantProfileById(userId);

      res.status(StatusCodes.OK).json(profile);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async updateRestaurantProfile(req: Request, res: Response) {
    try {
      let filePath: string | undefined = undefined;

      if (req.file) {
        filePath = `${process.env.BASE_UPLOAD_URL}/${req.uploadFolder}/${req.user!.id}${req.file.filename}`;
      }
      const userId = req.user!.id;
      const data = await this.restaurantService.updateRestaurnatProfileById(
        userId,
        {
          ...req.body,
          banner: filePath,
        }
      );

      res.status(StatusCodes.OK).json(data);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async updateRestaurantAvailability(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { is_available } = req.body;

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
        return;
      }

      const updatedRestaurant =
        await this.restaurantService.updateRestaurantAvailabilityById(
          userId,
          is_available
        );

      res.status(StatusCodes.OK).json(updatedRestaurant);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }
}
