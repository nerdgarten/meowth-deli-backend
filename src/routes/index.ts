import { Router } from "express";

import { AdminRouter } from "@/routes/admin.route";
import { AuthRouter } from "@/routes/auth.route";
import { AuthenticateRouter } from "@/routes/authenticated.route";
import { CustomerRouter } from "@/routes/customer.route";
import { DishRouter } from "@/routes/dish.route";
import { DriverRouter } from "@/routes/driver.route";
import { FileRouter } from "@/routes/file.route";
import { RestaurantRouter } from "@/routes/restaurant.route";
import { ReviewRouter } from "@/routes/review.route";
import { TestRouter } from "@/routes/test.route";
import { LocationRouter } from "@/routes/location.route";
import { FavouriteRouter } from "@/routes/favourite.route";

export class RouterManager {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const authenticatedRouter = new AuthenticateRouter();
    const adminRouter = new AdminRouter();
    const customerRouter = new CustomerRouter();
    const fileRouter = new FileRouter();
    const restaurantRouter = new RestaurantRouter();
    const dishRouter = new DishRouter();
    const reviewRouter = new ReviewRouter();
    const driverRouter = new DriverRouter();
    const testRouter = new TestRouter();
    const locationRouter = new LocationRouter();
    const favouriteRouter = new FavouriteRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/authenticated", authenticatedRouter.getRouter());
    this.router.use("/admin", adminRouter.getRouter());
    this.router.use("/restaurant", restaurantRouter.getRouter());
    this.router.use("/customer", customerRouter.getRouter());
    this.router.use("/file", fileRouter.getRouter());
    this.router.use("/dish", dishRouter.getRouter());
    this.router.use("/review", reviewRouter.getRouter());
    this.router.use("/driver", driverRouter.getRouter());
    this.router.use("/api-test", testRouter.getRouter());
    this.router.use("/location", locationRouter.getRouter());
    this.router.use("/favourite", favouriteRouter.getRouter());

    this.router.use("/test", testRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
