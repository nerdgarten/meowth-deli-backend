import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import ProfileService from "@/services/profile.service";
import { AppError } from "@/types/error";

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  async updateCustomerProfile(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      if (!userId) {
        throw new AppError("Invalid user ID", StatusCodes.BAD_REQUEST);
      }
      const updatedProfile = await this.profileService.updateCustomerProfile(
        userId,
        req.body,
      );

      res.status(StatusCodes.OK).json({
        message: `Profile updated successfully`,
        data: updatedProfile,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async updateRestaurantProfile(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      if (!userId) {
        throw new AppError("Invalid user ID", StatusCodes.BAD_REQUEST);
      }
      const updatedProfile = await this.profileService.updateRestaurantProfile(
        userId,
        req.body,
      );

      res.status(StatusCodes.OK).json({
        message: `Profile updated successfully`,
        data: updatedProfile,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  async updateDriverProfile(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      if (!userId) {
        throw new AppError("Invalid user ID", StatusCodes.BAD_REQUEST);
      }
      const updatedProfile = await this.profileService.updateDriverProfile(
        userId,
        req.body,
      );

      res.status(StatusCodes.OK).json({
        message: `Profile updated successfully`,
        data: updatedProfile,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
}
