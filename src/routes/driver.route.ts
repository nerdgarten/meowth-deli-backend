import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

import { DriverController } from "@/controllers/driver.controller";

export class DriverRouter extends BaseRouter {
  private driverController: DriverController;

  constructor() {
    super({ prefix: "/driver", middleware: [authMiddleware] });

    this.driverController = new DriverController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.router.get(
      "/orders",
      this.driverController.getDriverOrdersByStatus.bind(this.driverController),
    );

  }
}
