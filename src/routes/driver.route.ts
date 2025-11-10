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

    this.router.get(
      "/orders/:id",
      this.driverController.getDriverOrderById.bind(this.driverController),
    );
    this.router.get(
      "/payments",
      this.driverController.getDriverPayments.bind(this.driverController)
    );
  }
}
