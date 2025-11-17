import { OrderController } from "@/controllers/order.controller";
import { Role } from "@/generated/prisma/browser";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import {
  restaurantBannerConfig,
  certificateFileConfig,
} from "@/utils/fileConfig";

export class OrderRouter extends BaseRouter {
  private orderController: OrderController;

  constructor() {
    super({
      prefix: "/order",
    });

    this.orderController = new OrderController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    /**
     * @swagger
     * /order/customer:
     *   get:
     *     summary: Get orders by customer
     *     tags: [Order]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of orders
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   status:
     *                     type: string
     *                     enum: [pending, preparing, delivered, rejected, success]
     *                   created_at:
     *                     type: string
     *                     format: date-time
     *                   customer:
     *                     type: object
     *                   restaurant:
     *                     type: object
     *                   driver:
     *                     type: object
     *                   location:
     *                     type: object
     *                   orderDishes:
     *                     type: array
     *                     items:
     *                       type: object
     *                   total_amount:
     *                     type: number
     */
    this.router.get(
      "/customer",
      authMiddleware,
      this.orderController.getOrdersByCustomerId.bind(this.orderController)
    );
    /**
     * @swagger
     * /order/restaurant:
     *   get:
     *     summary: Get orders by restaurant
     *     tags: [Order]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of orders
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   status:
     *                     type: string
     *                     enum: [pending, preparing, delivered, rejected, success]
     *                   created_at:
     *                     type: string
     *                     format: date-time
     *                   customer:
     *                     type: object
     *                   restaurant:
     *                     type: object
     *                   driver:
     *                     type: object
     *                   location:
     *                     type: object
     *                   orderDishes:
     *                     type: array
     *                     items:
     *                       type: object
     *                   total_amount:
     *                     type: number
     */
    this.router.get(
      "/restaurant",
      authMiddleware,
      this.orderController.getOrdersByRestaurantId.bind(this.orderController)
    );
    /**
     * @swagger
     * /order/driver:
     *   get:
     *     summary: Get orders by driver
     *     tags: [Order]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of orders
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   status:
     *                     type: string
     *                     enum: [pending, preparing, delivered, rejected, success]
     *                   created_at:
     *                     type: string
     *                     format: date-time
     *                   customer:
     *                     type: object
     *                   restaurant:
     *                     type: object
     *                   driver:
     *                     type: object
     *                   location:
     *                     type: object
     *                   orderDishes:
     *                     type: array
     *                     items:
     *                       type: object
     *                   total_amount:
     *                     type: number
     */
    this.router.get(
      "/driver",
      authMiddleware,
      this.orderController.getOrdersByDriverId.bind(this.orderController)
    );
    /**
     * @swagger
     * /order/{id}:
     *   get:
     *     summary: Get order by ID
     *     tags: [Order]
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
     *         description: Order details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 status:
     *                   type: string
     *                   enum: [pending, preparing, delivered, rejected, success]
     *                 created_at:
     *                   type: string
     *                   format: date-time
     *                 customer:
     *                   type: object
     *                 restaurant:
     *                   type: object
     *                 driver:
     *                   type: object
     *                 location:
     *                   type: object
     *                 orderDishes:
     *                   type: array
     *                   items:
     *                     type: object
     *                 total_amount:
     *                   type: number
     */
    this.router.get(
      "/:id",
      authMiddleware,
      this.orderController.getOrderById.bind(this.orderController)
    );
    /**
     * @swagger
     * /order:
     *   post:
     *     summary: Create order
     *     tags: [Order]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               restaurant_id:
     *                 type: integer
     *               driver_id:
     *                 type: integer
     *               location_id:
     *                 type: integer
     *               status:
     *                 type: string
     *                 enum: [pending, preparing, delivered, rejected, success]
     *               orderDishes:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     dish_id:
     *                       type: integer
     *                     quantity:
     *                       type: integer
     *             required:
     *               - restaurant_id
     *               - location_id
     *               - orderDishes
     *     responses:
     *       201:
     *         description: Order created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 status:
     *                   type: string
     *                 created_at:
     *                   type: string
     *                   format: date-time
     */
    this.router.post(
      "/",
      authMiddleware,
      roleMiddleware(Role.customer),
      this.orderController.createOrder.bind(this.orderController)
    );
  }
}
