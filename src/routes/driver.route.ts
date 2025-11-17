import { DriverController } from "@/controllers/driver.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { Role } from "@/types/role";
import {
  profilePictureConfig,
  certificateFileConfig,
} from "@/utils/fileConfig";

import { BaseRouter } from "./baseRouter";

export class DriverRouter extends BaseRouter {
  private driverController: DriverController;

  constructor() {
    super({
      prefix: "/driver",
      middleware: [authMiddleware],
    });

    this.driverController = new DriverController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    /**
     * @swagger
     * /driver/profile/{id}:
     *   get:
     *     summary: Get driver profile by ID
     *     tags: [Driver]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Driver profile
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 firstname:
     *                   type: string
     *                 lastname:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 image:
     *                   type: string
     *                 is_available:
     *                   type: boolean
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     */
    this.router.get(
      "/profile/:id",
      this.driverController.getDriverProfileById.bind(this.driverController)
    );
    /**
     * @swagger
     * /driver/profile:
     *   get:
     *     summary: Get current driver profile
     *     tags: [Driver]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Driver profile
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 firstname:
     *                   type: string
     *                 lastname:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 image:
     *                   type: string
     *                 is_available:
     *                   type: boolean
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     */
    this.router.get(
      "/profile",
      this.driverController.getDriverProfile.bind(this.driverController)
    );
    /**
     * @swagger
     * /driver/profile:
     *   patch:
     *     summary: Update driver profile
     *     tags: [Driver]
     *     security:
     *       - bearerAuth: []
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
     *                 id:
     *                   type: integer
     *                 firstname:
     *                   type: string
     *                 lastname:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 image:
     *                   type: string
     *                 is_available:
     *                   type: boolean
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     */
    this.router.patch(
      "/profile",
      fileMiddleware(profilePictureConfig),
      this.driverController.updateDriverProfileById.bind(this.driverController)
    );
    /**
     * @swagger
     * /driver/availability:
     *   patch:
     *     summary: Update driver availability
     *     tags: [Driver]
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
     *                 firstname:
     *                   type: string
     *                 lastname:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 image:
     *                   type: string
     *                 is_available:
     *                   type: boolean
     *                 verification_status:
     *                   type: string
     *                   enum: [pending, approved, rejected]
     */
    this.router.patch(
      "/availability",
      this.driverController.updateDriverAvailability.bind(this.driverController)
    );
    /**
     * @swagger
     * /driver/upload:
     *   post:
     *     summary: Upload certificate file
     *     tags: [Driver]
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
      roleMiddleware(Role.driver),
      fileMiddleware(certificateFileConfig),
      this.driverController.uploadCertificateFile.bind(this.driverController)
    );
  }
}
