import multer from "multer";

import type { Request } from "express";

export interface FileStatus {
  files: {
    id: string;
    filename: string;
    uploadedAt: string;
    status: "pending" | "verified" | "rejected";
    verifiedAt?: string;
    verifiedBy?: string;
    reason?: string;
  }[];
}
export interface FileManagement {
  userFiles: {
    id: string;
    is_verified_decided: "yes" | "no";
    status_path: string;
  }[];
}
export interface FilePaginationQuery {
  limit?: string | string[];
  offset?: string | string[];
}

export interface UploadConfig {
  folder: string;
  allowedFileTypes: string[];
  filename(req: Request, file: Express.Multer.File): string;
  limits?: multer.Options["limits"];
  fieldName: string;
}
