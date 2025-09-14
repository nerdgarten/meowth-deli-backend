import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { IJwtData } from "@/types/auth/jwt";
import { verifyJwt } from "@/utils/jwt";

declare module "express" {
    export interface Request {
        user?: IJwtData;
    }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const cookies = req.cookies;

  const token = cookies?.token as string | undefined;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }

  try {
    const jwtData = verifyJwt(token);
    req.user = jwtData;
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
}
