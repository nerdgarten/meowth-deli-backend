import { Router } from "express";

import { LocationController } from "@/controllers/location.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

export class LocationRouter extends BaseRouter {
  private locationController: LocationController;

  constructor() {
    super({
      prefix: "/location",
      middleware: [authMiddleware],
    });
    this.locationController = new LocationController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/customer",
      this.locationController.createCustomerLocation.bind(
        this.locationController
      )
    );
    this.router.get(
      "/customer",
      this.locationController.getLocationsByCustomerId.bind(
        this.locationController
      )
    );
    this.router.get(
      "/customer/default",
      this.locationController.getDefaultLocationByCustomerId.bind(
        this.locationController
      )
    );
    this.router.patch(
      "/customer/default",
      this.locationController.updateDefaultLocationByCustomerId.bind(
        this.locationController
      )
    );
    this.router.get(
      "/restaurant",
      this.locationController.getRestaurantLocationByRestaurantId.bind(
        this.locationController
      )
    );
    this.router.post(
      "/restaurant",
      this.locationController.createRestaurantLocation.bind(
        this.locationController
      )
    );
    this.router.get(
      "/driver",
      this.locationController.getDriverLocationByDriverId.bind(
        this.locationController
      )
    );
    this.router.post(
      "/driver",
      this.locationController.createDriverLocation.bind(this.locationController)
    );
    this.router.put(
      "/:id",
      this.locationController.updateLocationById.bind(this.locationController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
