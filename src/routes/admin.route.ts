import { Router, Request, Response, NextFunction } from "express";
import { AdminController } from "@/controllers/admin.controller";
import { RestaurantController } from "@/controllers/restaurant.controller";
import { ReportController } from "@/controllers/report.controller";
import { BaseRouter } from "@/routes/baseRouter";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { certificateFileConfig } from "@/utils/fileConfig";
import { Role } from "@/types/role";
import { IJwtData } from "@/types/auth/jwt";

export class AdminRouter extends BaseRouter {
  private controller: AdminController;
  private restaurantController: RestaurantController;
  private reportController: ReportController;

  constructor() {
    super({
      prefix: "/admin",
      middleware: [authMiddleware, roleMiddleware(Role.admin)],
    });
    this.controller = new AdminController();
    this.restaurantController = new RestaurantController();
    this.reportController = new ReportController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant management
    this.router.get(
      "/restaurants",
      this.controller.listRestaurants.bind(this.controller)
    );
    this.router.get(
      "/restaurant",
      this.controller.listRestaurants.bind(this.controller)
    );
    this.router.patch(
      "/restaurants/:id/verify",
      this.controller.verifyRestaurant.bind(this.controller)
    );
    this.router.patch(
      "/restaurant/:id/verify",
      this.controller.verifyRestaurant.bind(this.controller)
    );

    // Driver management
    this.router.get(
      "/drivers",
      this.controller.listDrivers.bind(this.controller)
    );
    this.router.get(
      "/driver",
      this.controller.listDrivers.bind(this.controller)
    );
    this.router.patch(
      "/drivers/:id/verify",
      this.controller.verifyDriver.bind(this.controller)
    );
    this.router.patch(
      "/driver/:id/verify",
      this.controller.verifyDriver.bind(this.controller)
    );

    // Certificates listing
    this.router.get(
      "/drivers/certificate",
      this.controller.getPendingVerifiedDrivers.bind(this.controller)
    );
    this.router.get(
      "/drivers/:id/certificate",
      this.controller.getFileIdPendingVerifiedDriver.bind(this.controller)
    );
    this.router.get(
      "/drivers/certificate/:id/:fileId",
      this.controller.getDriverFileById.bind(this.controller)
    );

    this.router.get(
      "/restaurants/certificate",
      this.controller.getPendingVerifiedRestaurants.bind(this.controller)
    );
    this.router.get(
      "/restaurants/:id/certificate",
      this.controller.getFileIdPendingVerifiedRestaurants.bind(this.controller)
    );
    this.router.get(
      "/restaurants/certificate/:id/:fileId",
      this.controller.getRestaurantFileById.bind(this.controller)
    );

    // Admin uploads a certificate for a restaurant (impersonate the restaurant user for file saving)
    this.router.post(
      "/restaurant/upload",
      (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.body?.id ?? req.query?.id ?? req.params?.id);
        if (isNaN(id) || id <= 0) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid restaurant id" });
        }
        req.user = { id, role: Role.restaurant } as IJwtData;
        next();
      },
      fileMiddleware(certificateFileConfig),
      this.restaurantController.uploadCertificateFile.bind(
        this.restaurantController
      )
    );

    // Delete user by id (soft-delete)
    this.router.delete("/user/:id", (req: Request, res: Response) =>
      this.controller.deleteUserById(req, res)
    );

    // List users with optional role filter
    this.router.get("/users", this.controller.listUsers.bind(this.controller));

    // Report management
    this.router.get(
      "/reports",
      this.reportController.getReports.bind(this.reportController)
    );
    this.router.patch(
      "/reports/:id/resolve",
      this.reportController.resolveReport.bind(this.reportController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
