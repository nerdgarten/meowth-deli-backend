import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import UserService from "@/services/user.service";
import { ResetPasswordRequestDTO } from "@/types/dto/user";
import { handleError } from "@/utils/handleError";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signIn(req: Request, res: Response) {
    try {
      const token = await this.userService.signIn(req.body);

      res.cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.status(StatusCodes.OK).json({ token });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async signUpCustomer(req: Request, res: Response) {
    try {
      const user = await this.userService.createCustomerUser(req.body);

      res.status(StatusCodes.CREATED).json(user);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async signUpDriver(req: Request, res: Response) {
    try {
      const user = await this.userService.createDriverUser(req.body);

      res.status(StatusCodes.CREATED).json(user);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async signUpRestaurant(req: Request, res: Response) {
    try {
      const user = await this.userService.createRestaurantUser(req.body);

      res.status(StatusCodes.CREATED).json(user);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async requestResetPassword(req: Request, res: Response) {
    try {
      await this.userService.requestResetPassword(req.body.email);
      res
        .status(StatusCodes.OK)
        .json({ message: "Password reset email sent successfully" });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      await this.userService.resetPassword({
        token: req.params.token,
        password: req.body.password,
      } as ResetPasswordRequestDTO);
      res
        .status(StatusCodes.OK)
        .json({ message: "Password has been reset successfully" });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }
}
