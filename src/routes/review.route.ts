import { Router } from "express";

import ReviewController from "@/controllers/review.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class ReviewRouter extends BaseRouter {
  private controller: ReviewController;

  constructor() {
    super({ prefix: "/review", middleware: [authMiddleware] });
    this.controller = new ReviewController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Driver Reviews
    this.router.post(
      "/driver/:driverId",
      this.controller.createDriverReview.bind(this.controller),
    );
    this.router.get(
      "/driver/:driverId",
      this.controller.listDriverReviews.bind(this.controller),
    );
    this.router.get(
      "/driver/:driverId/:reviewId",
      this.controller.getDriverReview.bind(this.controller),
    );

    // Restaurant Reviews
    this.router.post(
      "/restaurant/:restaurantId",
      this.controller.createRestaurantReview.bind(this.controller),
    );
    this.router.get(
      "/restaurant/:restaurantId",
      this.controller.listRestaurantReviews.bind(this.controller),
    );
    this.router.get(
      "/restaurant/:restaurantId/:reviewId",
      this.controller.getRestaurantReview.bind(this.controller),
    );

    // Order Reviews
    this.router.post(
      "/order/:orderId",
      this.controller.createOrderReviews.bind(this.controller),
    );
    this.router.get(
      "/order/:orderId",
      this.controller.getOrderReviews.bind(this.controller),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
