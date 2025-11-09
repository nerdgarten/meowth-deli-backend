import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AdminService from "@/services/admin.service";
import { FilePaginationQuery } from "@/types/file/file";
import path from "path";
import fs from "fs/promises";
import { constants as fsConstants } from "fs";
import {
  AdminVerificationRequest,
  AdminVerificationQuery,
} from "@/types/admin/verification";
import { AppError } from "@/types/error";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async listRestaurants(req: Request, res: Response) {
    try {
      const { status } = req.query as AdminVerificationQuery;
      const result = await this.adminService.listRestaurants(status);
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async verifyRestaurant(req: Request, res: Response) {
    try {
      const { id, status } = req.body as AdminVerificationRequest;
      const result = await this.adminService.verifyRestaurant(id, status);
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to verify restaurant",
      });
    }
  }

  async verifyDriver(req: Request, res: Response) {
    try {
      const { id, status } = req.body as AdminVerificationRequest;
      const result = await this.adminService.verifyDriver(id, status);
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to verify driver",
      });
    }
  }

  async listDrivers(req: Request, res: Response) {
    try {
      const { status } = req.query as AdminVerificationQuery;
      const result = await this.adminService.listDrivers(status);
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async getPendingVerifiedDrivers(req: Request, res: Response) {
    try {


      const result = await this.adminService.getPendingVerifications(
        req.query as FilePaginationQuery,
        "driver"
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async getFileIdPendingVerifiedDriver(req: Request, res: Response) {
    try {
      const driverId = Number(req.params.id);
      const result = await this.adminService.getFileIdPendingVerified(
        driverId,
        "driver"
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async getPendingVerifiedRestaurants(req: Request, res: Response) {
    try {

      const result = await this.adminService.getPendingVerifications(
        req.query as FilePaginationQuery,
        "restaurant"
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async getFileIdPendingVerifiedRestaurants(req: Request, res: Response) {
    try {
      const driverId = Number(req.params.id);
      console.log(driverId);
      if (isNaN(driverId)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid driver ID",
        });
        return;
      }
      const result = await this.adminService.getFileIdPendingVerified(
        driverId,
        "restaurant"
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async getDriverFileById(req: Request, res: Response) {
    try {
      const driverId = Number(req.params.id);
      const fileId = String(req.params.fileId);
      if (isNaN(driverId) || !fileId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid driver ID or file ID",
        });
        return;
      }
      const result = await this.adminService.getFileById(
        driverId,
        fileId,
        "driver"
      );
      const filePath = result.filePath;
       const BASE_DIR = path.resolve(__dirname, "../../uploads/drivers"); // adjust to your real location

       const resolvedPath = path.resolve(BASE_DIR, path.normalize(filePath));

       const baseWithSep = BASE_DIR.endsWith(path.sep)
         ? BASE_DIR
         : BASE_DIR + path.sep;
       if (!resolvedPath.startsWith(baseWithSep)) {
         return res.status(StatusCodes.BAD_REQUEST).json({
           success: false,
           message: "Invalid file path",
         });
       }

      const stat = await fs.stat(resolvedPath);
      if (!stat.isFile()) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "File not found",
        });
      }

      res.sendFile(resolvedPath, (err) => {
        if (err) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to send file",
          });
        }
      });

    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async getRestaurantFileById(req: Request, res: Response) {
    try {
      const driverId = Number(req.params.id);
      const fileId = String(req.params.fileId);
      if (isNaN(driverId) || !fileId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid driver ID or file ID",
        });
        return;
      }
      const result = await this.adminService.getFileById(
        driverId,
        fileId,
        "restaurant"
      );
      const filePath = result.filePath;
      const BASE_DIR = path.resolve(__dirname, "../../uploads/drivers"); // adjust to your real location

      const resolvedPath = path.resolve(BASE_DIR, path.normalize(filePath));

      const baseWithSep = BASE_DIR.endsWith(path.sep)
        ? BASE_DIR
        : BASE_DIR + path.sep;
      if (!resolvedPath.startsWith(baseWithSep)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid file path",
        });
      }

      const stat = await fs.stat(resolvedPath);
      if (!stat.isFile()) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "File not found",
        });
      }

      res.sendFile(resolvedPath, (err) => {
        if (err) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to send file",
          });
        }
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
