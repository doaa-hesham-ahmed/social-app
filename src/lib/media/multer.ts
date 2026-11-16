import multer, { diskStorage } from "multer";
import crypto from "node:crypto";
import { AppError } from "../error/error";
import { allowedTypes } from "./file.validation";

export function multerUploadFile(allowTypes = allowedTypes.images) {
    return multer({
        
      fileFilter(_req, file, cb) {
    console.log("File name:", file.originalname);
    console.log("Received MIME type:", file.mimetype);
    console.log("Allowed types:", allowTypes);

    if (!allowTypes.includes(file.mimetype)) {
        return cb(new AppError("Invalid file format", 400));
    }

    cb(null, true);
},
        limits: {
            fileSize: 5 * 1024 * 1024,
        },

        storage: diskStorage({
            destination: "uploads",
            filename(_req, file, cb) {
                cb(
                    null,
                    `${crypto.randomUUID()}-${file.originalname}`
                );
            },
        }),
    });
}

export function uploadSingleFile(fileName:string, allowTypes:string[] = allowedTypes.images) {
    return multerUploadFile(allowTypes).single(fileName);
}

export function uploadMultiFile(fileName:string, maxCount = 5) {
    return multerUploadFile().array(fileName, maxCount);
}

export function uploadFieldsFile(fields:{ name: string; maxCount?: number }[]) {
    return multerUploadFile().fields(fields);
}