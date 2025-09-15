
import { AppError } from "@/types/error";
import multer from "multer";

export default class FileService {
    public upload: multer.Multer;
    private storage: multer.StorageEngine;
    //   private imageFileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    //     if (
    //         file.mimetype === "image/jpeg" ||
    //         file.mimetype === "image/png" ||
    //         file.mimetype === "image/gif" ||
    //         file.mimetype === "image/webp"
    //     ) {
    //         cb(null, true);
    //     } else {
    //         cb(new Error("Only image files are allowed!"), false);
    //     }
    //   };


    constructor() {
        this.storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './upload')
            },
            filename: function (req, file, callback) {
                // const userId = req.user.id;
                const timestamp = Date.now();
                const originalName = '-' + timestamp;

                callback(null, originalName);
            }
        });
        this.upload = multer({
            storage: this.storage,
            limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
        });
    }
}
