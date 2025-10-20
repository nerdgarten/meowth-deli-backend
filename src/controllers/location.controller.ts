import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import LocationService from "@/services/location.service";
import { AppError } from "@/types/error";

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  async createLocation(req: Request, res: Response) {
    try {
      const location = await this.locationService.createLocation(req.body);

      res.status(StatusCodes.CREATED).json(location);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during location creation:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async setDefault(req: Request, res: Response) {
    try {
      const locationId = Number(req.params.id);
      if (Number.isNaN(locationId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid location id" });

        return;
      }

      const customerId = req.user?.id;
      if (!customerId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Unauthorized",
        });

        return;
      }

      const location = await this.locationService.setDefault(
        customerId,
        locationId
      );

      res.status(StatusCodes.OK).json(location);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during setting default location:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async getLocations(req: Request, res: Response) {
    try {
      const customerId = Number(req.params.id);
      if (Number.isNaN(customerId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid customer id" });

        return;
      }

      const locations = await this.locationService.getLocations(customerId);

      res.status(StatusCodes.OK).json(locations);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during fetching locations:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async updateLocation(req: Request, res: Response) {
    try {
      const locationId = Number(req.params.id);
      if (Number.isNaN(locationId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid location id" });

        return;
      }

      const updatedLocation = await this.locationService.updateLocation(
        locationId,
        req.body
      );

      res.status(StatusCodes.OK).json(updatedLocation);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during location update:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
}
