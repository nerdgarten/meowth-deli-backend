import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

import { Role } from "@/types/role";

export function roleMiddleware(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
