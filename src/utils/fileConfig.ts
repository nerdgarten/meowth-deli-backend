import fs from "fs";
import path from "path";

import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { parse, stringify } from "yaml";

import { AppError } from "@/types/error";
import { UploadConfig, FileStatus, FileManagement } from "@/types/file/file";


import type { Request } from "express";



export const certificateFileConfig: UploadConfig = {
  folder: "certificate_file",
  allowedFileTypes: ["application/pdf"],
  filename(req: Request, file: Express.Multer.File): string {
    return `certificate_${req.user!.id}_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}${path.extname(file.originalname)}`;
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
  fieldName: "certificateFile",
};

export const restaurantBannerConfig: UploadConfig = {
  folder: "restaurant_banners",
  allowedFileTypes: ["image/jpeg", "image/png", "image/jpg"],
  filename(req: Request, file: Express.Multer.File): string {
    return `/image_${req.user!.id}_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}${path.extname(file.originalname)}`;
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fieldName: "restaurantBanner",
};

export const profilePictureConfig: UploadConfig = {
  folder: "profile_pictures",
  allowedFileTypes: ["image/jpeg", "image/png", "image/jpg"],
  filename(req: Request, file: Express.Multer.File): string {
    return `/image_${req.user!.id}_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}${path.extname(file.originalname)}`;
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fieldName: "profilePicture",
};

export const dishPictureConfig: UploadConfig = {
  folder: "dish_pictures",
  allowedFileTypes: ["image/jpeg", "image/png", "image/jpg"],
  filename(req: Request, file: Express.Multer.File): string {
    return `/image_${req.user!.id}_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}${path.extname(file.originalname)}`;
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fieldName: "dishPicture",
};

export const updateFileStatus = (
  uploadPath: string,
  fileInfo: FileStatus["files"][0]
) => {
  const statusPath = path.join(uploadPath, "status.yaml");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    fs.writeFileSync(
      path.join(uploadPath, "status.yaml"),
      stringify({ files: [] } as FileStatus)
    );
  }
  let fileStatus: FileStatus = { files: [] };

  if (fs.existsSync(statusPath)) {
    const fileContent = fs.readFileSync(statusPath, "utf8");
    fileStatus = parse(fileContent) as FileStatus;
  }

  fileStatus.files.push(fileInfo);
  fs.writeFileSync(statusPath, stringify(fileStatus));
};

export const uploadManageFilesStatus = (
  managePath: string,
  id: string,
  status: "yes" | "no",
  status_path: string
) => {
  const statusPath = path.join(managePath, "manage.yaml");
  if (!fs.existsSync(statusPath)) {
    fs.writeFileSync(
      path.join(statusPath),
      stringify({ userFiles: [] } as FileManagement)
    );
  }
  const fileContent = fs.readFileSync(statusPath, "utf8");
  const fileStatus: FileManagement = parse(fileContent);
  const userFileIndex = fileStatus.userFiles.findIndex(
    (file) => file.id === id
  );
  if (userFileIndex !== -1) {
    fileStatus.userFiles[userFileIndex].is_verified_decided = status;
  } else {
    fileStatus.userFiles.push({ id, is_verified_decided: status, status_path });
  }
  fs.writeFileSync(statusPath, stringify(fileStatus));
};

export const resultingFilePath = (req: Request) => {
  if (!req.user)
    throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);
  if (!req.file)
    throw new AppError("No file uploaded", StatusCodes.BAD_REQUEST);
  if (process.env.BASE_URL === undefined || process.env.UPLOAD === undefined) {
    throw new AppError(
      "BASE_URL or UPLOAD is not defined",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return `${process.env.BASE_URL}${process.env.UPLOAD}/${req.uploadFolder!}/${req.user!.role}/${req.user!.id}/${req.file!.filename}`;
};

export const resultingManagePath = (req: Request) => {
  if (!req.user)
    throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);
  if (process.env.UPLOAD === undefined) {
    throw new AppError(
      "UPLOAD is not defined",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return path.join(
    process.cwd(),
    process.env.UPLOAD,
    req.uploadFolder!,
    req.user.role
  );
};

export const resultingUploadPath = (req: Request) => {
  if (!req.user)
    throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);
  if (process.env.UPLOAD === undefined) {
    throw new AppError(
      "UPLOAD is not defined",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return path.join(
    process.cwd(),
    process.env.UPLOAD,
    req.uploadFolder!,
    req.user.role,
    req.user.id.toString()
  );
};
