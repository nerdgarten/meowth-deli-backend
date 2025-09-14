import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/client";
import AdminRepository from "@/repositories/admin.repository";
import { AppError } from "@/types/error";

export default class AdminService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async listRestaurants(status?: VerificationStatus) {
    if (!status) {
        throw new AppError("...", StatusCodes.BAD_REQUEST)
    }
    return this.adminRepository.listRestaurants(status ? { verification_status: status } : undefined);
  }

  async verifyRestaurant(restaurantId: number, status: VerificationStatus) {
    if (!status) {
        throw new AppError("...", StatusCodes.BAD_REQUEST)
    }

    const result = await this.adminRepository.updateRestaurant(restaurantId, status);
    return {
      success: true,
      message: `Restaurant verification status updated to ${status.toLowerCase()}`,
      data: {
        ...result,
        status: status
      }
    };
  }

  async verifyDriver(driverId: number, status: VerificationStatus) {
    if (!status) {
        throw new AppError("...", StatusCodes.BAD_REQUEST)
    }

    const result = await this.adminRepository.updateDriver(driverId, status);
    return {
      success: true,
      message: `Driver verification status updated to ${status.toLowerCase()}`,
      data: {
        ...result,
        status: status
      }
    };
  }

  async listDrivers(status?: VerificationStatus) {
    if (!status) {
      throw new AppError("...", StatusCodes.BAD_REQUEST)
    }
    return this.adminRepository.listDrivers(status ? { verification_status: status } : undefined);
  }
}
