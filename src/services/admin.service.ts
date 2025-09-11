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
        return "success";
      case AdminVerificationStatus.REJECTED:
        return "rejected";
      case AdminVerificationStatus.PENDING:
      default:
        return "pending";
    }
  }

  private buildWhereClause(status?: AdminVerificationStatus) {
    if (!status) return undefined;

    return {
      verification_status: this.mapStatus(status),
      is_available: status === AdminVerificationStatus.APPROVED,
    };
  }

  private buildUpdateData(status: AdminVerificationStatus) {
    return {
      verification_status: this.mapStatus(status),
      is_available: status === AdminVerificationStatus.APPROVED,
    };
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
    const whereClause = this.buildWhereClause(status);
    return this.adminRepository.listRestaurants(whereClause);
  }

  async verifyRestaurant(
    restaurantId: number,
    status: AdminVerificationStatus
  ) {
    this.validateStatus(status);

    const updateData = this.buildUpdateData(status);
    return await this.adminRepository.updateRestaurant(
      restaurantId,
      updateData
    );
  }

  async listDrivers(status?: AdminVerificationStatus) {
    if (status) {
      this.validateStatus(status);
    }
    const whereClause = this.buildWhereClause(status);
    return this.adminRepository.listDrivers(whereClause);
  }

  async verifyDriver(driverId: number, status: AdminVerificationStatus) {
    this.validateStatus(status);

    const updateData = this.buildUpdateData(status);
    return await this.adminRepository.updateDriver(driverId, updateData);
  }
}
