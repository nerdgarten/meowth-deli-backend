import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Validation failed",
          errors: error.issues.map((err) => ({  // Changed from error.errors to error.issues
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error"
      });
    }
  };
};