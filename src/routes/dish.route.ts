import { DishController } from "@/controllers/dish.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
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
    this.router.get(
      "/",
      this.dishController.getAllDishes.bind(this.dishController)
    );
    this.router.get(
      "/:id",
      this.dishController.getDishById.bind(this.dishController)
    );
    this.router.post(
      "/",
      authMiddleware,
      this.dishController.createDish.bind(this.dishController)
    );
    this.router.patch(
      "/:id",
      authMiddleware,
      this.dishController.updateDish.bind(this.dishController)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      this.dishController.deleteDish.bind(this.dishController)
    );
    this.router.patch(
      "/:id/stock-status",
      authMiddleware,
      this.dishController.updateDishStockStatus.bind(this.dishController)
    );
  }
}
