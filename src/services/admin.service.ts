import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/client";
import AdminRepository from "@/repositories/admin.repository";
import { AdminVerificationStatus } from "@/types/admin/verification";
import { AppError } from "@/types/error";

export default class AdminService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }
  
  private mapStatus(status: AdminVerificationStatus): VerificationStatus {
    switch (status) {
      case AdminVerificationStatus.APPROVED:
        return VerificationStatus.approved;
      case AdminVerificationStatus.REJECTED:
        return VerificationStatus.rejected;
      case AdminVerificationStatus.PENDING:
      default:
        return VerificationStatus.pending;
    }
  }

  private validateStatus(status: AdminVerificationStatus) {
    const allowed: AdminVerificationStatus[] = [
      AdminVerificationStatus.PENDING,
      AdminVerificationStatus.APPROVED,
      AdminVerificationStatus.REJECTED,
    ];

    if (!allowed.includes(status)) {
      throw new AppError(
        `Invalid status. Allowed: ${allowed.join(", ")}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async listRestaurants(status?: AdminVerificationStatus) {
    if (status) {
      this.validateStatus(status);
    }
    return this.adminRepository.listRestaurants(status ? { verification_status: this.mapStatus(status) } : undefined);
  }

  async verifyRestaurant(restaurantId: number, status: AdminVerificationStatus) {
    this.validateStatus(status);

    const result = await this.adminRepository.updateRestaurant(restaurantId, status);
    return {
      success: true,
      message: `Restaurant verification status updated to ${status.toLowerCase()}`,
      data: {
        ...result,
        status: this.mapStatus(status)
      }
    };
  }

  async verifyDriver(driverId: number, status: AdminVerificationStatus) {
    this.validateStatus(status);

    const result = await this.adminRepository.updateDriver(driverId, status);
    return {
      success: true,
      message: `Driver verification status updated to ${status.toLowerCase()}`,
      data: {
        ...result,
        status: this.mapStatus(status)
      }
    };
  }

  async listDrivers(status?: AdminVerificationStatus) {
    if (status) {
      this.validateStatus(status);
    }
    return this.adminRepository.listDrivers(status ? { verification_status: this.mapStatus(status) } : undefined);
  }
}
