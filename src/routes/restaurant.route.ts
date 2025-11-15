import { RestaurantController } from "@/controllers/restaurant.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { fileMiddleware } from "@/middlewares/file.middleware";
import {
  restaurantBannerConfig,
  certificateFileConfig,
} from "@/utils/fileConfig";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { Role } from "@/generated/prisma/browser";

export class RestaurantRouter extends BaseRouter {
  private restaurantController: RestaurantController;

  constructor() {
    super({
      prefix: "/restaurant",
      middleware: [authMiddleware],
    });

    this.restaurantController = new RestaurantController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.get(
      "/",
      this.restaurantController.getRestaurants.bind(this.restaurantController)
    );
    this.router.get(
      "/profile",
      this.restaurantController.getRestaurantProfile.bind(
        this.restaurantController
      )
    );
    this.router.patch(
      "/profile",
      fileMiddleware(restaurantBannerConfig),
      this.restaurantController.updateRestaurantProfile.bind(
        this.restaurantController
      )
    );
    this.router.patch(
      "/availability",
      authMiddleware,
      this.restaurantController.updateRestaurantAvailability.bind(
        this.restaurantController
      )
    );
    this.router.post(
      "/upload",
      roleMiddleware(Role.restaurant),
      fileMiddleware(certificateFileConfig),
      this.restaurantController.uploadCertificateFile.bind(
        this.restaurantController
      )
    );
  }
}
