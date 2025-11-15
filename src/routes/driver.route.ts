import { DriverController } from "@/controllers/driver.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Role } from "@/types/role";

import { BaseRouter } from "./baseRouter";
import { profilePictureConfig } from "@/utils/fileConfig";
import { fileMiddleware } from "@/middlewares/file.middleware";

export class DriverRouter extends BaseRouter {
  private driverController: DriverController;

  constructor() {
    super({
      prefix: "/driver",
      middleware: [authMiddleware],
    });

    this.driverController = new DriverController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.router.get(
      "/profile",
      this.driverController.getDriverProfileById.bind(this.driverController)
    );
    this.router.patch(
      "/profile",
      fileMiddleware(profilePictureConfig),
      this.driverController.updateDriverProfileById.bind(this.driverController)
    );
    this.router.patch(
      "/availability",
      this.driverController.updateDriverAvailability.bind(this.driverController)
    );
    // this.router.get(
    //   "/orders",
    //   this.driverController.getDriverOrdersByStatus.bind(this.driverController)
    // );
    // this.router.get(
    //   "/orders/:id",
    //   this.driverController.getDriverOrderById.bind(this.driverController)
    // );
  }
}
