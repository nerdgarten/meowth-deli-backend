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
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User info
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 role:
     *                   type: string
     *                   enum: [customer, driver, restaurant, admin]
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
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logged out
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    this.router.post(
      "/logout",
      this.authenticatedController.logout.bind(this.authenticatedController)
    );
    this.router.patch(
      "/change-password",
      this.authenticatedController.changePassword.bind(
        this.authenticatedController
      )
    );
  }
}
