import { RestaurantController } from "@/controllers/restaurant.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { fileMiddleware } from "@/middlewares/file.middleware";
import {
  restaurantBannerConfig,
  certificateFileConfig,
} from "@/utils/fileConfig";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { Role } from "@/generated/prisma/browser";

export class RestaurantRouter extends BaseRouter {
  private restaurantController: RestaurantController;

  constructor() {
    super({
      prefix: "/restaurant",
    });

    this.restaurantController = new RestaurantController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    /**
     * @swagger
     * /restaurant:
     *   get:
     *     summary: Get restaurants by status
     *     tags: [Restaurant]
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of restaurants
     */
    this.router.get(
      "/",
      authMiddleware,
      this.restaurantController.getRestaurants.bind(this.restaurantController)
    );
    this.router.get(
      "/profile/:restaurantId",
      authMiddleware,
      this.restaurantController.getRestaurantProfileById.bind(
        this.restaurantController
      )
    );
    this.router.get(
      "/profile",
      authMiddleware,
      this.restaurantController.getRestaurantProfile.bind(
        this.restaurantController
      )
    );
    this.router.patch(
      "/profile",
      authMiddleware,
      fileMiddleware(restaurantBannerConfig),
      this.restaurantController.updateRestaurantProfile.bind(
        this.restaurantController
      )
    );

    /**
     * @swagger
     * /restaurant/availability:
     *   patch:
     *     summary: Update restaurant availability
     *     tags: [Restaurant]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               available:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Availability updated
     */
    this.router.patch(
      "/availability",
      authMiddleware,
      this.restaurantController.updateRestaurantAvailability.bind(
        this.restaurantController
      )
    );
    this.router.post(
      "/upload",
      authMiddleware,
      roleMiddleware(Role.restaurant),
      fileMiddleware(certificateFileConfig),
      this.restaurantController.uploadCertificateFile.bind(
        this.restaurantController
      )
    );
  }
}
