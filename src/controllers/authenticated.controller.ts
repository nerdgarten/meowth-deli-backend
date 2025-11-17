import { User } from "@/generated/prisma/client";
import UserService from "@/services/user.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ChangePasswordRequestDTO } from "@/types/dto/user";
import { handleError } from "@/utils/handleError";

export class AuthenticatedController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async authenticatedAs(req: Request, res: Response) {
    const role = req.user?.role;
    res.status(StatusCodes.OK).json({
      message: "Authenticated route accessed successfully",
      role,
    });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.status(StatusCodes.OK).json({
      message: "Logged Out",
    });
  }

  async changePassword(req: Request, res: Response) {
    try {
      await this.userService.changePassword({
        userId: req.user!.id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      } as ChangePasswordRequestDTO);
      res
        .status(StatusCodes.OK)
        .json({ message: "Password has been reset successfully" });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }
}
