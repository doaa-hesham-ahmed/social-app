"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountFirst = exports.verificationEnabled = exports.invalidPassword = exports.invalidCode = exports.otpExpired = void 0;
const error_1 = require("../../lib/error/error");
exports.otpExpired = new error_1.AppError("otp Expired, please resend otp", 400);
exports.invalidCode = new error_1.AppError("Invalid code", 400);
exports.invalidPassword = new error_1.AppError("Invalid Password", 401);
exports.verificationEnabled = new error_1.AppError("Two step verification already enabled", 409);
exports.verifyAccountFirst = new error_1.AppError("Please verify your account first", 400);
