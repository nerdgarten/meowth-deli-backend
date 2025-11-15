import { DriverController } from "@/controllers/driver.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Role } from "@/types/role";

import { BaseRouter } from "./baseRouter";
import {
  profilePictureConfig,
  certificateFileConfig,
} from "@/utils/fileConfig";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";

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
    this.router.post(
      "/upload",
      roleMiddleware(Role.driver),
      fileMiddleware(certificateFileConfig),
      this.driverController.uploadCertificateFile.bind(this.driverController)
    );
  }
}
