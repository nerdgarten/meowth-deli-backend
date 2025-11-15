// import { Router } from "express";

<<<<<<< HEAD
import { AdminController } from "@/controllers/admin.controller";
import { adminMiddleware, authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class AdminRouter extends BaseRouter {
  private readonly controller: AdminController;

  constructor() {
    super({ prefix: "/admin", middleware: [authMiddleware, adminMiddleware] });
    this.controller = new AdminController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant verification routes
    /**
     * @swagger
     * /admin/restaurants:
     *   get:
     *     summary: List restaurants
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of restaurants
     */
    this.router.get(
      "/restaurants",
      this.controller.listRestaurants.bind(this.controller),
    );
    /**
     * @swagger
     * /admin/restaurants/{id}/verify:
     *   patch:
     *     summary: Verify restaurant
     *     tags: [Admin]
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
     *               verified:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Restaurant verified
     */
    this.router.patch(
      "/restaurants/:id/verify",
      this.controller.verifyRestaurant.bind(this.controller),
    );

    // Driver verification routes
    /**
     * @swagger
     * /admin/drivers:
     *   get:
     *     summary: List drivers
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of drivers
     */
    this.router.get(
      "/drivers",
      this.controller.listDrivers.bind(this.controller),
    );
    /**
     * @swagger
     * /admin/drivers/{id}/verify:
     *   patch:
     *     summary: Verify driver
     *     tags: [Admin]
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
     *               verified:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Driver verified
     */
    this.router.patch(
      "/drivers/:id/verify",
      this.controller.verifyDriver.bind(this.controller),
    );
    /**
     * @swagger
     * /admin/drivers/file-pending:
     *   get:
     *     summary: Get pending verified drivers
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of pending drivers
     */
    this.router.get(
      "/drivers/file-pending",
      this.controller.getPendingVerifiedDrivers.bind(this.controller),
    );
    /**
     * @swagger
     * /admin/drivers/file-pending/{id}:
     *   get:
     *     summary: Get file ID for pending verified driver
     *     tags: [Admin]
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
     *         description: File ID
     */
    this.router.get(
      "/drivers/file-pending/:id",
      this.controller.getFileIdPendingVerifiedDriver.bind(this.controller),
    );
    /**
     * @swagger
     * /admin/restaurants/file-pending:
     *   get:
     *     summary: Get pending verified restaurants
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of pending restaurants
     */
    this.router.get(
      "/restaurants/file-pending",
      this.controller.getPendingVerifiedRestaurants.bind(this.controller),
    );
    /**
     * @swagger
     * /admin/restaurants/file-pending/{id}:
     *   get:
     *     summary: Get file ID for pending verified restaurant
     *     tags: [Admin]
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
     *         description: File ID
     */
    this.router.get(
      "/restaurants/file-pending/:id",
      this.controller.getFileIdPendingVerifiedRestaurants.bind(this.controller),
    );

    /**
     * @swagger
     * /admin/drivers/files/{id}/{fileId}:
     *   get:
     *     summary: Get driver file by ID
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *       - in: path
     *         name: fileId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: File data
     */
    this.router.get(
      "/drivers/files/:id/:fileId",
      this.controller.getDriverFileById.bind(this.controller),
    );
    /**
     * @swagger
     * /admin/restaurants/files/{id}/{fileId}:
     *   get:
     *     summary: Get restaurant file by ID
     *     tags: [Admin]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *       - in: path
     *         name: fileId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: File data
     */
    this.router.get(
      "/restaurants/files/:id/:fileId",
      this.controller.getRestaurantFileById.bind(this.controller),
    );

    this.router.delete(
      "/users/:id",
      this.controller.deleteUser.bind(this.controller),
    )
  }
=======
// import { AdminController } from "@/controllers/admin.controller";
// import { authMiddleware } from "@/middlewares/auth.middleware";
// import { BaseRouter } from "@/routes/baseRouter";
// import { Role } from "@/types/role";

// export class AdminRouter extends BaseRouter {
//   private controller: AdminController;

//   constructor() {
//     super({ prefix: "/admin", middleware: [authMiddleware([Role.admin])] });
//     this.controller = new AdminController();
//     this.initializeRoutes();
//   }

//   private initializeRoutes(): void {
//     // Restaurant verification routes
//     this.router.get(
//       "/restaurants",
//       this.controller.listRestaurants.bind(this.controller)
//     );
//     this.router.patch(
//       "/restaurants/:id/verify",
//       this.controller.verifyRestaurant.bind(this.controller)
//     );

//     // Driver verification routes
//     this.router.get(
//       "/drivers",
//       this.controller.listDrivers.bind(this.controller)
//     );
//     this.router.patch(
//       "/drivers/:id/verify",
//       this.controller.verifyDriver.bind(this.controller)
//     );
//     this.router.get(
//       "/drivers/file-pending",
//       this.controller.getPendingVerifiedDrivers.bind(this.controller)
//     );
//     this.router.get(
//       "/drivers/file-pending/:id",
//       this.controller.getFileIdPendingVerifiedDriver.bind(this.controller)
//     );
//     this.router.get(
//       "/restaurants/file-pending",
//       this.controller.getPendingVerifiedRestaurants.bind(this.controller)
//     );
//     this.router.get(
//       "/restaurants/file-pending/:id",
//       this.controller.getFileIdPendingVerifiedRestaurants.bind(this.controller)
//     );

//     this.router.get(
//       "/drivers/files/:id/:fileId",
//       this.controller.getDriverFileById.bind(this.controller)
//     );
//     this.router.get(
//       "/restaurants/files/:id/:fileId",
//       this.controller.getRestaurantFileById.bind(this.controller)
//     );
//   }
>>>>>>> refactor_everything

//   public getRouter(): Router {
//     return this.router;
//   }
// }
