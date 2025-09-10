import { Prisma, VerificationStatus } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";
import { AdminVerificationStatus, VerificationType } from "@/types/admin/verification";

export default class AdminRepository {
  private readonly userSelect = {
    id: true,
    email: true,
    roles: true
  } as const;

  private mapStatus(status: AdminVerificationStatus): VerificationStatus {
    const mapping: Record<AdminVerificationStatus, VerificationStatus> = {
      [AdminVerificationStatus.APPROVED]: "success",
      [AdminVerificationStatus.REJECTED]: "rejected",
      [AdminVerificationStatus.PENDING]: "pending"
    };
    return mapping[status];
  }

  private buildWhereClause(status?: AdminVerificationStatus) {
    if (!status) return undefined;
    
    return {
      verification_status: this.mapStatus(status),
      is_available: status === AdminVerificationStatus.APPROVED
    };
  }

  private buildUpdateData(status: AdminVerificationStatus) {
    return {
      verification_status: this.mapStatus(status),
      is_available: status === AdminVerificationStatus.APPROVED
    };
  }

  async listRestaurantsByVerificationStatus(status?: AdminVerificationStatus) {
    return prisma.restaurant.findMany({
      where: this.buildWhereClause(status),
      include: { user: { select: this.userSelect } },
      orderBy: { id: "desc" }
    });
  }

  async updateRestaurantVerificationStatus(restaurantId: number, status: AdminVerificationStatus) {
    return prisma.restaurant.update({
      where: { id: restaurantId },
      data: this.buildUpdateData(status),
      include: { user: { select: this.userSelect } }
    });
  }

  async listDriversByVerificationStatus(status?: AdminVerificationStatus) {
    return prisma.driver.findMany({
      where: this.buildWhereClause(status),
      include: { user: { select: this.userSelect } },
      orderBy: { id: "desc" }
    });
  }

  async updateDriverVerificationStatus(driverId: number, status: AdminVerificationStatus) {
    return prisma.driver.update({
      where: { id: driverId },
      data: this.buildUpdateData(status),
      include: { user: { select: this.userSelect } }
    });
  }
}

