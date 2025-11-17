import { DishController } from "@/controllers/dish.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { dishPictureConfig } from "@/utils/fileConfig";

export class DishRouter extends BaseRouter {
  private dishController: DishController;

  constructor() {
    super({ prefix: "/dish" });

    this.dishController = new DishController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    /**
     * @swagger
     * /dish:
     *   get:
     *     summary: Get all dishes
     *     tags: [Dish]
     *     responses:
     *       200:
     *         description: List of dishes
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
     *                   description:
     *                     type: string
     *                   price:
     *                     type: number
     *                   image:
     *                     type: string
     *                   in_stock:
     *                     type: boolean
     *                   restaurant_id:
     *                     type: integer
     */
    this.router.get(
      "/",
      this.dishController.getAllDishes.bind(this.dishController)
    );
    /**
     * @swagger
     * /dish/restaurant/{id}:
     *   get:
     *     summary: Get dishes by restaurant ID
     *     tags: [Dish]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of dishes
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
     *                   description:
     *                     type: string
     *                   price:
     *                     type: number
     *                   image:
     *                     type: string
     *                   in_stock:
     *                     type: boolean
     *                   restaurant_id:
     *                     type: integer
     */
    this.router.get(
      "/restaurant/:id",
      this.dishController.getDishesByRestaurantId.bind(this.dishController)
    );
    /**
     * @swagger
     * /dish/{id}:
     *   get:
     *     summary: Get dish by ID
     *     tags: [Dish]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Dish details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 price:
     *                   type: number
     *                 image:
     *                   type: string
     *                 in_stock:
     *                   type: boolean
     *                 restaurant_id:
     *                   type: integer
     */
    this.router.get(
      "/:id",
      this.dishController.getDishById.bind(this.dishController)
    );
    /**
     * @swagger
     * /dish:
     *   post:
     *     summary: Create dish
     *     tags: [Dish]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               image:
     *                 type: string
     *                 format: binary
     *             required:
     *               - name
     *               - price
     *     responses:
     *       201:
     *         description: Dish created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 price:
     *                   type: number
     *                 image:
     *                   type: string
     *                 in_stock:
     *                   type: boolean
     *                 restaurant_id:
     *                   type: integer
     */
    this.router.post(
      "/",
      authMiddleware,
      fileMiddleware(dishPictureConfig),
      this.dishController.createDish.bind(this.dishController)
    );
    /**
     * @swagger
     * /dish/{id}:
     *   patch:
     *     summary: Update dish
     *     tags: [Dish]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Dish updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 price:
     *                   type: number
     *                 image:
     *                   type: string
     *                 in_stock:
     *                   type: boolean
     *                 restaurant_id:
     *                   type: integer
     */
    this.router.patch(
      "/:id",
      authMiddleware,
      fileMiddleware(dishPictureConfig),
      this.dishController.updateDish.bind(this.dishController)
    );
    /**
     * @swagger
     * /dish/{id}:
     *   delete:
     *     summary: Delete dish
     *     tags: [Dish]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Dish deleted
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    this.router.delete(
      "/:id",
      authMiddleware,
      this.dishController.deleteDish.bind(this.dishController)
    );
    /**
     * @swagger
     * /dish/{id}/stock-status:
     *   patch:
     *     summary: Update dish stock status
     *     tags: [Dish]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
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
     *               is_out_of_stock:
     *                 type: boolean
     *             required:
     *               - is_out_of_stock
     *     responses:
     *       200:
     *         description: Stock status updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 price:
     *                   type: number
     *                 image:
     *                   type: string
     *                 in_stock:
     *                   type: boolean
     *                 restaurant_id:
     *                   type: integer
     */
    this.router.patch(
      "/:id/stock-status",
      authMiddleware,
      this.dishController.updateDishStockStatus.bind(this.dishController)
    );
    this.router.get(
      "/favorite/restaurant/:restaurantId",
      authMiddleware,
      this.dishController.getFavoriteDishesByUserId.bind(this.dishController)
    );
    this.router.post(
      "/favorite",
      authMiddleware,
      this.dishController.updateFavoriteDishByUserId.bind(this.dishController)
    );
    this.router.get(
      "/favorite/:dishId",
      authMiddleware,
      this.dishController.checkFavoriteDish.bind(this.dishController)
    );
  }
}
