import { Router } from "express";

import { AuthRouter } from "@/routes/auth.route";
import { AdminRouter } from "@/routes/admin.route";
import { TestRouter } from "@/routes/test.route";
import { CustomerRouter } from "@/routes/customer.route";

export class RouterManager {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const adminRouter = new AdminRouter();
    const customerRouter = new CustomerRouter();
    const testRouter = new TestRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/admin", adminRouter.getRouter());
    this.router.use("/customer", customerRouter.getRouter());
    this.router.use("/api-test", testRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
