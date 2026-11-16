"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../service/auth.service"));
class AuthController {
    authService = auth_service_1.default;
    // 1. Register
    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({
                message: "User created successfully",
                success: true,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    };
    // 2. Verify Account
    verifyAcount = async (req, res, next) => {
        try {
            const user = await this.authService.verifyAcount(req.body);
            res.status(200).json({
                message: "Account verified successfully",
                success: true,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    };
    // 3. Login
    login = async (req, res, next) => {
        try {
            const tokens = await this.authService.login(req.body);
            res.status(200).json({
                message: "Login successfully",
                success: true,
                data: tokens
            });
        }
        catch (error) {
            next(error);
        }
    };
    // 4. Send OTP
    sendOtp = async (req, res, next) => {
        try {
            await this.authService.sendOtp(req.body);
            res.status(200).json({
                message: "OTP sent successfully",
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
    // 5. Reset Password
    resetPassword = async (req, res, next) => {
        try {
            await this.authService.resetPassword(req.body);
            res.status(200).json({
                message: "Password reset successfully",
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
    // 6. Login with Google
    loginWithGoogle = async (req, res, next) => {
        try {
            const { idToken } = req.body;
            const token = await this.authService.loginWithGoogle(idToken);
            res.status(200).json({
                message: "Google login successfully",
                success: true,
                data: token
            });
        }
        catch (error) {
            next(error);
        }
    };
    // 7. Refresh Token
    refreshTokenFn = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refreshTokenFn(refreshToken);
            res.status(200).json({
                message: "Tokens refreshed successfully",
                success: true,
                data: tokens
            });
        }
        catch (error) {
            next(error);
        }
    };
    // 8. Enable Two-Step Verification
    enable2StepVerification = async (req, res, next) => {
        try {
            await this.authService.enable2StepVerification(req.body);
            res.status(200).json({
                message: "Verification code sent successfully",
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new AuthController();
