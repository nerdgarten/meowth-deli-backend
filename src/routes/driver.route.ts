import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

import { DriverController } from "@/controllers/driver.controller";

export class DriverRouter extends BaseRouter {
  private driverController: DriverController;

  constructor() {
    super({ prefix: "/driver", middleware: [authMiddleware] });

    this.driverController = new DriverController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    /**
     * @swagger
     * /driver/orders:
     *   get:
     *     summary: Get driver orders by status
     *     tags: [Driver]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of orders
     */
    this.router.get(
      "/orders",
      this.driverController.getDriverOrdersByStatus.bind(this.driverController),
    );

    /**
     * @swagger
     * /driver/orders/{id}:
     *   get:
     *     summary: Get driver order by ID
     *     tags: [Driver]
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
     */
    this.router.get(
      "/orders/:id",
      this.driverController.getDriverOrderById.bind(this.driverController),
    );
  }
}
