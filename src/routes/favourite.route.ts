import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

import { FavouriteController } from "@/controllers/favourite.controller";

export class FavouriteRouter extends BaseRouter {
  private favouriteController: FavouriteController;

  constructor() {
    super({ prefix: "/favouorite", middleware: [authMiddleware] });

    this.favouriteController = new FavouriteController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.router.post(
      "/restaurant",
      this.favouriteController.createFavouriteRestaurant.bind(this.favouriteController)
    );

    this.router.post(
      "/dish",
      this.favouriteController.createFavouriteDish.bind(this.favouriteController)
    );
    this.router.get(
      "/restaurant",
      this.favouriteController.getFavouriteRestaurants.bind(this.favouriteController)
    );
    this.router.get(
      "/dish",
      this.favouriteController.getFavouriteDishes.bind(this.favouriteController)
    );
    this.router.delete(
      "/restaurant/:id",
      this.favouriteController.deleteFavouriteRestaurant.bind(this.favouriteController)
    );
    this.router.delete(
      "/dish/:id",
      this.favouriteController.deleteFavouriteDish.bind(
        this.favouriteController
      )
    );
    this.router.get(
      "/dish/:dish_id",
      this.favouriteController.checkFavouriteDish.bind(this.favouriteController)
    );
    this.router.get(
      "/restaurant/:restaurant_id",
      this.favouriteController.checkFavouriteRestaurant.bind(this.favouriteController)
    );
    this.router.get(
      "/restaurant/:restaurant_id/dish",
      this.favouriteController.getFavouriteDishesByRestaurant.bind(this.favouriteController)
    );
  }
}
