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
    /**
     * @swagger
     * /auth/signin:
     *   post:
     *     summary: Sign in a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               role:
     *                 type: string
     *                 enum: [customer, driver, restaurant, admin]
     *             required:
     *               - email
     *               - password
     *               - role
     *     responses:
     *       200:
     *         description: Successful sign in
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       401:
     *         description: Invalid credentials
     */
    this.router.post(
      "/signin",
      this.authController.signIn.bind(this.authController)
    );
    /**
     * @swagger
     * /auth/signup/customer:
     *   post:
     *     summary: Sign up a customer
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               tel:
     *                 type: string
     *               firstname:
     *                 type: string
     *               lastname:
     *                 type: string
     *               image:
     *                 type: string
     *               accepted_term_of_service:
     *                 type: boolean
     *               accepted_pdpa:
     *                 type: boolean
     *               accepted_cookie_tracking:
     *                 type: boolean
     *             required:
     *               - email
     *               - password
     *               - tel
     *               - firstname
     *               - lastname
     *     responses:
     *       201:
     *         description: Customer created successfully
     *       400:
     *         description: Bad request
     */
    this.router.post(
      "/signup/customer",
      this.authController.signUpCustomer.bind(this.authController)
    );
    /**
     * @swagger
     * /auth/signup/driver:
     *   post:
     *     summary: Sign up a driver
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               tel:
     *                 type: string
     *               firstname:
     *                 type: string
     *               lastname:
     *                 type: string
     *               vehicle:
     *                 type: string
     *               licence:
     *                 type: string
     *               fee_rate:
     *                 type: number
     *               image:
     *                 type: string
     *               accepted_term_of_service:
     *                 type: boolean
     *               accepted_pdpa:
     *                 type: boolean
     *               accepted_cookie_tracking:
     *                 type: boolean
     *             required:
     *               - email
     *               - password
     *               - tel
     *               - firstname
     *               - lastname
     *               - vehicle
     *               - licence
     *     responses:
     *       201:
     *         description: Driver created successfully
     *       400:
     *         description: Bad request
     */
    this.router.post(
      "/signup/driver",
      this.authController.signUpDriver.bind(this.authController),
    );
    /**
     * @swagger
     * /auth/signup/restaurant:
     *   post:
     *     summary: Sign up a restaurant
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               tel:
     *                 type: string
     *               name:
     *                 type: string
     *               location:
     *                 type: string
     *               detail:
     *                 type: string
     *               fee_rate:
     *                 type: number
     *               image:
     *                 type: string
     *               accepted_term_of_service:
     *                 type: boolean
     *               accepted_pdpa:
     *                 type: boolean
     *               accepted_cookie_tracking:
     *                 type: boolean
     *             required:
     *               - email
     *               - password
     *               - tel
     *               - name
     *               - location
     *     responses:
     *       201:
     *         description: Restaurant created successfully
     *       400:
     *         description: Bad request
     */
    this.router.post(
      "/signup/restaurant",
      this.authController.signUpRestaurant.bind(this.authController),
    );
    /**
     * @swagger
     * /auth/reset/request:
     *   post:
     *     summary: Request password reset
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *             required:
     *               - email
     *     responses:
     *       200:
     *         description: Reset email sent
     *       400:
     *         description: Bad request
     */
    this.router.post(
      "/reset/request",
      this.authController.requestResetPassword.bind(this.authController)
    );
    /**
     * @swagger
     * /auth/reset/{token}:
     *   patch:
     *     summary: Reset password
     *     tags: [Auth]
     *     parameters:
     *       - in: path
     *         name: token
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                 type: string
     *             required:
     *               - password
     *     responses:
     *       200:
     *         description: Password reset successfully
     *       400:
     *         description: Bad request
     */
    this.router.patch(
      "/reset/:token",
      this.authController.resetPassword.bind(this.authController)
    );
  }
}
