import { Router } from "express";

import { AdminRouter } from "@/routes/admin.route";
import { AuthRouter } from "@/routes/auth.route";
import { ProfileRouter } from "@/routes/profile.route";
import { RestaurantRouter } from "@/routes/restaurant.route";
import { TestRouter } from "@/routes/test.route";

import { DishRouter } from "./dish.route";

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
    const restaurantRouter = new RestaurantRouter();
    const dishRouter = new DishRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/admin", adminRouter.getRouter());
    this.router.use("/restaurant", restaurantRouter.getRouter());
    this.router.use("/profile", profileRouter.getRouter());
    this.router.use("/api-test", testRouter.getRouter());
    this.router.use("/dish", dishRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
