import { SmsMisrProvider } from "../../pkg/sms/smsmisr.provider";
import {env} from "./../config/env";

export const smsProvider = new SmsMisrProvider({
    username: env.sms.username,
    password: env.sms.password,
    sender: env.sms.sender,
    environment: env.sms.environment,
    language: env.sms.language
});