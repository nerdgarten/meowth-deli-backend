import { AuthController } from "@/controllers/auth.controller";
import { BaseRouter } from "@/routes/baseRouter";

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
      this.authController.signIn.bind(this.authController)
    );
    this.router.post(
      "/signup/customer",
      this.authController.signUpCustomer.bind(this.authController)
    );
    this.router.post(
      "/signup/driver",
      this.authController.signUpDriver.bind(this.authController),
    );
    this.router.post(
      "/signup/restaurant",
      this.authController.signUpRestaurant.bind(this.authController),
    );
    this.router.patch(
      "/reset/request",
      this.authController.requestResetPassword.bind(this.authController)
    );
    this.router.patch(
      "/reset/:token",
      this.authController.resetPassword.bind(this.authController)
    );
  }
}
