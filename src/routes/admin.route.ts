import { Router } from "express";

import { AdminController } from "@/controllers/admin.controller";
import { BaseRouter } from "./baseRouter";

export class AdminRouter extends BaseRouter {
  private controller: AdminController;

  constructor() {
    super({ prefix: "/admin" });
    this.controller = new AdminController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant verification routes
    this.router.get(
      "/restaurants",
      this.controller.listRestaurants.bind(this.controller)
    );
    this.router.patch(
      "/restaurants/:id/verify",
      this.controller.verifyRestaurant.bind(this.controller)
    );

    // Driver verification routes
    this.router.get(
      "/drivers",
      this.controller.listDrivers.bind(this.controller)
    );
    this.router.patch(
      "/drivers/:id/verify",
      this.controller.verifyDriver.bind(this.controller)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
