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
      "/:id/dish",
      this.restaurantController.getDishesByRestaurantId.bind(
        this.restaurantController
      )
    );
    this.router.get(
      "/:id",
      this.restaurantController.getRestaurantById.bind(
        this.restaurantController
      )
    );
  }
}
