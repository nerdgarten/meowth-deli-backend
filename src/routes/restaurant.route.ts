import { RestaurantController } from "@/controllers/restaurant.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class RestaurantRouter extends BaseRouter {
  private restaurantController: RestaurantController;

  constructor() {
    super({ prefix: "/restaurant" });

    this.restaurantController = new RestaurantController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.get(
      "/",
      this.restaurantController.getRestaurantsByStatus.bind(
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
    this.router.get(
      "/orders",
      authMiddleware,
      this.restaurantController.getRestaurantOrders.bind(this.restaurantController)
    );

    this.router.patch(
      "/orders/:orderId/status",
      authMiddleware,
      this.restaurantController.updateOrderStatus.bind(this.restaurantController)
    );
  }
}
