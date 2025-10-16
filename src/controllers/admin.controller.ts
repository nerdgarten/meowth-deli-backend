import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AdminService from "@/services/admin.service";
import { FilePaginationQuery } from "@/types/file/file";
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
      console.log(result.filePath);
      res.sendFile(result.filePath);
      // res.status(StatusCodes.OK).json({
      //   message: result.message,
      // });
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
      res.sendFile(result.filePath);
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
