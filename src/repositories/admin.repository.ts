import { Prisma, VerificationStatus } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";
import { AdminVerificationStatus } from "@/types/admin/verification";

export default class AdminRepository {
  private readonly defaultOptions = {
    include: { 
      user: { 
        select: {
          id: true,
          email: true,
          roles: true
        } 
      } 
    },
    orderBy: { id: "desc" as const }
  };

  private mapToVerificationStatus(status: AdminVerificationStatus): VerificationStatus {
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

  async listRestaurants(where?: Prisma.RestaurantWhereInput) {
    return prisma.restaurant.findMany({
      where,
      ...this.defaultOptions
    });
  }

  async updateRestaurant(restaurantId: number, status: AdminVerificationStatus) {
    const verificationStatus = this.mapToVerificationStatus(status);
    
    return prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        verification_status: verificationStatus,
      },
      include: this.defaultOptions.include
    });
  }

  async listDrivers(where?: Prisma.DriverWhereInput) {
    return prisma.driver.findMany({
      where,
      ...this.defaultOptions
    });
  }

  async updateDriver(driverId: number, status: AdminVerificationStatus) {
    const verificationStatus = this.mapToVerificationStatus(status);

    return prisma.driver.update({
      where: { id: driverId },
      data: {
        verification_status: verificationStatus,
      },
      include: this.defaultOptions.include
    });
  }
}