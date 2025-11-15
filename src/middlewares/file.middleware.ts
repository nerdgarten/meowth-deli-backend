import fs from "fs";
import path from "path";

import { NextFunction, Request, Response } from "express";
import multer from "multer";

import { UploadConfig } from "@/types/file/file";

declare module "express" {
  export interface Request {
    uploadFolder?: string;
  }
}

export function fileMiddleware(config: UploadConfig) {
  const uploadPath = path.join(process.cwd(), "uploads", config.folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      if (!req.user || !req.user.id) {
        return callback(new Error("User ID is missing"), "");
      }
      const userFolder = path.join(
        uploadPath,
        req.user.role,
        String(req.user.id)
      );
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }
      callback(null, userFolder);
    },
    filename: function (req: Request, file: Express.Multer.File, callback) {
      if (!req.user || !req.user.id) {
        return callback(new Error("User ID is missing"), "");
      }
      callback(null, config.filename(req, file));
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
      if (config.allowedFileTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error(`File type not allowed: ${file.mimetype}`));
      }
    },
    limits: config.limits ?? {},
  }).single(config.fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      req.uploadFolder = config.folder;
      next();
    });
  };
}
