import AdminRepository from "@/repositories/admin.repository";
import { AdminVerificationStatus, VerificationType } from "@/types/admin/verification";
import { AppError } from "@/types/error";
import { StatusCodes } from "http-status-codes";

export default class AdminService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async listRestaurants(status?: AdminVerificationStatus) {
    return this.adminRepository.listRestaurantsByVerificationStatus(status);
  }

  async verifyRestaurant(restaurantId: number, status: AdminVerificationStatus) {

    if (!Object.values(AdminVerificationStatus).includes(status)) {
      throw new AppError("Invalid status. Allowed: pending, approved, rejected", StatusCodes.BAD_REQUEST);
    }

    try {
      return await this.adminRepository.updateRestaurantVerificationStatus(restaurantId, status);
    } catch (error) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
  }

  async listDrivers(status?: AdminVerificationStatus) {
    return this.adminRepository.listDriversByVerificationStatus(status);
  }

  async verifyDriver(driverId: number, status: AdminVerificationStatus) {
    
    if (!Object.values(AdminVerificationStatus).includes(status)) {
      throw new AppError("Invalid status. Allowed: pending, approved, rejected", StatusCodes.BAD_REQUEST);
    }

    try {
      return await this.adminRepository.updateDriverVerificationStatus(driverId, status);
    } catch (error) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
  }

}


