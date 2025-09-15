import { RestaurantController } from "@/controllers/restaurant.controller";
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
  }
}
