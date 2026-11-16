"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./controller/auth.controller"));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', auth_controller_1.default.register);
exports.authRouter.post('/login', auth_controller_1.default.login);
exports.authRouter.post('/verifyAcount', auth_controller_1.default.verifyAcount);
exports.authRouter.post('/sendOtp', auth_controller_1.default.sendOtp);
exports.authRouter.post('/resetPassword', auth_controller_1.default.resetPassword);
exports.authRouter.post('/refreshToken', auth_controller_1.default.refreshTokenFn);
exports.authRouter.post('/loginWithGoogle', auth_controller_1.default.loginWithGoogle);
exports.authRouter.post('/enable2StepVerify', auth_controller_1.default.enable2StepVerification);
// authRouter.post('/verify2StepVerify',AuthController.verifyCodeActive2StepVerified);
