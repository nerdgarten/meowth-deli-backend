import { RestaurantController } from "@/controllers/restaurant.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { restaurantBannerConfig } from "@/utils/fileConfig";

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
  }
}
