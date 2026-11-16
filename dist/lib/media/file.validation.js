"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileValidation = exports.allowedTypes = void 0;
const file_type_1 = require("file-type");
const node_fs_1 = __importDefault(require("node:fs"));
exports.allowedTypes = {
    images: ["image/jpeg", "image/png"],
    files: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    videos: ["video/mp4"],
    audios: ["audio/mp4"]
};
const fileValidation = (allowTypes = exports.allowedTypes.images) => async (req, _res, next) => {
    try {
        let files = [];
        // Support single and multiple uploads
        if (req.file) {
            files = [req.file];
        }
        else if (Array.isArray(req.files)) {
            files = req.files;
        }
        else if (req.files) {
            files = Object.values(req.files).flat();
        }
        if (files.length === 0) {
            return next(new Error("No file uploaded"));
        }
        for (const file of files) {
            const buffer = node_fs_1.default.readFileSync(file.path);
            const type = await (0, file_type_1.fileTypeFromBuffer)(buffer);
            if (!type || !allowTypes.includes(type.mime)) {
                if (node_fs_1.default.existsSync(file.path)) {
                    node_fs_1.default.unlinkSync(file.path);
                }
                return next(new Error("Invalid file type"));
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.fileValidation = fileValidation;
