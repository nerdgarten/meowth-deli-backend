import crypto from "crypto";

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import RestaurantService from "@/services/restaurant.service";
import { handleError } from "@/utils/handleError";
import {
  uploadManageFilesStatus,
  updateFileStatus,
  resultingFilePath,
  resultingUploadPath,
  resultingManagePath,
} from "@/utils/fileConfig";
import path from "path";
import { AppError } from "@/types/error";
import { cwd } from "process";

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
}
