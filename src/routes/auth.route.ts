import { AuthController } from "@/controllers/auth.controller";
import { BaseRouter } from "./baseRouter";

// router.post("/signin", signin);
// router.post("/signup", signup);
// router.post("/signup/customer", signupCustomer);
// router.post("/signup/driver", signupDriver);
// router.post("/signup/restaurant", signupRestaurant);

// export default router;

export class AuthRouter extends BaseRouter {
  private authController: AuthController;

  constructor() {
    super({ prefix: "/auth" });

    this.authController = new AuthController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.post(
      "/signin",
      this.authController.signin.bind(this.authController)
    );
  }
}
