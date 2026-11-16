"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashedPassword = hashedPassword;
exports.comparePassword = comparePassword;
const argon2_1 = __importDefault(require("argon2"));
async function hashedPassword(password) {
    // return bcrypt.hash(password,10)
    return argon2_1.default.hash(password);
}
;
async function comparePassword(password, hashedPassword) {
    // return bcrypt.compare(password,hashedPassword)
    return argon2_1.default.verify(hashedPassword, password);
}
