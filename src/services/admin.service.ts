import fs from "fs";
import path from "path";

import { StatusCodes } from "http-status-codes";
import { parse } from "yaml";

// generated prisma and repositories
import { VerificationStatus } from "@/generated/prisma/client";
import DriverRepository from "@/repositories/driver.repository";
import RestaurantRepository from "@/repositories/restaurant.repository";
import UserRepository from "@/repositories/user.repository";
import { AppError } from "@/types/error";
import { FileManagement } from "@/types/file/file";
import { FileStatus } from "@/types/file/file";
import { FilePaginationQuery } from "@/types/file/file";

export default class AdminService {
  private userRepository: UserRepository;
  private restaurantRepository: RestaurantRepository;
  private driverRepository: DriverRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.restaurantRepository = new RestaurantRepository();
    this.driverRepository = new DriverRepository();
  }

  async getPendingVerifications(
    paging: FilePaginationQuery,
    role: "restaurant" | "driver"
  ) {
    const baseUpload = process.env.UPLOAD ?? "uploads";
    const managePath = path.join(
      process.cwd(),
      baseUpload,
      "certificate_file",
      role,
      "manage.yaml"
    );
    if (!fs.existsSync(managePath)) {
      // If no manage.yaml exists, return an empty paginated result instead of 404
      const limit = Math.min(Number(paging.limit) || 10, 100);
      const offset = Math.max(Number(paging.offset) || 0, 0);
      return {
        success: true,
        message: "No pending verifications",
        data: [],
        total: 0,
        offset: offset,
        limit: limit,
      };
    }
    const fileContent = fs.readFileSync(managePath, "utf8");
    const manageData = parse(fileContent) as FileManagement;
    const pendingVerifications = manageData.userFiles.filter(
      (file) => file.is_verified_decided === "no"
    );
    const limit = Math.min(Number(paging.limit) || 10, 100);
    const offset = Math.max(Number(paging.offset) || 0, 0);

    const paginatedData = pendingVerifications.slice(
      offset,
      Math.max(offset + limit, pendingVerifications.length)
    );

    return {
      success: true,
      message: "Pending verifications retrieved successfully",
      data: paginatedData,
      total: pendingVerifications.length,
      offset: offset,
      limit: limit,
    };
  }

  async listRestaurants(status?: string | VerificationStatus) {
    if (status) {
      const normalized = String(status).toLowerCase();
      let vs: VerificationStatus;
      if (normalized === "pending") vs = VerificationStatus.pending;
      else if (normalized === "approved") vs = VerificationStatus.approved;
      else if (normalized === "rejected") vs = VerificationStatus.rejected;
      else throw new AppError("Invalid status filter", StatusCodes.BAD_REQUEST);
      return await this.restaurantRepository.getRestaurantsByStatus(vs);
    }
    return await this.restaurantRepository.getRestaurants(false);
  }

  async verifyRestaurant(id: number, status: VerificationStatus) {
    const restaurant =
      await this.restaurantRepository.getRestaurantProfileById(id);
    if (!restaurant)
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    const is_available = status === "approved";
    const updated = await this.restaurantRepository.updateRestaurnatProfileById(
      id,
      {
        verification_status: status,
        is_available,
      }
    );
    return {
      success: true,
      message: `Restaurant verification status updated to ${status}`,
      data: updated,
    };
  }

  async listDrivers(status?: string | VerificationStatus) {
    if (status) {
      const normalized = String(status).toLowerCase();
      let vs: VerificationStatus;
      if (normalized === "pending") vs = VerificationStatus.pending;
      else if (normalized === "approved") vs = VerificationStatus.approved;
      else if (normalized === "rejected") vs = VerificationStatus.rejected;
      else throw new AppError("Invalid status filter", StatusCodes.BAD_REQUEST);
      return await this.driverRepository.getDriverByStatus(vs);
    }
    return await this.driverRepository.getDrivers(false);
  }

  async listUsers(paging: FilePaginationQuery, role?: string) {
    // normalize pagination
    const limit = Math.min(Number(paging.limit) || 10, 100);
    const offset = Math.max(Number(paging.offset) || 0, 0);
    const result = await this.userRepository.getUsersWithProfiles(
      role,
      limit,
      offset
    );
    return {
      success: true,
      message: "Users retrieved successfully",
      data: result.data,
      total: result.total,
      offset,
      limit,
    };
  }

  async verifyDriver(id: number, status: VerificationStatus) {
    const driver = await this.driverRepository.getDriverProfileById(id);
    if (!driver) throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    const is_available = status === "approved";
    const updated = await this.driverRepository.updateDriverProfileById(id, {
      verification_status: status,
      is_available,
    });
    return {
      success: true,
      message: `Driver verification status updated to ${status}`,
      data: updated,
    };
  }

  async getFileIdPendingVerified(
    driverId: number,
    role: "restaurant" | "driver"
  ) {
    if (!driverId) {
      throw new AppError("Driver ID is required", StatusCodes.BAD_REQUEST);
    }
    const baseUpload2 = process.env.UPLOAD ?? "uploads";
    const userFilePath = path.join(
      process.cwd(),
      baseUpload2,
      "certificate_file",
      "driver",
      `${driverId}`,
      "status.yaml"
    );
    if (!fs.existsSync(userFilePath)) {
      // No file found for this user — return empty list with a success message
      return {
        success: true,
        message: "No pending file for this user",
        data: [],
      };
    }
    const fileContent = fs.readFileSync(userFilePath, "utf8");
    const userFileData = parse(fileContent) as FileStatus;
    const driverFile = userFileData.files.filter(
      (file) => file.status === "pending"
    );
    if (!driverFile) {
      throw new AppError(
        `No pending file for this ${role}`,
        StatusCodes.NOT_FOUND
      );
    }
    return {
      success: true,
      message: "File retrieved successfully",
      data: driverFile,
    };
  }

  async getFileById(
    driverId: number,
    fileId: string,
    role: "restaurant" | "driver"
  ) {
    const baseUpload3 = process.env.UPLOAD ?? "uploads";
    const filePath = path.join(
      process.cwd(),
      baseUpload3,
      "certificate_file",
      role,
      driverId.toString(),
      "status.yaml"
    );
    if (!fs.existsSync(filePath)) {
      throw new AppError("Driver file not found", StatusCodes.NOT_FOUND);
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    const userFileData = parse(fileContent) as FileStatus;
    const File = userFileData.files.find((file) => file.id === fileId);
    if (!File) {
      throw new AppError("File not found", StatusCodes.NOT_FOUND);
    }

    return {
      message: `File retrieved successfully`,
      filePath: path.join(
        process.cwd(),
        baseUpload3,
        "certificate_file",
        role,
        driverId.toString(),
        File.filename
      ),
    };
  }

  async deleteUserById(userId: number) {
    if (!userId) {
      throw new AppError("User ID is required", StatusCodes.BAD_REQUEST);
    }
    await this.userRepository.deleteUserById(userId);
  }
}
