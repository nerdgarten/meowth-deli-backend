import { Router } from "express";

import { AuthRouter } from "@/routes/auth.route";
import { AdminRouter } from "@/routes/admin.route";
import { ProfileRouter } from "@/routes/profile.route";
import { TestRouter } from "@/routes/test.route";
import { FileRouter } from "@/routes/file.route";

export class RouterManager {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const adminRouter = new AdminRouter();
    const profileRouter = new ProfileRouter();
    const testRouter = new TestRouter();
    const fileRouter = new FileRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/admin", adminRouter.getRouter());
    this.router.use("/profile", profileRouter.getRouter());
    this.router.use("/api-test", testRouter.getRouter());
    this.router.use("/file", fileRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
