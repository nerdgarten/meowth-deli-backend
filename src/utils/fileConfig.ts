import path from "path";

import multer from "multer";

import { UploadConfig } from "@/types/file/file";

import type { Request } from "express";

// export const pdfConfig: UploadConfig = {
//   folder: "certificate_file",
//   // allowedFileTypes: ["image/jpeg", "image/png", "image/jpg"],
//   // filename(req: Request, file: Express.Multer.File): string {
//   //   return `image_${req.user!.id}_${Date.now()}_${Math.random()
//   //     .toString(16)
//   //     .slice(2)}${path.extname(file.originalname)}`;
//   // },
//   // limits: {
//   //   fileSize: 10 * 1024 * 1024, // 10 MB
//   // },
//   fieldName: "certificateFile",
// };

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
