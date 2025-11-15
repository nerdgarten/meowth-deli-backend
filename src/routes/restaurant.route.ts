import { RestaurantController } from "@/controllers/restaurant.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class RestaurantRouter extends BaseRouter {
  private restaurantController: RestaurantController;

  constructor() {
    super({ prefix: "/restaurant" , middleware: [authMiddleware]});
     
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
      this.restaurantController.getRestaurantsByStatus.bind(
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
      this.restaurantController.updateRestaurantAvailability.bind(
        this.restaurantController
      )
    );
    /**
     * @swagger
     * /restaurant/{id}/dish:
     *   get:
     *     summary: Get dishes by restaurant ID
     *     tags: [Restaurant]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of dishes
     */
    this.router.get(
      "/orders",
      this.restaurantController.getRestaurantOrders.bind(this.restaurantController)
    );

    this.router.patch(
      "/orders/:orderId/status",
      this.restaurantController.updateOrderStatus.bind(this.restaurantController)
    );
    this.router.get(
      "/:id/dish",
      this.restaurantController.getDishesByRestaurantId.bind(
        this.restaurantController
      )
    );
    /**
     * @swagger
     * /restaurant/{id}:
     *   get:
     *     summary: Get restaurant by ID
     *     tags: [Restaurant]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Restaurant details
     */
    this.router.get(
      "/:id",
      this.restaurantController.getRestaurantById.bind(
        this.restaurantController
      )
    );
  }
}
