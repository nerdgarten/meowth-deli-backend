import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "@/types/error";

export function handleError(error: unknown, res: Response) {
  console.error(error); // Log the full error for internal tracking

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
    });
  }
}
