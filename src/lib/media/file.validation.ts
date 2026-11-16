
import { fileTypeFromBuffer } from "file-type";
import fs from "node:fs";
import {Request,Response,NextFunction} from "express";

export const allowedTypes = {
    images: ["image/jpeg", "image/png"],
    files: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    videos: ["video/mp4"],
    audios: ["audio/mp4"]
};

export const fileValidation =
    (allowTypes:string[] = allowedTypes.images) =>
    async (req:Request, _res:Response, next:NextFunction) => {
        try {
            let files: Express.Multer.File[] = [];
            // Support single and multiple uploads
            if (req.file) {
                files = [req.file];
            } else if (Array.isArray(req.files)) {
                files = req.files;
            } else if (req.files) {
                files = Object.values(req.files).flat();
            }
            if (files.length === 0) {
                return next(new Error("No file uploaded"));
            }

            for (const file of files) {
                const buffer = fs.readFileSync(file.path);
                const type = await fileTypeFromBuffer(buffer);

                if (!type || !allowTypes.includes(type.mime)) {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }

                    return next(new Error("Invalid file type"));
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };