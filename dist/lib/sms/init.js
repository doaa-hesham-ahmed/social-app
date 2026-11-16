"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsProvider = void 0;
const smsmisr_provider_1 = require("../../pkg/sms/smsmisr.provider");
const env_1 = require("./../config/env");
exports.smsProvider = new smsmisr_provider_1.SmsMisrProvider({
    username: env_1.env.sms.username,
    password: env_1.env.sms.password,
    sender: env_1.env.sms.sender,
    environment: env_1.env.sms.environment,
    language: env_1.env.sms.language
});
