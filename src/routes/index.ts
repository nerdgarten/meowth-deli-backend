import { Router } from "express";

import { AdminRouter } from "@/routes/admin.route";
import { AuthRouter } from "@/routes/auth.route";
import { RestaurantRouter } from "@/routes/restaurant.route";
import { TestRouter } from "@/routes/test.route";

export class RouterManager {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const adminRouter = new AdminRouter();
    const testRouter = new TestRouter();
    const restaurantRouter = new RestaurantRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/admin", adminRouter.getRouter());
    this.router.use("/restaurant", restaurantRouter.getRouter());
    this.router.use("/api-test", testRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
