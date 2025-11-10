import { Router } from "express";

import { AdminController } from "@/controllers/admin.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class AdminRouter extends BaseRouter {
  private controller: AdminController;

  constructor() {
    super({ prefix: "/admin", middleware: [authMiddleware] });
    this.controller = new AdminController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant verification routes
    this.router.get(
      "/restaurants",
      this.controller.listRestaurants.bind(this.controller),
    );
    this.router.patch(
      "/restaurants/:id/verify",
      this.controller.verifyRestaurant.bind(this.controller),
    );

    // Driver verification routes
    this.router.get(
      "/drivers",
      this.controller.listDrivers.bind(this.controller),
    );
    this.router.patch(
      "/drivers/:id/verify",
      this.controller.verifyDriver.bind(this.controller),
    );
    this.router.get(
      "/drivers/file-pending",
      this.controller.getPendingVerifiedDrivers.bind(this.controller),
    );
    this.router.get(
      "/drivers/file-pending/:id",
      this.controller.getFileIdPendingVerifiedDriver.bind(this.controller),
    );
    this.router.get(
      "/restaurants/file-pending",
      this.controller.getPendingVerifiedRestaurants.bind(this.controller),
    );
    this.router.get(
      "/restaurants/file-pending/:id",
      this.controller.getFileIdPendingVerifiedRestaurants.bind(this.controller),
    );

    this.router.get(
      "/drivers/files/:id/:fileId",
      this.controller.getDriverFileById.bind(this.controller),
    );
    this.router.get(
      "/restaurants/files/:id/:fileId",
      this.controller.getRestaurantFileById.bind(this.controller),
    );
    this.router.get(
      "/user/admin",
      this.controller.getUserAdmin.bind(this.controller)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
