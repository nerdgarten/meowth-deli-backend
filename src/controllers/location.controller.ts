import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import LocationService from "@/services/location.service";
import { handleError } from "@/utils/handleError";
export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  async createCustomerLocation(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const locationData = req.body;
      const createdLocation = await this.locationService.createCustomerLocation(
        userId,
        locationData
      );
      res.status(StatusCodes.CREATED).json(createdLocation);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getLocationsByCustomerId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const locations =
        await this.locationService.getLocationsByCustomerId(userId);
      res.status(StatusCodes.OK).json(locations);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getDefaultLocationByCustomerId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const location =
        await this.locationService.getDefaultLocationByCustomerId(userId);
      res.status(StatusCodes.OK).json(location);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateDefaultLocationByCustomerId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { location_id } = req.body;
      const updatedLocation =
        await this.locationService.updateDefaultLocationByCustomerId(
          userId,
          location_id
        );
      res.status(StatusCodes.OK).json(updatedLocation);
    } catch (error) {
      handleError(error, res);
    }
  }

  async createRestaurantLocation(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const locationData = req.body;
      const createdLocation =
        await this.locationService.createRestaurantLocation(
          userId,
          locationData
        );
      res.status(StatusCodes.CREATED).json(createdLocation);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getRestaurantLocationByRestaurantId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const location =
        await this.locationService.getRestaurantLocationByRestaurantId(userId);
      res.status(StatusCodes.OK).json(location);
    } catch (error) {
      handleError(error, res);
    }
  }

  async createDriverLocation(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const locationData = req.body;
      const createdLocation = await this.locationService.createDriverLocation(
        userId,
        locationData
      );
      res.status(StatusCodes.CREATED).json(createdLocation);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getDriverLocationByDriverId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const location =
        await this.locationService.getDriverLocationByDriverId(userId);
      res.status(StatusCodes.OK).json(location);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateLocationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const locationData = req.body;
      const updatedLocation = await this.locationService.updateLocationById(
        Number(id),
        locationData
      );
      res.status(StatusCodes.OK).json(updatedLocation);
    } catch (error) {
      handleError(error, res);
    }
  }
}
