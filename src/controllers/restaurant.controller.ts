import crypto from "crypto";
import path from "path";
import { cwd } from "process";

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import RestaurantService from "@/services/restaurant.service";
import { AppError } from "@/types/error";
import {
  uploadManageFilesStatus,
  updateFileStatus,
  resultingFilePath,
  resultingUploadPath,
  resultingManagePath,
} from "@/utils/fileConfig";
import { handleError } from "@/utils/handleError";

export class RestaurantController {
  private restaurantService: RestaurantService;

  constructor() {
    this.restaurantService = new RestaurantService();
  }

  async getRestaurants(req: Request, res: Response) {
    try {
      const restaurants = await this.restaurantService.getRestaurants();
      res.status(StatusCodes.OK).json(restaurants);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async getRestaurantProfileById(req: Request, res: Response) {
    try {
      const restaurantId = Number(req.params.restaurantId);
      const restaurant =
        await this.restaurantService.getRestaurantProfileById(restaurantId);

      res.status(StatusCodes.OK).json(restaurant);
    } catch (error: unknown) {
      handleError(error, res);
    }
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
        filePath = resultingFilePath(req);
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

  async uploadCertificateFile(req: Request, res: Response) {
    try {
      if (!req.file)
        throw new AppError("No file uploaded", StatusCodes.BAD_REQUEST);
      const filePath = resultingFilePath(req);
      const managePath = resultingManagePath(req);
      const uploadPath = resultingUploadPath(req);

      updateFileStatus(uploadPath, {
        id: crypto.randomBytes(8).toString("hex"), // generates a random 32-character hex string
        filename: filePath,
        uploadedAt: new Date().toISOString(),
        status: "pending",
      });
      uploadManageFilesStatus(
        managePath,
        req.user!.id.toString(),
        "no",
        path.join(uploadPath, "status.yaml")
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "File uploaded successfully", filePath });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async getFavoriteRestaurantsByUserId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const favoriteRestaurants =
        await this.restaurantService.getFavoriteRestaurantsByUserId(userId);
      res.status(StatusCodes.OK).json(favoriteRestaurants);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateFavoriteRestaurantByUserId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { restaurantId, isFavorite } = req.body;
      await this.restaurantService.updateFavoriteRestaurantByUserId(
        userId,
        restaurantId,
        isFavorite
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Favorite updated successfully" });
    } catch (error) {
      handleError(error, res);
    }
  }
}
