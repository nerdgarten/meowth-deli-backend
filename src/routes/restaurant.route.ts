import { RestaurantController } from "@/controllers/restaurant.controller";
import { Role } from "@/generated/prisma/browser";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import {
  restaurantBannerConfig,
  certificateFileConfig,
} from "@/utils/fileConfig";

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
     *     summary: Get all restaurants
     *     tags: [Restaurant]
     *     responses:
     *       200:
     *         description: List of restaurants
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   name:
     *                     type: string
     *                   detail:
     *                     type: string
     *                   tel:
     *                     type: string
     *                   verification_status:
     *                     type: string
     *                     enum: [pending, approved, rejected]
     *                   is_available:
     *                     type: boolean
     *                   location:
     *                     type: object
     */
    this.router.get(
      "/",
      this.restaurantController.getRestaurants.bind(this.restaurantController)
    );
    /**
     * @swagger
     * /restaurant/profile:
     *   get:
     *     summary: Get restaurant profile
     *     tags: [Restaurant]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Restaurant profile
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 detail:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 banner:
     *                   type: string
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     *                 is_available:
     *                   type: boolean
     *                 location:
     *                   type: object
     */
    this.router.get(
      "/profile",
      authMiddleware,
      this.restaurantController.getRestaurantProfile.bind(
        this.restaurantController
      )
    );
    /**
     * @swagger
     * /restaurant/profile:
     *   patch:
     *     summary: Update restaurant profile
     *     tags: [Restaurant]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               detail:
     *                 type: string
     *               tel:
     *                 type: string
     *               banner:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Profile updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 detail:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 banner:
     *                   type: string
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     *                 is_available:
     *                   type: boolean
     *                 location:
     *                   type: object
     */
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
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               is_available:
     *                 type: boolean
     *             required:
     *               - is_available
     *     responses:
     *       200:
     *         description: Availability updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 detail:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 banner:
     *                   type: string
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     *                 is_available:
     *                   type: boolean
     *                 location:
     *                   type: object
     */
    this.router.patch(
      "/availability",
      authMiddleware,
      this.restaurantController.updateRestaurantAvailability.bind(
        this.restaurantController
      )
    );
    /**
     * @swagger
     * /restaurant/upload:
     *   post:
     *     summary: Upload certificate file
     *     tags: [Restaurant]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *             required:
     *               - file
     *     responses:
     *       200:
     *         description: File uploaded
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 filePath:
     *                   type: string
     */
    this.router.post(
      "/upload",
      authMiddleware,
      roleMiddleware(Role.restaurant),
      fileMiddleware(certificateFileConfig),
      this.restaurantController.uploadCertificateFile.bind(
        this.restaurantController
      )
    );
    /**
     * @swagger
     * /restaurant/favorite:
     *   get:
     *     summary: Get favorite restaurants
     *     tags: [Restaurant]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of favorite restaurants
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   name:
     *                     type: string
     *                   detail:
     *                     type: string
     *                   tel:
     *                     type: string
     *                   banner:
     *                     type: string
     *                   verification_status:
     *                     type: string
     *                     enum: [pending, approved, rejected]
     *                   is_available:
     *                     type: boolean
     *                   location:
     *                     type: object
     */
    this.router.get(
      "/favorite",
      authMiddleware,
      this.restaurantController.getFavoriteRestaurantsByUserId.bind(
        this.restaurantController
      )
    );
    /**
     * @swagger
     * /restaurant/favorite:
     *   post:
     *     summary: Update favorite restaurant
     *     tags: [Restaurant]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               restaurantId:
     *                 type: integer
     *               isFavorite:
     *                 type: boolean
     *             required:
     *               - restaurantId
     *               - isFavorite
     *     responses:
     *       200:
     *         description: Favorite updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    this.router.post(
      "/favorite",
      authMiddleware,
      this.restaurantController.updateFavoriteRestaurantByUserId.bind(
        this.restaurantController
      )
    );
    /**
     * @swagger
     * /restaurant/{restaurantId}:
     *   get:
     *     summary: Get restaurant profile by ID
     *     tags: [Restaurant]
     *     parameters:
     *       - in: path
     *         name: restaurantId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Restaurant profile
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 detail:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 banner:
     *                   type: string
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     *                 is_available:
     *                   type: boolean
     *                 location:
     *                   type: object
     */
    this.router.get(
      "/:restaurantId",
      this.restaurantController.getRestaurantProfileById.bind(
        this.restaurantController
      )
    );
  }
}
