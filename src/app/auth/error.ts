import {AppError} from "../../lib/error/error";

export const otpExpired = new AppError("otp Expired, please resend otp",400);
export const invalidCode = new AppError("Invalid code",400);
export const invalidPassword = new AppError("Invalid Password",401);
export const verificationEnabled = new AppError("Two step verification already enabled", 409);
export const verifyAccountFirst =  new AppError("Please verify your account first", 400);