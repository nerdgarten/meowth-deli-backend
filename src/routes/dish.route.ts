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
    /**
     * @swagger
     * /dish/search:
     *   get:
     *     summary: Search dishes
     *     tags: [Dish]
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of dishes
     */
    this.router.get(
      "/search",
      this.dishController.searchDishes.bind(this.dishController)
    );
    /**
     * @swagger
     * /dish:
     *   get:
     *     summary: Get all dishes
     *     tags: [Dish]
     *     responses:
     *       200:
     *         description: List of dishes
     */
    this.router.get(
      "/",
      this.dishController.getAllDishes.bind(this.dishController)
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
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               restaurant_id:
     *                 type: integer
     *               image:
     *                 type: string
     *     responses:
     *       201:
     *         description: Dish created
     */
    this.router.post(
      "/",
      authMiddleware,
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
     *         application/json:
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
     *     responses:
     *       200:
     *         description: Dish updated
     */
    this.router.patch(
      "/:id",
      authMiddleware,
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
     *               in_stock:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Stock status updated
     */
    this.router.patch(
      "/:id/stock-status",
      authMiddleware,
      this.dishController.updateDishStockStatus.bind(this.dishController)
    );
  }
}
