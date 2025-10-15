import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import fs from "fs";
import path from "path";
import { parse, stringify } from "yaml";
import { FileStatus } from "@/types/file/file";
import { FileManagement } from "@/types/file/file";

const updateFileStatus = (
  uploadPath: string,
  fileInfo: FileStatus["files"][0]
) => {
  const statusPath = path.join(uploadPath, "status.yaml");
  let fileStatus: FileStatus = { files: [] };

  if (fs.existsSync(statusPath)) {
    const fileContent = fs.readFileSync(statusPath, "utf8");
    fileStatus = parse(fileContent) as FileStatus;
  }

  fileStatus.files.push(fileInfo);

  fs.writeFileSync(statusPath, stringify(fileStatus));
};
const UploadManageFilseStatus = (
  managePath: string,
  id: string,
  status: "yes" | "no",
  status_path: string,
) => {
  const statusPath = path.join(managePath, "manage.yaml");
  if (!fs.existsSync(statusPath)) {
    fs.writeFileSync(path.join(statusPath), stringify({ userFiles: [] } as FileManagement));
  }
  const fileContent = fs.readFileSync(statusPath, 'utf8');
  const fileStatus: FileManagement = parse(fileContent);
  const userFileIndex = fileStatus.userFiles.findIndex(file => file.id === id);
  if (userFileIndex !== -1) {
    fileStatus.userFiles[userFileIndex].is_verified_decided = status;
  } else {
    fileStatus.userFiles.push({ id, is_verified_decided: status, status_path });
  }
  fs.writeFileSync(statusPath, stringify(fileStatus));   
}



export function fileMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    
    const pdfFileFilter: multer.Options["fileFilter"] = (req, file, callback) => {
      if (file.mimetype === "application/pdf") {
        callback(null, true);
      } else {
        callback(new Error("Accept PDF File Only"));
      }
    };
    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        if (!req.user || !req.user.role) {
          return callback(new Error("User Role is missing"), "");
        }
        const uploadPath = path.join(
          "./upload",
          req.user.role,
          req.user.id.toString()
        );
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
          fs.writeFileSync(path.join(uploadPath, "status.yaml"), stringify({ files: [] } as FileStatus));
        }
        callback(null, uploadPath);
      },
      filename: function (req, file, callback) {
        if (!req.user || !req.user.id) {
          return callback(new Error("User ID is missing"), "");
        }
        callback(null, req.user.id + "_Certificate_" + Date.now() + ".pdf"); // e.g., 123_Certificate_1616161616161.pdf
      },
    });
    const upload = multer({
      storage: storage,
      fileFilter: pdfFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }).single("file");

    upload(req, res, function (err) {
      if (!req.user || !req.user.role) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "User ID not verrified" });
        return;
      }
      const managePath = path.join("./upload", req.user.role);

      const uploadPath = path.join(
        "./upload",
        req.user.role,
        req.user.id.toString()
      );

      UploadManageFilseStatus(
        managePath,
        req.user.id.toString(),
        "no",
        path.join(uploadPath, "status.yaml")
      );

      if (err instanceof multer.MulterError) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
        return;
      } else if (err) {
        // Show the actual error message from pdfFileFilter
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: err.message || "File Upload Error" });
        return;
      }
      if (!req.file) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "No file provided" });
        return;
      }
      updateFileStatus(uploadPath, {
        filename: req.file.filename,
        uploadedAt: new Date().toISOString(),
        status: "pending",
      });
      next();
    });
  } catch {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "File Upload Error" });
  }
}
