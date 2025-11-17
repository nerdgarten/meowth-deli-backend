import { Router } from "express";

import { LocationController } from "@/controllers/location.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

export class LocationRouter extends BaseRouter {
  private locationController: LocationController;

  constructor() {
    super({
      prefix: "/location",
      middleware: [authMiddleware],
    });
    this.locationController = new LocationController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /location/customer:
     *   post:
     *     summary: Create customer location
     *     tags: [Location]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               address:
     *                 type: string
     *               latitude:
     *                 type: number
     *               longitude:
     *                 type: number
     *             required:
     *               - address
     *               - latitude
     *               - longitude
     *     responses:
     *       201:
     *         description: Location created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 address:
     *                   type: string
     *                 latitude:
     *                   type: number
     *                 longitude:
     *                   type: number
     */
    this.router.post(
      "/customer",
      this.locationController.createCustomerLocation.bind(
        this.locationController
      )
    );
    /**
     * @swagger
     * /location/customer:
     *   get:
     *     summary: Get customer locations
     *     tags: [Location]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of locations
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   address:
     *                     type: string
     *                   latitude:
     *                     type: number
     *                   longitude:
     *                     type: number
     */
    this.router.get(
      "/customer",
      this.locationController.getLocationsByCustomerId.bind(
        this.locationController
      )
    );
    /**
     * @swagger
     * /location/customer/default:
     *   get:
     *     summary: Get default customer location
     *     tags: [Location]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Default location
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 address:
     *                   type: string
     *                 latitude:
     *                   type: number
     *                 longitude:
     *                   type: number
     */
    this.router.get(
      "/customer/default",
      this.locationController.getDefaultLocationByCustomerId.bind(
        this.locationController
      )
    );
    /**
     * @swagger
     * /location/customer/default:
     *   patch:
     *     summary: Update default customer location
     *     tags: [Location]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               location_id:
     *                 type: integer
     *             required:
     *               - location_id
     *     responses:
     *       200:
     *         description: Default location updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 address:
     *                   type: string
     *                 latitude:
     *                   type: number
     *                 longitude:
     *                   type: number
     */
    this.router.patch(
      "/customer/default",
      this.locationController.updateDefaultLocationByCustomerId.bind(
        this.locationController
      )
    );
    /**
     * @swagger
     * /location/restaurant:
     *   get:
     *     summary: Get restaurant location
     *     tags: [Location]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Restaurant location
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 address:
     *                   type: string
     *                 latitude:
     *                   type: number
     *                 longitude:
     *                   type: number
     */
    this.router.get(
      "/restaurant",
      this.locationController.getRestaurantLocationByRestaurantId.bind(
        this.locationController
      )
    );
    /**
     * @swagger
     * /location/restaurant:
     *   post:
     *     summary: Create restaurant location
     *     tags: [Location]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               address:
     *                 type: string
     *               latitude:
     *                 type: number
     *               longitude:
     *                 type: number
     *             required:
     *               - address
     *               - latitude
     *               - longitude
     *     responses:
     *       201:
     *         description: Location created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 address:
     *                   type: string
     *                 latitude:
     *                   type: number
     *                 longitude:
     *                   type: number
     */
    this.router.post(
      "/restaurant",
      this.locationController.createRestaurantLocation.bind(
        this.locationController
      )
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
