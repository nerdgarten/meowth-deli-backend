import { StatusCodes } from "http-status-codes";
import { parse } from "yaml";
import { AppError } from "@/types/error";
import { FileManagement } from "@/types/file/file";
import { FileStatus } from "@/types/file/file";
import { FilePaginationQuery } from "@/types/file/file";
import { User } from "@/generated//client";
import UserRepository from "@/repositories/user.repository";

export default class AdminService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getPendingVerifications(
    paging: FilePaginationQuery,
    role: "restaurant" | "driver"
  ) {
    const managePath = `./upload/${role}/manage.yaml`;
    if (!fs.existsSync(managePath)) {
      throw new AppError("No pending verifications", StatusCodes.NOT_FOUND);
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

  async getFileIdPendingVerified(
    driverId: number,
    role: "restaurant" | "driver"
  ) {
    if (!driverId) {
      throw new AppError("Driver ID is required", StatusCodes.BAD_REQUEST);
    }
    const userFilePath = `./upload/driver/${driverId}/status.yaml`;
    if (!fs.existsSync(userFilePath)) {
      throw new AppError("File not found", StatusCodes.NOT_FOUND);
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
    const filePath = `./upload/driver/${driverId}/status.yaml`;
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
        "upload",
        "driver",
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
