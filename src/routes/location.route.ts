import { Router } from "express";

import { LocationController } from "@/controllers/location.controller";

import { BaseRouter } from "./baseRouter";

export class LocationRouter extends BaseRouter {
  private readonly controller: LocationController;

  constructor() {
    super({
      prefix: "/location",
    });
    this.controller = new LocationController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /location/{id}/setDefault:
     *   post:
     *     summary: Set default location
     *     tags: [Location]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Default location set
     */
    this.router.post(
      "/:id/setDefault",
      this.controller.setDefault.bind(this.controller)
    );
    /**
     * @swagger
     * /location:
     *   post:
     *     summary: Create location
     *     tags: [Location]
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
     *     responses:
     *       201:
     *         description: Location created
     */
    this.router.post("/", this.controller.createLocation.bind(this.controller));
    /**
     * @swagger
     * /location/customer:
     *   get:
     *     summary: Get customer locations
     *     tags: [Location]
     *     responses:
     *       200:
     *         description: List of locations
     */
    this.router.get(
      "/customer",
      this.controller.getLocations.bind(this.controller)
    );
    /**
     * @swagger
     * /location/{id}:
     *   patch:
     *     summary: Update location
     *     tags: [Location]
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
     *               address:
     *                 type: string
     *               latitude:
     *                 type: number
     *               longitude:
     *                 type: number
     *     responses:
     *       200:
     *         description: Location updated
     */
    this.router.patch(
      "/:id",
      this.controller.updateLocation.bind(this.controller)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
