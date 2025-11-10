import { AuthenticatedController } from "@/controllers/authenticated.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class AuthenticateRouter extends BaseRouter {
  private authenticatedController: AuthenticatedController;

  constructor() {
    super({
      prefix: "/authenticated",
      middleware: [authMiddleware],
    });

    this.authenticatedController = new AuthenticatedController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.get(
      "/",
      this.authenticatedController.authenticatedAs.bind(
        this.authenticatedController
      )
    );

    this.router.post(
      "/logout",
      this.authenticatedController.logout.bind(this.authenticatedController)
    );
  }
}
