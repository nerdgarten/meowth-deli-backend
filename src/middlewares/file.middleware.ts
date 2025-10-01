import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";

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
        callback(null, `./upload/${req.user.role}`);
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
      next();
    });
  } catch {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "File Upload Error" });
  }
}
