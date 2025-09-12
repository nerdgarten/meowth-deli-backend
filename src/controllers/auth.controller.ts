import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AuthService from "@/services/auth.service";
import { AppError } from "@/types/error";
import { z } from "zod";

const emailVerificationSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const phoneVerificationSchema = z.object({
  tel: z
    .string()
    .regex(/^\+?[1-9]\d{10,14}$/, { message: "Invalid phone number format" }),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async signIn(req: Request, res: Response) {
    try {
      emailVerificationSchema.parse(req.body);
      phoneVerificationSchema.parse(req.body);
      const user = await this.authService.signIn(req.body);

      res.cookie("token", user.token, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(StatusCodes.OK).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during signin:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async signUpCustomer(req: Request, res: Response) {
    try {
      emailVerificationSchema.parse(req.body);
      phoneVerificationSchema.parse(req.body);
      const user = await this.authService.createCustomerUser(req.body);

      res.status(StatusCodes.CREATED).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during signup:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async signUpDriver(req: Request, res: Response) {
    try {
      emailVerificationSchema.parse(req.body);
      phoneVerificationSchema.parse(req.body);
      const user = await this.authService.createDriverUser(req.body);

      res.status(StatusCodes.CREATED).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during signup:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async signUpRestaurant(req: Request, res: Response) {
    try {
      emailVerificationSchema.parse(req.body);
      phoneVerificationSchema.parse(req.body);
      const user = await this.authService.createRestaurantUser(req.body);

      res.status(StatusCodes.CREATED).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during signup:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async verifyAdminStatus(req: Request, res: Response) {
    try {
      const token = req.cookies?.token as string | undefined;
      const result = await this.authService.verifyAdminStatus(token);

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during verify admin status:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
}
