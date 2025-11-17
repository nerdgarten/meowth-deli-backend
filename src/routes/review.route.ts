import ReviewController from "@/controllers/review.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { reviewConfig } from "@/utils/fileConfig";

export class ReviewRouter extends BaseRouter {
  private controller: ReviewController;

  constructor() {
    super({ prefix: "/review" });
    this.controller = new ReviewController();
    this.setUpRoutes();
  }

  private setUpRoutes(): void {
    // Driver Reviews
    /**
     * @swagger
     * /review/driver:
     *   post:
     *     summary: Create driver review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               driver_id:
     *                 type: integer
     *               rate:
     *                 type: integer
     *               review_text:
     *                 type: string
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *             required:
     *               - driver_id
     *               - rate
     *               - title
     *     responses:
     *       201:
     *         description: Review created
     */
    this.router.post(
      "/driver",
      authMiddleware,
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
     * /review/driver/{reviewId}:
     *   get:
     *     summary: Get driver review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
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
      "/:reviewId/driver",
      this.controller.getDriverReviewByReviewId.bind(this.controller)
    );

    // Restaurant Reviews
    /**
     * @swagger
     * /review/restaurant:
     *   post:
     *     summary: Create restaurant review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                type: string
     *               restaurant_id:
     *                 type: integer
     *               rate:
     *                 type: integer
     *               review_text:
     *                 type: string
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *             required:
     *               - restaurant_id
     *               - rate
     *               - title
     *     responses:
     *       201:
     *         description: Review created
     */
    this.router.post(
      "/restaurant",
      authMiddleware,
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
     * /review/restaurant/{reviewId}:
     *   get:
     *     summary: Get restaurant review
     *     tags: [Review]
     *     security:
     *       - cookieAuth: []
     *     parameters:
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
      "/:reviewId/restaurant",
      this.controller.getRestaurantReviewByReviewId.bind(this.controller)
    );
  }
}
