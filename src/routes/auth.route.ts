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
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *             required:
     *               - email
     *               - password
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
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               firstname:
     *                 type: string
     *               lastname:
     *                 type: string
     *               tel:
     *                 type: string
     *               accepted_term_of_service:
     *                 type: boolean
     *               accepted_pdpa:
     *                 type: boolean
     *             required:
     *               - email
     *               - password
     *               - firstname
     *               - lastname
     *               - tel
     *     responses:
     *       201:
     *         description: Customer created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 email:
     *                   type: string
     *                 role:
     *                   type: string
     *                 firstname:
     *                   type: string
     *                 lastname:
     *                   type: string
     *                 tel:
     *                   type: string
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
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               firstname:
     *                 type: string
     *               lastname:
     *                 type: string
     *               tel:
     *                 type: string
     *               accepted_term_of_service:
     *                 type: boolean
     *               accepted_pdpa:
     *                 type: boolean
     *             required:
     *               - email
     *               - password
     *               - firstname
     *               - lastname
     *               - tel
     *     responses:
     *       201:
     *         description: Driver created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 email:
     *                   type: string
     *                 role:
     *                   type: string
     *                 firstname:
     *                   type: string
     *                 lastname:
     *                   type: string
     *                 tel:
     *                   type: string
     *       400:
     *         description: Bad request
     */
    this.router.post(
      "/signup/driver",
      this.authController.signUpDriver.bind(this.authController)
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
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               name:
     *                 type: string
     *               tel:
     *                 type: string
     *               detail:
     *                 type: string
     *               accepted_term_of_service:
     *                 type: boolean
     *               accepted_pdpa:
     *                 type: boolean
     *             required:
     *               - email
     *               - password
     *               - name
     *               - tel
     *     responses:
     *       201:
     *         description: Restaurant created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 email:
     *                   type: string
     *                 role:
     *                   type: string
     *                 name:
     *                   type: string
     *                 tel:
     *                   type: string
     *                 detail:
     *                   type: string
     *       400:
     *         description: Bad request
     */
    this.router.post(
      "/signup/restaurant",
      this.authController.signUpRestaurant.bind(this.authController)
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
     *                 format: email
     *             required:
     *               - email
     *     responses:
     *       200:
     *         description: Reset email sent
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
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
     *                 minLength: 6
     *             required:
     *               - password
     *     responses:
     *       200:
     *         description: Password reset successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: Bad request
     */
    this.router.patch(
      "/reset/:token",
      this.authController.resetPassword.bind(this.authController)
    );
  }
}
