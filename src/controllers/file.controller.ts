import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import FileService from "@/services/file.service";
import { AppError } from "@/types/error";

export class FileController {
  private fileService: FileService;
  constructor() {
    this.fileService = new FileService();
  }

  // Restaurant verification endpoints
  async uploadFile(req: Request, res: Response) {
    try {
      const file = req.file;
      res
        .status(StatusCodes.OK)
        .json({ message: "File uploaded successfully", file });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
}
