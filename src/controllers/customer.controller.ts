import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import CustomerService from "@/services/customer.service";
import LocationService from "@/services/location.service";
import { handleError } from "@/utils/handleError";

export class CustomerController {
  private customerService: CustomerService;
  private locationService: LocationService;

  constructor() {
    this.customerService = new CustomerService();
    this.locationService = new LocationService();
  }

  async getCustomerProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await this.customerService.getCustomerProfileById(userId);

      res.status(StatusCodes.OK).json(profile);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateCustomerProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.customerService.updateCustomerProfileById(
        userId,
        req.body
      );

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getAllergy(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const allergies = await this.customerService.getAllergies(userId);
      res.status(StatusCodes.OK).json(allergies);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateAllergy(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { allergies } = req.body;
      const updatedAllergies = await this.customerService.updateAllergies(
        userId,
        allergies
      );
      res.status(StatusCodes.OK).json(updatedAllergies);
    } catch (error) {
      handleError(error, res);
    }
  }

  async createLocation(req: Request, res: Response) {
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
}
