
import { createTransport, Transporter } from "nodemailer";
import {MailProvider} from "./mail.interface";
interface INodemailerConfig {
    port: number;
    host: string;
    user: string;
    password: string;
    fromEmail: string;
}

export class NodeMailerProvider implements MailProvider {
    private client: Transporter;
    private readonly fromEmail: string;

    constructor(config: INodemailerConfig) {
        this.client = createTransport({
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

    async send(email: string, subject: string, html: string) {
        await this.client.sendMail({
            from: this.fromEmail,
            to: email,
            subject:subject,
            html:html,
        });
    }
}
