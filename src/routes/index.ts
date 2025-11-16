import { Router } from "express";

// import { AdminRouter } from "@/routes/admin.route";
import { AuthRouter } from "@/routes/auth.route";
import { AuthenticateRouter } from "@/routes/authenticated.route";
import { CustomerRouter } from "@/routes/customer.route";
import { DishRouter } from "@/routes/dish.route";
import { DriverRouter } from "@/routes/driver.route";
import { LocationRouter } from "@/routes/location.route";
import { MapRouter } from "@/routes/map.route";
import { OrderRouter } from "@/routes/order.route";
// import { ReviewRouter } from "@/routes/review.route";
import { RestaurantRouter } from "@/routes/restaurant.route";
import { TestRouter } from "@/routes/test.route";

export class RouterManager {
  private readonly router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const authenticateRouter = new AuthenticateRouter();
    const customerRouter = new CustomerRouter();
    const restaurantRouter = new RestaurantRouter();
    const driverRouter = new DriverRouter();
    const locationRouter = new LocationRouter();
    const dishRouter = new DishRouter();
    const orderRouter = new OrderRouter();
    // const adminRouter = new AdminRouter();
    // const reviewRouter = new ReviewRouter();
    const mapRouter = new MapRouter();
    const testRouter = new TestRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/authenticate", authenticateRouter.getRouter());
    this.router.use("/customer", customerRouter.getRouter());
    this.router.use("/restaurant", restaurantRouter.getRouter());
    this.router.use("/driver", driverRouter.getRouter());
    this.router.use("/location", locationRouter.getRouter());
    this.router.use("/dish", dishRouter.getRouter());
    this.router.use("/order", orderRouter.getRouter());
    // this.router.use("/admin", adminRouter.getRouter());
    // this.router.use("/review", reviewRouter.getRouter());
    this.router.use("/map", mapRouter.getRouter());
    this.router.use("/api-test", testRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
