"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailerProvider = void 0;
const nodemailer_1 = require("nodemailer");
class NodeMailerProvider {
    client;
    fromEmail;
    constructor(config) {
        this.client = (0, nodemailer_1.createTransport)({
            port: config.port,
            host: config.host,
            secure: true,
            auth: {
                user: config.user,
                pass: config.password,
            },
        });
        this.fromEmail = config.fromEmail;
    }
    async send(email, subject, html) {
        await this.client.sendMail({
            from: this.fromEmail,
            to: email,
            subject: subject,
            html: html,
        });
    }
}
exports.NodeMailerProvider = NodeMailerProvider;
