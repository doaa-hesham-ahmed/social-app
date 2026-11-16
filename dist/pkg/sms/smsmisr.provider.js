"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsMisrProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../lib/config/env");
class SmsMisrProvider {
    config;
    constructor(config) {
        this.config = config;
    }
    async sendSms(mobile, message) {
        const body = new URLSearchParams({
            environment: this.config.environment,
            username: this.config.username,
            password: this.config.password,
            sender: this.config.sender,
            mobile,
            language: this.config.language,
            message
        });
        const response = await axios_1.default.post(env_1.env.sms.apiUrl, body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }
        });
        return response.data;
    }
}
exports.SmsMisrProvider = SmsMisrProvider;
