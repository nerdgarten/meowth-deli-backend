import { Router } from "express";

import { AuthRouter } from "./auth.route";
import { AdminRouter } from "./admin.route";

export class RouterManager {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const adminRouter = new AdminRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/admin", adminRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
