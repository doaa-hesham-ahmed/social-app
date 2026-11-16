
import jwt from 'jsonwebtoken';
import { env } from '../../../lib/config/env.js';
import {toMs} from "../../../pkg/utils/time";
import {TUserPayload} from "../../../lib/interface/userPayload.interface";
import {Response} from "express";

export function generateaccessToken(payload:TUserPayload) {
    return jwt.sign(
        payload,
        env.jwt.accessScret,
        { expiresIn: toMs(1,'hours') }
    );
}

export function generaterefreshToken(payload:TUserPayload) {
    return jwt.sign(
        payload,
        env.jwt.refreshScret,
        { expiresIn: toMs(7,'days') }
    );
}

export function setCookies(res:Response,accessToken:string,refreshToken:string){
    res.cookie('access_token',accessToken,{
        httpOnly:true,
        maxAge:toMs(1,'hours')
    });
    res.cookie('refresh_token',refreshToken,{
        httpOnly:true,
        maxAge:toMs(7,'days'),
        path:'/api/auth/refresh-token'
    });

}
//
// export function generateToken(payload:TUserPayload) {
//     return {
//         accessToken: accessToken(payload),
//         refreshToken: refreshToken(payload)
//     };
// }
//
// export function generatedToken(token) {
//     const payload = jwt.verify(
//         token,
//         env.jwt.refreshScret
//     );
//
//     return generateToken({
//         id: payload.id,
//         role: payload.role,
//         name: payload.name,
//         email: payload.email
//     });
// }
