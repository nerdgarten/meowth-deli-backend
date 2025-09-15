import { Router } from "express";

import { AdminRouter } from "@/routes/admin.route";
import { AuthRouter } from "@/routes/auth.route";
import { RestaurantRouter } from "@/routes/restaurant.route";
import { CustomerRouter } from "@/routes/customer.route";
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
    const customerRouter = new CustomerRouter();
    const testRouter = new TestRouter();
    const restaurantRouter = new RestaurantRouter();
    const dishRouter = new DishRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/admin", adminRouter.getRouter());
    this.router.use("/restaurant", restaurantRouter.getRouter());
    this.router.use("/customer", customerRouter.getRouter());
    this.router.use("/api-test", testRouter.getRouter());
    this.router.use("/dish", dishRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
