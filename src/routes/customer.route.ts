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
     *         multipart/form-data:
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
     *                 format: binary
     *     responses:
     *       200:
     *         description: Profile updated
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
    this.router.patch(
      "/profile",
      fileMiddleware(profilePictureConfig),
      this.customerController.updateCustomerProfile.bind(
        this.customerController
      )
    );
    /**
     * @swagger
     * /customer/allergy:
     *   get:
     *     summary: Get customer allergies
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of allergies
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *                 enum: [gluten, peanuts]
     */
    this.router.get(
      "/allergy",
      this.customerController.getAllergy.bind(this.customerController)
    );
    /**
     * @swagger
     * /customer/allergy:
     *   put:
     *     summary: Update customer allergies
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
     *               allergies:
     *                 type: array
     *                 items:
     *                   type: string
     *                   enum: [gluten, peanuts]
     *             required:
     *               - allergies
     *     responses:
     *       200:
     *         description: Allergies updated
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *                 enum: [gluten, peanuts]
     */
    this.router.put(
      "/allergy",
      this.customerController.updateAllergy.bind(this.customerController)
    );
    /**
     * @swagger
     * /customer/process-payment:
     *   post:
     *     summary: Process mock payment for an order
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
     *               orderId:
     *                 type: integer
     *               amount:
     *                 type: number
     *               paymentMethod:
     *                 type: string
     *                 enum: [cash, mobilebanking, creditcard, meowth-wallet]
     *             required:
     *               - orderId
     *               - amount
     *               - paymentMethod
     *     responses:
     *       200:
     *         description: Payment processed successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     */
    this.router.post(
      "/process-payment",
      this.customerController.processMockPayment.bind(this.customerController)
    );
    /**
     * @swagger
     * /customer/wallet-balance:
     *   get:
     *     summary: Get customer wallet balance
     *     tags: [Customer]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Wallet balance
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 balance:
     *                   type: number
     */
    this.router.get(
      "/wallet-balance",
      this.customerController.getWalletBalance.bind(this.customerController)
    );
  }
}
