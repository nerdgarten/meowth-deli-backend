import { z } from "zod";

import { CustomerController } from "@/controllers/customer.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import { ICreateOrderRequest } from "@/types/user";

import { BaseRouter } from "./baseRouter";

export class CustomerRouter extends BaseRouter {
  private customerController: CustomerController;

  constructor() {
    super({ prefix: "/customer"
      , middleware: [authMiddleware] 
    });

    this.customerController = new CustomerController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    /**
     * @swagger
     * /customer/profile:
     *   get:
     *     summary: Get customer profile
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Customer profile
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 firstname:
     *                   type: string
     *                 lastname:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 image:
     *                   type: string
     */
    this.router.get(
      "/profile",
      this.customerController.getCustomerProfile.bind(this.customerController),
    );
    /**
     * @swagger
     * /customer/profile:
     *   patch:
     *     summary: Update customer profile
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstname:
     *                 type: string
     *               lastname:
     *                 type: string
     *               tel:
     *                 type: string
     *               image:
     *                 type: string
     *     responses:
     *       200:
     *         description: Profile updated
     */
    this.router.patch(
      "/profile",
      this.customerController.updateCustomerProfile.bind(
        this.customerController,
      ),
    );
    /////
    /**
     * @swagger
     * /customer/my-orders-hist:
     *   get:
     *     summary: Get order history
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of orders
     */
    this.router.get(
      "/my-orders-hist",
      this.customerController.getOrderHistory.bind(this.customerController)
    );
    /**
     * @swagger
     * /customer/my-orders-hist/statistics:
     *   get:
     *     summary: Get order statistics
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Order statistics
     */
    this.router.get(
      "/my-orders-hist/statistics",
      this.customerController.getOrderStatistics.bind(this.customerController)
    );
    /**
     * @swagger
     * /customer/my-orders-hist/{orderId}:
     *   get:
     *     summary: Get order by ID
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: orderId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Order details
     */
    this.router.get(
      "/my-orders-hist/:orderId",
      this.customerController.getOrderById.bind(this.customerController)
    );
    /**
     * @swagger
     * /customer/my-orders-hist/{orderId}/reorder:
     *   get:
     *     summary: Get reorder items
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: orderId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Reorder items
     */
    this.router.get(
      "/my-orders-hist/:orderId/reorder",
      this.customerController.getReorderItems.bind(this.customerController)
    )
    //////
    const createOrderSchema = z.object({
      body: z.object({
        location: z.string().min(1, "Location is required"),
        note: z.string().optional(),
        restaurant_id: z.number().min(1, "Restaurant ID is required"),
        dishes: z.array(z.object({
          dish_id: z.number().min(1, "Dish ID is required"),
          quantity: z.number().min(1, "Quantity must be greater than 0"),
          note: z.string().optional()
        })).min(1, "At least one dish is required")
      }) satisfies z.ZodType<ICreateOrderRequest>
    });
    
    /**
     * @swagger
     * /customer/orders:
     *   post:
     *     summary: Create order
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               location:
     *                 type: string
     *               note:
     *                 type: string
     *               restaurant_id:
     *                 type: integer
     *               dishes:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     dish_id:
     *                       type: integer
     *                     quantity:
     *                       type: integer
     *                     note:
     *                       type: string
     *             required:
     *               - location
     *               - restaurant_id
     *               - dishes
     *     responses:
     *       201:
     *         description: Order created
     */
    this.router.post(
      "/orders",
      validateRequest(createOrderSchema),
      this.customerController.createOrder.bind(this.customerController)
    )
    //////
    /**
     * @swagger
     * /customer/my-orders/{orderId}/status:
     *   get:
     *     summary: Get order status
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: orderId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Order status
     */
    this.router.get(
      "/my-orders/:orderId/status",
      this.customerController.getOrderStatus.bind(this.customerController),
    );
    /**
     * @swagger
     * /customer/my-orders:
     *   get:
     *     summary: Get all orders with status
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of orders with status
     */
    this.router.get(
      "/my-orders",
      this.customerController.getAllOrdersWithStatus.bind(this.customerController),
    );
    
    /**
     * @swagger
     * /customer/payment/mock:
     *   post:
     *     summary: Process mock payment
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Payment processed
     */
    this.router.post(
      "/payment/mock",
      this.customerController.processMockPayment.bind(this.customerController),
    );
  }
}
