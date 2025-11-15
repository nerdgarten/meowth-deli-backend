import { z } from "zod";

import { CustomerController } from "@/controllers/customer.controller";
import { Role } from "@/generated/prisma/browser";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { profilePictureConfig } from "@/utils/fileConfig";

import { BaseRouter } from "./baseRouter";

export class CustomerRouter extends BaseRouter {
  private customerController: CustomerController;

  constructor() {
    super({
      prefix: "/customer",
      middleware: [authMiddleware, roleMiddleware(Role.customer, Role.admin)],
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
      this.customerController.getCustomerProfile.bind(this.customerController)
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
      fileMiddleware(profilePictureConfig),
      this.customerController.updateCustomerProfile.bind(
        this.customerController
      )
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
      "/allergy",
      this.customerController.getAllergy.bind(this.customerController)
    );
    this.router.put(
      "/allergy",
      this.customerController.updateAllergy.bind(this.customerController)
    );
  }
}
