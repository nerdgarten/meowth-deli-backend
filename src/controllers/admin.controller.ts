import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AdminService from "@/services/admin.service";
import { AppError } from "@/types/error";
import { AdminVerificationStatus, VerificationType } from "@/types/admin/verification";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  // Restaurant verification endpoints
  async listRestaurants(req: Request, res: Response) {
    try {
      const { status } = req.query as { status?: AdminVerificationStatus };
      const result = await this.adminService.listRestaurants(status);
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async verifyRestaurant(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body as { status: AdminVerificationStatus };
      const result = await this.adminService.verifyRestaurant(id, status);
      res.status(StatusCodes.OK).json({
        message: `Restaurant status updated to ${status} successfully`,
        data: result
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  // Driver verification endpoints
  async listDrivers(req: Request, res: Response) {
    try {
      const { status } = req.query as { status?: AdminVerificationStatus };
      const result = await this.adminService.listDrivers(status);
      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async verifyDriver(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body as { status: AdminVerificationStatus };
      const result = await this.adminService.verifyDriver(id, status);
      res.status(StatusCodes.OK).json({
        message: `Driver status updated to ${status} successfully`,
        data: result
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

}


