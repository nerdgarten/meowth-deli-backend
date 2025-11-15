import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import MapService from "@/services/map.service";
import { AppError } from "@/types/error";
import {
  IGeocodeRequest,
  IMapSVGRequest,
  IReverseGeocodeRequest,
} from "@/types/map";

export class MapController {
  private mapService: MapService;

  constructor() {
    this.mapService = new MapService();
  }

  // Error handling method
  private handleError(error: unknown, res: Response) {
    console.error(error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
    } else if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Unexpected error occurred",
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred",
      });
    }
  }

  // Get Map SVG with markers
  async getMapSVG(req: Request, res: Response) {
    try {
      const request = req.body as IMapSVGRequest;

      if (
        !request.center ||
        typeof request.center.lat !== "number" ||
        typeof request.center.lng !== "number"
      ) {
        throw new AppError(
          "Invalid center coordinates",
          StatusCodes.BAD_REQUEST
        );
      }

      const mapSVG = await this.mapService.getMapSVG(request);
      res.status(StatusCodes.OK).json(mapSVG);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Reverse Geocode - Get address from coordinates
  async reverseGeocode(req: Request, res: Response) {
    try {
      const request = req.body as IReverseGeocodeRequest;

      if (
        !request.location ||
        typeof request.location.lat !== "number" ||
        typeof request.location.lng !== "number"
      ) {
        throw new AppError(
          "Invalid location coordinates",
          StatusCodes.BAD_REQUEST
        );
      }

      const result = await this.mapService.reverseGeocode(request);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Geocode - Get coordinates from address
  async geocode(req: Request, res: Response) {
    try {
      const request = req.body as IGeocodeRequest;

      if (!request.address || typeof request.address !== "string") {
        throw new AppError("Invalid address", StatusCodes.BAD_REQUEST);
      }

      const result = await this.mapService.geocode(request);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
