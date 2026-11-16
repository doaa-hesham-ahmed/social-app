
import { NextFunction, Request, Response } from "express";
import authService, { AuthService } from "../service/auth.service";

class AuthController {
    private authService: AuthService = authService;

    // 1. Register
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.register(req.body);

            res.status(201).json({
                message: "User created successfully",
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    // 2. Verify Account
    verifyAcount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.verifyAcount(req.body);

            res.status(200).json({
                message: "Account verified successfully",
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    // 3. Login
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokens = await this.authService.login(req.body);

            res.status(200).json({
                message: "Login successfully",
                success: true,
                data: tokens
            });
        } catch (error) {
            next(error);
        }
    };

    // 4. Send OTP
    sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.sendOtp(req.body);

            res.status(200).json({
                message: "OTP sent successfully",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // 5. Reset Password
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.resetPassword(req.body);

            res.status(200).json({
                message: "Password reset successfully",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    // 6. Login with Google
    loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { idToken } = req.body;

            const token = await this.authService.loginWithGoogle(idToken);

            res.status(200).json({
                message: "Google login successfully",
                success: true,
                data: token
            });
        } catch (error) {
            next(error);
        }
    };

    // 7. Refresh Token
    refreshTokenFn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;

            const tokens = await this.authService.refreshTokenFn(refreshToken);

            res.status(200).json({
                message: "Tokens refreshed successfully",
                success: true,
                data: tokens
            });
        } catch (error) {
            next(error);
        }
    };

    // 8. Enable Two-Step Verification
    enable2StepVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.enable2StepVerification(req.body);

            res.status(200).json({
                message: "Verification code sent successfully",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

   // 9. Verify OTP and Activate Two-Step Verification
    verifyCodeActive2StepVerified = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = await this.authService.verifyCodeActive2StepVerified(req.body);

            res.status(200).json({
                message: "Two-step verification enabled successfully",
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();
