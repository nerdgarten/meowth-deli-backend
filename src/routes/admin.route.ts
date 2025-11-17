import { Router, Request, Response, NextFunction } from "express";

import { AdminController } from "@/controllers/admin.controller";
import { ReportController } from "@/controllers/report.controller";
import { RestaurantController } from "@/controllers/restaurant.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { IJwtData } from "@/types/auth/jwt";
import { Role } from "@/types/role";
import { certificateFileConfig } from "@/utils/fileConfig";

export class AdminRouter extends BaseRouter {
  private controller: AdminController;
  private restaurantController: RestaurantController;
  private reportController: ReportController;

  constructor() {
    super({
      prefix: "/admin",
      middleware: [authMiddleware, roleMiddleware(Role.admin)],
    });
    this.controller = new AdminController();
    this.restaurantController = new RestaurantController();
    this.reportController = new ReportController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant management
    /**
     * @swagger
     * /admin/restaurants:
     *   get:
     *     summary: List restaurants
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [pending, approved, rejected]
     *         description: Filter by verification status
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
     *                   verification_status:
     *                     type: string
     *                     enum: [pending, approved, rejected]
     *                   is_available:
     *                     type: boolean
     *                   tel:
     *                     type: string
     *                   detail:
     *                     type: string
     *                   banner:
     *                     type: string
     *                   fee_rate:
     *                     type: number
     *                   location_id:
     *                     type: integer
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/restaurants",
      this.controller.listRestaurants.bind(this.controller)
    );
    /**
     * @swagger
     * /admin/restaurants/verify:
     *   patch:
     *     summary: Verify restaurant
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *               status:
     *                 type: string
     *                 enum: [pending, approved, rejected]
     *             required:
     *               - id
     *               - status
     *     responses:
     *       200:
     *         description: Restaurant verified successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.patch(
      "/restaurants/verify",
      this.controller.verifyRestaurant.bind(this.controller)
    );

    // Driver management
    /**
     * @swagger
     * /admin/drivers:
     *   get:
     *     summary: List drivers
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [pending, approved, rejected]
     *         description: Filter by verification status
     *     responses:
     *       200:
     *         description: List of drivers
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   firstname:
     *                     type: string
     *                   lastname:
     *                     type: string
     *                   verification_status:
     *                     type: string
     *                     enum: [pending, approved, rejected]
     *                   is_available:
     *                     type: boolean
     *                   tel:
     *                     type: string
     *                   vehicle:
     *                     type: string
     *                   licence:
     *                     type: string
     *                   fee_rate:
     *                     type: number
     *                   location_id:
     *                     type: integer
     *                   image:
     *                     type: string
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/drivers",
      this.controller.listDrivers.bind(this.controller)
    );
    /**
     * @swagger
     * /admin/drivers/verify:
     *   patch:
     *     summary: Verify driver
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *               status:
     *                 type: string
     *                 enum: [pending, approved, rejected]
     *             required:
     *               - id
     *               - status
     *     responses:
     *       200:
     *         description: Driver verified successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.patch(
      "/drivers/verify",
      this.controller.verifyDriver.bind(this.controller)
    );

    // Certificates listing
    /**
     * @swagger
     * /admin/drivers/certificate:
     *   get:
     *     summary: Get pending verified drivers
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of items per page
     *     responses:
     *       200:
     *         description: List of pending verified drivers
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                       firstname:
     *                         type: string
     *                       lastname:
     *                         type: string
     *                       verification_status:
     *                         type: string
     *                         enum: [pending, approved, rejected]
     *                       tel:
     *                         type: string
     *                 total:
     *                   type: integer
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/drivers/certificate",
      this.controller.getPendingVerifiedDrivers.bind(this.controller)
    );
    /**
     * @swagger
     * /admin/drivers/{id}/certificate:
     *   get:
     *     summary: Get file IDs for pending verified driver
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Driver ID
     *     responses:
     *       200:
     *         description: List of file IDs
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *       400:
     *         description: Invalid driver ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/drivers/:id/certificate",
      this.controller.getFileIdPendingVerifiedDriver.bind(this.controller)
    );
    /**
     * @swagger
     * /admin/drivers/certificate/{id}/{fileId}:
     *   get:
     *     summary: Get driver certificate file
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Driver ID
     *       - in: path
     *         name: fileId
     *         required: true
     *         schema:
     *           type: string
     *         description: File ID
     *     responses:
     *       200:
     *         description: File content
     *         content:
     *           application/octet-stream:
     *             schema:
     *               type: string
     *               format: binary
     *       400:
     *         description: Invalid driver ID or file ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/drivers/certificate/:id/:fileId",
      this.controller.getDriverFileById.bind(this.controller)
    );
    /**
     * @swagger
     * /admin/restaurants/certificate:
     *   get:
     *     summary: Get pending verified restaurants
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of items per page
     *     responses:
     *       200:
     *         description: List of pending verified restaurants
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                       name:
     *                         type: string
     *                       verification_status:
     *                         type: string
     *                         enum: [pending, approved, rejected]
     *                       tel:
     *                         type: string
     *                 total:
     *                   type: integer
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/restaurants/certificate",
      this.controller.getPendingVerifiedRestaurants.bind(this.controller)
    );
    /**
     * @swagger
     * /admin/restaurants/{id}/certificate:
     *   get:
     *     summary: Get file IDs for pending verified restaurant
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Restaurant ID
     *     responses:
     *       200:
     *         description: List of file IDs
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *       400:
     *         description: Invalid restaurant ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/restaurants/:id/certificate",
      this.controller.getFileIdPendingVerifiedRestaurants.bind(this.controller)
    );
    /**
     * @swagger
     * /admin/restaurants/certificate/{id}/{fileId}:
     *   get:
     *     summary: Get restaurant certificate file
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Restaurant ID
     *       - in: path
     *         name: fileId
     *         required: true
     *         schema:
     *           type: string
     *         description: File ID
     *     responses:
     *       200:
     *         description: File content
     *         content:
     *           application/octet-stream:
     *             schema:
     *               type: string
     *               format: binary
     *       400:
     *         description: Invalid restaurant ID or file ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/restaurants/certificate/:id/:fileId",
      this.controller.getRestaurantFileById.bind(this.controller)
    );

    // Admin uploads a certificate for a restaurant (impersonate the restaurant user for file saving)
    /**
     * @swagger
     * /admin/restaurant/upload:
     *   post:
     *     summary: Upload certificate for restaurant
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
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
     *                 description: Certificate file
     *               id:
     *                 type: integer
     *                 description: Restaurant ID
     *             required:
     *               - file
     *               - id
     *     responses:
     *       200:
     *         description: Certificate uploaded successfully
     *       400:
     *         description: Invalid restaurant ID or file
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.post(
      "/restaurant/upload",
      (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.body?.id ?? req.query?.id ?? req.params?.id);
        if (isNaN(id) || id <= 0) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid restaurant id" });
        }
        req.user = { id, role: Role.restaurant } as IJwtData;
        next();
      },
      fileMiddleware(certificateFileConfig),
      this.restaurantController.uploadCertificateFile.bind(
        this.restaurantController
      )
    );

    // Delete user by id (soft-delete)
    /**
     * @swagger
     * /admin/user/{id}:
     *   delete:
     *     summary: Delete user by ID
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: User ID
     *     responses:
     *       200:
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid user ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.delete("/user/:id", (req: Request, res: Response) =>
      this.controller.deleteUserById(req, res)
    );

    // List users with optional role filter
    /**
     * @swagger
     * /admin/users:
     *   get:
     *     summary: List users
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: query
     *         name: role
     *         schema:
     *           type: string
     *           enum: [customer, driver, restaurant, admin]
     *         description: Filter by role
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Number of items per page
     *     responses:
     *       200:
     *         description: List of users
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                       email:
     *                         type: string
     *                       role:
     *                         type: string
     *                         enum: [customer, driver, restaurant, admin]
     *                 total:
     *                   type: integer
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get("/users", this.controller.listUsers.bind(this.controller));

    // Report management
    /**
     * @swagger
     * /admin/reports:
     *   get:
     *     summary: Get reports
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of reports
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   reporter_id:
     *                     type: integer
     *                   reported_user_id:
     *                     type: integer
     *                   reason:
     *                     type: string
     *                   status:
     *                     type: string
     *                   created_at:
     *                     type: string
     *                     format: date-time
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      "/reports",
      this.reportController.getReports.bind(this.reportController)
    );
    /**
     * @swagger
     * /admin/reports/{id}/resolve:
     *   patch:
     *     summary: Resolve report
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Report ID
     *     responses:
     *       200:
     *         description: Report resolved successfully
     *       400:
     *         description: Invalid report ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.patch(
      "/reports/:id/resolve",
      this.reportController.resolveReport.bind(this.reportController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
