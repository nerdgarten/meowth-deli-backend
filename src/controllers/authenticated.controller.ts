import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AuthenticatedController {
  constructor() {}

  async isAuthenticated(req: Request, res: Response) {
    res.status(StatusCodes.OK).json({
      message: "Authenticated route accessed successfully",
    });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.status(StatusCodes.OK).json({
      message: "Logged Out",
    });
  }
}
