"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerProvider = exports.mailjetProvider = void 0;
const mailjet_1 = require("../../pkg/mailjet/mailjet");
const env_1 = require("../config/env");
const nodemailer_1 = require("../../pkg/mailjet/nodemailer");
exports.mailjetProvider = new mailjet_1.MailjetProvider({
    apiKey: env_1.env.mailjet.apiKey,
    apiSecret: env_1.env.mailjet.apiSecret,
    fromEmail: env_1.env.mailjet.fromEmail,
    fromName: env_1.env.mailjet.fromName,
});
exports.nodemailerProvider = new nodemailer_1.NodeMailerProvider({
    user: env_1.env.nodemailer.user,
    password: env_1.env.nodemailer.mailPassword,
    host: env_1.env.nodemailer.host,
    port: env_1.env.nodemailer.port,
    fromEmail: env_1.env.nodemailer.fromEmail,
});
