import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import fs from "fs";
import path from "path";
import { parse, stringify } from "yaml";
import { FileStatus } from "@/types/file/file";
import { FileManagement } from "@/types/file/file";




export function PaginationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    
    if (page < 1 || limit < 1) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Page and limit must be positive integers" });
        return;
    }
    
    next();
    
  } catch {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Pagination Error" });
  }
}
