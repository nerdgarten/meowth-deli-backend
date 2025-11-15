import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { DriverService } from "@/services/driver.service";
import { handleError } from "@/utils/handleError";

export class DriverController {
  private driverService: DriverService;

  constructor() {
    this.driverService = new DriverService();
  }

  async getDriverProfileById(req: Request, res: Response) {
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
        filePath = `${process.env.BASE_UPLOAD_URL}/${req.uploadFolder}/${req.user!.id}${req.file.filename}`;
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
}
