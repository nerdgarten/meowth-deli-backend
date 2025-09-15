import { DishController } from "@/controllers/dish.controller";
import { BaseRouter } from "@/routes/baseRouter";

export class DishRouter extends BaseRouter {
  private dishController: DishController;

  constructor() {
    super({ prefix: "/dish" });

    this.dishController = new DishController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.get(
      "/search",
      this.dishController.searchDishes.bind(this.dishController)
    );
    this.router.post(
      "/",
      this.dishController.createDish.bind(this.dishController)
    );
  }
}
