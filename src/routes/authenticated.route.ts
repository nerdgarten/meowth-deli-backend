import { AuthenticatedController } from "@/controllers/authenticated.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class AuthenticateRouter extends BaseRouter {
  private authenticatedController: AuthenticatedController;

  constructor() {
    super({
      prefix: "/authenticate",
      middleware: [authMiddleware],
    });

    this.authenticatedController = new AuthenticatedController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    /**
     * @swagger
     * /authenticate:
     *   get:
     *     summary: Get authenticated user info
     *     tags: [Authenticated]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: User info
     */
    this.router.get(
      "/",
      this.authenticatedController.authenticatedAs.bind(
        this.authenticatedController
      )
    );

    /**
     * @swagger
     * /authenticate/logout:
     *   post:
     *     summary: Logout user
     *     tags: [Authenticated]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Logged out
     */
    this.router.post(
      "/logout",
      this.authenticatedController.logout.bind(this.authenticatedController)
    );
  }
}
