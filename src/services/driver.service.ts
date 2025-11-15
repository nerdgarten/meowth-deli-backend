import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/enums";
import DriverRepository from "@/repositories/driver.repository";
import { AppError } from "@/types/error";
import { driverUpdateProfileSchema } from "@/validators/profile.schema";
import {
  GetDriverResponseDTO,
  UpdateDriverProfileRequestDTO,
} from "@/types/dto/driver";

export class DriverService {
  private driverRepository: DriverRepository;

  constructor() {
    this.driverRepository = new DriverRepository();
  }

  async getDrivers(): Promise<GetDriverResponseDTO[]> {
    return this.driverRepository.getDrivers();
  }

  async getDriverProfileById(id: number): Promise<GetDriverResponseDTO> {
    const data = await this.driverRepository.getDriverProfileById(id);
    if (!data) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    return data;
  }

  async getDriverByStatus(
    status: VerificationStatus
  ): Promise<GetDriverResponseDTO[]> {
    const data = await this.driverRepository.getDriverByStatus(status);
    return data;
  }

  async updateDriverProfileById(
    driverId: number,
    body: UpdateDriverProfileRequestDTO
  ): Promise<GetDriverResponseDTO> {
    const dto = driverUpdateProfileSchema.parse(body);
    const data = await this.driverRepository.updateDriverProfileById(
      driverId,
      dto
    );
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return data;
  }

  async updateDriverAvailabilityById(
    driverId: number,
    is_available: boolean
  ): Promise<GetDriverResponseDTO> {
    const updatedProfile =
      await this.driverRepository.updateDriverAvailabilityById(
        driverId,
        is_available
      );

    return updatedProfile;
  }
}
