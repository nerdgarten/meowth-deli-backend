import { DriverController } from "@/controllers/driver.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

export class DriverRouter extends BaseRouter {
  private driverController: DriverController;

  constructor() {
    super({ prefix: "/driver", middleware: [authMiddleware] });

    this.driverController = new DriverController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.router.get(
      "/:driverId",
      this.driverController.getDriverById.bind(this.driverController),
    );
  }
}
