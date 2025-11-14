import { Router } from "express";

import { FileController } from "@/controllers/file.controller";
import { Role } from "@/generated/prisma/client";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";

import { BaseRouter } from "./baseRouter";

export class FileRouter extends BaseRouter {
  private controller: FileController;

  constructor() {
    super({
      prefix: "/file",
      middleware: [
        authMiddleware([
          Role.admin,
          Role.customer,
          Role.driver,
          Role.restaurant,
        ]),
        fileMiddleware,
      ],
    });
    this.controller = new FileController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant verification routes
    this.router.post(
      "/upload",
      this.controller.uploadFile.bind(this.controller)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
