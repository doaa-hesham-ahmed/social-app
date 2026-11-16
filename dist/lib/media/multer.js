"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUploadFile = multerUploadFile;
exports.uploadSingleFile = uploadSingleFile;
exports.uploadMultiFile = uploadMultiFile;
exports.uploadFieldsFile = uploadFieldsFile;
const multer_1 = __importStar(require("multer"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const error_1 = require("../error/error");
const file_validation_1 = require("./file.validation");
function multerUploadFile(allowTypes = file_validation_1.allowedTypes.images) {
    return (0, multer_1.default)({
        fileFilter(_req, file, cb) {
            console.log("File name:", file.originalname);
            console.log("Received MIME type:", file.mimetype);
            console.log("Allowed types:", allowTypes);
            if (!allowTypes.includes(file.mimetype)) {
                return cb(new error_1.AppError("Invalid file format", 400));
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        storage: (0, multer_1.diskStorage)({
            destination: "uploads",
            filename(_req, file, cb) {
                cb(null, `${node_crypto_1.default.randomUUID()}-${file.originalname}`);
            },
        }),
    });
}
function uploadSingleFile(fileName, allowTypes = file_validation_1.allowedTypes.images) {
    return multerUploadFile(allowTypes).single(fileName);
}
function uploadMultiFile(fileName, maxCount = 5) {
    return multerUploadFile().array(fileName, maxCount);
}
function uploadFieldsFile(fields) {
    return multerUploadFile().fields(fields);
}
