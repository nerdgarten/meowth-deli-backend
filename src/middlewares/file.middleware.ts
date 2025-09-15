import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import multer from "multer";



export function fileMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {


    try {
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './upload')
            },
            filename: function (req, file, callback) {
                // if (!req.user || !req.user.id) {
                //   // Pass an error to Multer if user or user.id is missing
                //     return callback(new Error("User ID is missing"), "");
                // }
                // const userId = req.user.id;
                const timestamp = Date.now();
                const originalName = '-' + timestamp;
                callback(null, originalName + ".jpg");
            }
        });
        const upload = multer({
            storage: storage,
            limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
        }).single('file');

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
                return;
            } else if (err) {
                // An unknown error occurred when uploading.
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
                return;
            }
            // Everything went fine.
            next();
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "File Upload Error" });
    }
}
