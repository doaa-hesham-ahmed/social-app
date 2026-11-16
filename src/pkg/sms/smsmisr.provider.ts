import axios from "axios";
import {env} from "../../lib/config/env";
import {ISmsProvider} from "./sms.interface";

interface ISmsMisrConfig {
    username: string;
    password: string;
    sender: string;
    environment: string;
    language: string;
}

export class SmsMisrProvider implements ISmsProvider {

    constructor(private config: ISmsMisrConfig) {
    }

    async sendSms(
        mobile: string,
        message: string
    ): Promise<unknown> {

        const body = new URLSearchParams({
            environment: this.config.environment,
            username: this.config.username,
            password: this.config.password,
            sender: this.config.sender,
            mobile,
            language: this.config.language,
            message
        });

        const response = await axios.post(
            env.sms.apiUrl, body,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            }
        );

        return response.data;
    }
}