import { Router } from "express";

import { LocationController } from "@/controllers/location.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

export class LocationRouter extends BaseRouter {
  private controller: LocationController;

  constructor() {
    super({
      prefix: "/location",
      middleware: [authMiddleware]
    });
    this.controller = new LocationController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/:id/setDefault",
      this.controller.setDefault.bind(this.controller)
    );
    this.router.post("/", this.controller.createLocation.bind(this.controller));
    this.router.get(
      "/customer",
      this.controller.getLocations.bind(this.controller)
    );
    this.router.patch(
      "/:id",
      this.controller.updateLocation.bind(this.controller)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
