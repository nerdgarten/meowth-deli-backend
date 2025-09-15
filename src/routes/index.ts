import { Router } from "express";

import { AdminRouter } from "@/routes/admin.route";
import { AuthRouter } from "@/routes/auth.route";
<<<<<<< HEAD
import { ProfileRouter } from "@/routes/profile.route";
import { RestaurantRouter } from "@/routes/restaurant.route";
=======
import { CustomerRouter } from "@/routes/customer.route";
>>>>>>> 55f873d0883f18680e6c263a9a8a69db3fb20706
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
<<<<<<< HEAD
    this.router.use("/restaurant", restaurantRouter.getRouter());
    this.router.use("/profile", profileRouter.getRouter());
=======
    this.router.use("/customer", customerRouter.getRouter());
>>>>>>> 55f873d0883f18680e6c263a9a8a69db3fb20706
    this.router.use("/api-test", testRouter.getRouter());
    this.router.use("/dish", dishRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
