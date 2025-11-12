import { Router } from "express";

import { FileController } from "@/controllers/file.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";

import { BaseRouter } from "./baseRouter";

export class FileRouter extends BaseRouter {
  private controller: FileController;

  constructor() {
    super({
      prefix: "/file",
      middleware: [authMiddleware, fileMiddleware],
    });
    this.controller = new FileController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant verification routes
    /**
     * @swagger
     * /file/upload:
     *   post:
     *     summary: Upload file
     *     tags: [File]
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
     *     responses:
     *       200:
     *         description: File uploaded
     */
    this.router.post(
      "/upload",
      this.controller.uploadFile.bind(this.controller),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
