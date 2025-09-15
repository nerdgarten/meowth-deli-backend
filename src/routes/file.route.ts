import { Router } from "express";

import { FileController } from "@/controllers/file.controller";

import { BaseRouter } from "./baseRouter";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";

export class FileRouter extends BaseRouter {
    private controller: FileController;

    constructor() {
        super({
            prefix: "/file",
            middleware: [
                authMiddleware,
                fileMiddleware
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
