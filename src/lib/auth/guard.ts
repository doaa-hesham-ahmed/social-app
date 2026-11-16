import jwt, {JwtPayload} from "jsonwebtoken";
import { env } from "../config/env";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/error";

// interface JwtPayload {
//     sub: string;
//     email: string;
//     role: string;
// }

export function authGuard(req: Request, _res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.access_token;
        if (!token) throw new AppError("Access token is required", 401);
        req.user = jwt.verify(token,env.jwt.accessScret) as JwtPayload;

        next();
    } catch (error) {
        next(error);
    }
}
