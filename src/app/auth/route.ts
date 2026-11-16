import {Router} from "express";
import AuthController from "./controller/auth.controller";
export const authRouter = Router();

authRouter.post('/register',AuthController.register);
authRouter.post('/login',AuthController.login);
authRouter.post('/verifyAcount',AuthController.verifyAcount);
authRouter.post('/sendOtp',AuthController.sendOtp);
authRouter.post('/resetPassword',AuthController.resetPassword);
authRouter.post('/refreshToken',AuthController.refreshTokenFn);
authRouter.post('/loginWithGoogle',AuthController.loginWithGoogle);
authRouter.post('/enable2StepVerify',AuthController.enable2StepVerification);
authRouter.post('/verify2StepVerify',AuthController.verifyCodeActive2StepVerified);
