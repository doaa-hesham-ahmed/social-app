"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAlreadyVerified = exports.userAlreadyExist = exports.userNotExist = void 0;
const error_js_1 = require("../../lib/error/error.js");
exports.userNotExist = new error_js_1.AppError("User does not exist", 404);
exports.userAlreadyExist = new error_js_1.AppError("User already exist", 409);
exports.userAlreadyVerified = new error_js_1.AppError("you already verified", 409);
