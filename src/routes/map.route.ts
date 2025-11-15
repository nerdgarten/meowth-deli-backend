import { MapController } from "@/controllers/map.controller";

import { BaseRouter } from "./baseRouter";

export class MapRouter extends BaseRouter {
  private mapController: MapController;

  constructor() {
    super({ prefix: "/map" });

    this.mapController = new MapController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    /**
     * @swagger
     * /map/svg:
     *   post:
     *     summary: Get map SVG with markers
     *     tags: [Map]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - center
     *             properties:
     *               center:
     *                 type: object
     *                 properties:
     *                   lat:
     *                     type: number
     *                   lng:
     *                     type: number
     *               zoom:
     *                 type: number
     *               width:
     *                 type: number
     *               height:
     *                 type: number
     *               markers:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     location:
     *                       type: object
     *                       properties:
     *                         lat:
     *                           type: number
     *                         lng:
     *                           type: number
     *                     label:
     *                       type: string
     *                     color:
     *                       type: string
     *     responses:
     *       200:
     *         description: Map SVG returned
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 svg:
     *                   type: string
     */
    this.router.post(
      "/svg",
      this.mapController.getMapSVG.bind(this.mapController)
    );

    /**
     * @swagger
     * /map/reverse-geocode:
     *   post:
     *     summary: Get address from coordinates
     *     tags: [Map]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - location
     *             properties:
     *               location:
     *                 type: object
     *                 properties:
     *                   lat:
     *                     type: number
     *                   lng:
     *                     type: number
     *     responses:
     *       200:
     *         description: Address returned
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 address:
     *                   type: string
     */
    this.router.post(
      "/reverse-geocode",
      this.mapController.reverseGeocode.bind(this.mapController)
    );

    /**
     * @swagger
     * /map/geocode:
     *   post:
     *     summary: Get coordinates from address
     *     tags: [Map]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - address
     *             properties:
     *               address:
     *                 type: string
     *     responses:
     *       200:
     *         description: Coordinates returned
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 results:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       formatted_address:
     *                         type: string
     *                       location:
     *                         type: object
     *                         properties:
     *                           lat:
     *                             type: number
     *                           lng:
     *                             type: number
     */
    this.router.post(
      "/geocode",
      this.mapController.geocode.bind(this.mapController)
    );
  }
}
