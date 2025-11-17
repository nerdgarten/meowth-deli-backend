import { Router } from "express";

import ReviewController from "@/controllers/review.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { reviewConfig } from "@/utils/fileConfig";

export class ReviewRouter extends BaseRouter {
  private controller: ReviewController;

  constructor() {
    super({ prefix: "/review", middleware: [authMiddleware] });
    this.controller = new ReviewController();
    this.setUpRoutes();
  }

  private setUpRoutes(): void {
    // Driver Reviews
    /**
     * @swagger
     * /review/driver/{driverId}:
     *   post:
     *     summary: Create driver review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: driverId
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               rating:
     *                 type: integer
     *               comment:
     *                 type: string
     *     responses:
     *       201:
     *         description: Review created
     */
    this.router.post(
      "/driver",
      fileMiddleware(reviewConfig),
      this.controller.createDriverReview.bind(this.controller)
    );
    /**
     * @swagger
     * /review/driver/{driverId}:
     *   get:
     *     summary: List driver reviews
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: driverId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of reviews
     */
    this.router.get(
      "/driver/:driverId",
      this.controller.getDriverReviewsById.bind(this.controller)
    );
    /**
     * @swagger
     * /review/driver/{driverId}/{reviewId}:
     *   get:
     *     summary: Get driver review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: driverId
     *         required: true
     *         schema:
     *           type: integer
     *       - in: path
     *         name: reviewId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Review details
     */
    this.router.get(
      "/driver/:reviewId",
      this.controller.getDriverReviewByReviewId.bind(this.controller)
    );

    // Restaurant Reviews
    /**
     * @swagger
     * /review/restaurant/{restaurantId}:
     *   post:
     *     summary: Create restaurant review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: restaurantId
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               rating:
     *                 type: integer
     *               comment:
     *                 type: string
     *     responses:
     *       201:
     *         description: Review created
     */
    this.router.post(
      "/restaurant",
      fileMiddleware(reviewConfig),
      this.controller.createRestaurantReview.bind(this.controller)
    );
    /**
     * @swagger
     * /review/restaurant/{restaurantId}:
     *   get:
     *     summary: List restaurant reviews
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: restaurantId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of reviews
     */
    this.router.get(
      "/restaurant/:restaurantId",
      this.controller.getRestaurantReviewsById.bind(this.controller)
    );
    /**
     * @swagger
     * /review/restaurant/{restaurantId}/{reviewId}:
     *   get:
     *     summary: Get restaurant review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: restaurantId
     *         required: true
     *         schema:
     *           type: integer
     *       - in: path
     *         name: reviewId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Review details
     */
    this.router.get(
      "/restaurant/:reviewId",
      this.controller.getRestaurantReviewByReviewId.bind(this.controller)
    );
  }
}
