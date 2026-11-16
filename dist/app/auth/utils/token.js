"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateaccessToken = generateaccessToken;
exports.generaterefreshToken = generaterefreshToken;
exports.setCookies = setCookies;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../../../lib/config/env.js");
const time_1 = require("../../../pkg/utils/time");
function generateaccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.env.jwt.accessScret, { expiresIn: (0, time_1.toMs)(1, 'hours') });
}
function generaterefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.env.jwt.refreshScret, { expiresIn: (0, time_1.toMs)(7, 'days') });
}
function setCookies(res, accessToken, refreshToken) {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: (0, time_1.toMs)(1, 'hours')
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: (0, time_1.toMs)(7, 'days'),
        path: '/api/auth/refresh-token'
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
