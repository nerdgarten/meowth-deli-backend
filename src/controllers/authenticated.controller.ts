import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AuthenticatedController {
  constructor() {}

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
}
