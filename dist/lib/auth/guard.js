"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const error_1 = require("../error/error");
// interface JwtPayload {
//     sub: string;
//     email: string;
//     role: string;
// }
function authGuard(req, _res, next) {
    try {
        const token = req.cookies?.access_token;
        if (!token)
            throw new error_1.AppError("Access token is required", 401);
        req.user = jsonwebtoken_1.default.verify(token, env_1.env.jwt.accessScret);
        next();
    }
    catch (error) {
        next(error);
    }
}
