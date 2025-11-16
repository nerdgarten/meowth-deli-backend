import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { DriverService } from "@/services/driver.service";
import { handleError } from "@/utils/handleError";
import path from "path";
import { AppError } from "@/types/error";
import crypto from "crypto";
import { cwd } from "process";
import {
  uploadManageFilesStatus,
  updateFileStatus,
  resultingFilePath,
  resultingUploadPath,
  resultingManagePath,
} from "@/utils/fileConfig";

export class DriverController {
  private driverService: DriverService;

  constructor() {
    this.driverService = new DriverService();
  }

  async getDriverProfileById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const profile = await this.driverService.getDriverProfileById(
        Number(userId)
      );

      res.status(StatusCodes.OK).json(profile);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async getDriverProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await this.driverService.getDriverProfileById(userId);

      res.status(StatusCodes.OK).json(profile);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async updateDriverProfileById(req: Request, res: Response) {
    try {
      let filePath: string | undefined = undefined;
      if (req.file) {
        filePath = resultingFilePath(req);
      }
      const userId = req.user!.id;
      const data = await this.driverService.updateDriverProfileById(userId, {
        ...req.body,
        image: filePath,
      });

      res.status(StatusCodes.OK).json(data);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async updateDriverAvailability(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { is_available } = req.body;

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
        return;
      }

      const data = await this.driverService.updateDriverAvailabilityById(
        userId,
        is_available
      );

      res.status(StatusCodes.OK).json(data);
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
