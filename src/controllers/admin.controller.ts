import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/enums";
import AdminService from "@/services/admin.service";
import {
  AdminVerificationRequest,
  AdminVerificationQuery,
} from "@/types/admin/verification";
import { AppError } from "@/types/error";
import { FilePaginationQuery } from "@/types/file/file";
import { handleError } from "@/utils/handleError";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async listRestaurants(req: Request, res: Response) {
    try {
      const { status } = req.query as AdminVerificationQuery;
      const result = await this.adminService.listRestaurants(
        status as string | VerificationStatus
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async verifyRestaurant(req: Request, res: Response) {
    try {
      const { id, status } = req.body as AdminVerificationRequest;
      const result = await this.adminService.verifyRestaurant(
        id,
        status as VerificationStatus
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res, "Failed to verify restaurant");
    }
  }

  async verifyDriver(req: Request, res: Response) {
    try {
      const { id, status } = req.body as AdminVerificationRequest;
      const result = await this.adminService.verifyDriver(
        id,
        status as VerificationStatus
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res, "Failed to verify driver");
    }
  }

  async listDrivers(req: Request, res: Response) {
    try {
      const { status } = req.query as AdminVerificationQuery;
      const result = await this.adminService.listDrivers(
        status as string | VerificationStatus
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res);
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
      handleError(error, res);
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
      handleError(error, res);
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

  async deleteUserById(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id ?? (req.body && req.body.userId));
      if (isNaN(userId) || userId <= 0) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "Invalid user id" });
        return;
      }
      await this.adminService.deleteUserById(userId);
      res.status(StatusCodes.OK).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: unknown) {
      handleError(error, res);
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const role = String(req.query.role ?? "");
      const roleValue = role === "" ? undefined : role;
      const paging = req.query as FilePaginationQuery;
      const result = await this.adminService.listUsers(
        paging,
        roleValue as string | undefined
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      handleError(error, res);
    }
  }
}
