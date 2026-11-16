"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const Schema = zod_1.z.object({
    PORT: zod_1.z.string().default('3000'),
    MONGOOSE_URL: zod_1.z.string(),
    //nodeMailer
    MAIL_USER: zod_1.z.string().trim().toLowerCase(),
    MAIL_PASSWORD: zod_1.z.string(),
    SMTP_HOST: zod_1.z.string().default("smtp.gmail.com"),
    SMTP_PORT: zod_1.z.coerce.number().default(465),
    MAIL_FROM_EMAIL: zod_1.z.string().email(),
    //JWT_SECRET:z.string(),
    ACCESS_SECRET: zod_1.z.string(),
    REFRESH_SECRET: zod_1.z.string(),
    //login with google
    GOOGLE_OAUT_CLIENT_ID: zod_1.z.string(),
    //caching
    REDIS_HOST: zod_1.z.string(),
    // REDIS_PORT:z.string().describe('6379'),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    REDIS_PASSWORD: zod_1.z.string(),
    //mailjet
    MAILJET_API_KEY: zod_1.z.string(),
    MAILJET_API_SECRET: zod_1.z.string(),
    MAILJET_FROM_EMAIL: zod_1.z.string(),
    MAILJET_FROM_NAME: zod_1.z.string(),
    //SMS
    SMS_PROVIDER: zod_1.z.enum(["smsmisr", "cequens", "twilio"]).default("smsmisr"),
    SMS_API_URL: zod_1.z.string().url(),
    SMS_USER_NAME: zod_1.z.string().min(1),
    SMS_PASSWORD: zod_1.z.string().min(1),
    SMS_SENDER: zod_1.z.string().min(1),
    SMS_ENVIRONMENT: zod_1.z.string(),
    SMS_LANGUAGE: zod_1.z.string(),
    //aws_s3_cloud
    S3_REGION: zod_1.z.string(),
    S3_BUCKET_NAME: zod_1.z.string(),
    S3_ACCESS_KEY: zod_1.z.string(),
    S3_SECRET_KEY: zod_1.z.string(),
});
const parsed = Schema.parse(process.env);
exports.env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.MONGOOSE_URL,
    },
    google: {
        authClientId: parsed.GOOGLE_OAUT_CLIENT_ID,
    },
    jwt: {
        //secret:parsed.JWT_SECRET,
        accessScret: parsed.ACCESS_SECRET,
        refreshScret: parsed.REFRESH_SECRET,
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: parsed.REDIS_PORT,
        password: parsed.REDIS_PASSWORD,
    },
    nodemailer: {
        user: parsed.MAIL_USER,
        mailPassword: parsed.MAIL_PASSWORD,
        host: parsed.SMTP_HOST,
        port: parsed.SMTP_PORT,
        fromEmail: parsed.MAIL_FROM_EMAIL,
    },
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME,
    },
    sms: {
        provider: parsed.SMS_PROVIDER,
        apiUrl: parsed.SMS_API_URL,
        username: parsed.SMS_USER_NAME,
        password: parsed.SMS_PASSWORD,
        sender: parsed.SMS_SENDER,
        environment: parsed.SMS_ENVIRONMENT,
        language: parsed.SMS_LANGUAGE,
    },
    aws: {
        s3: {
            region: parsed.S3_REGION,
            bucketName: parsed.S3_BUCKET_NAME,
            accessKey: parsed.S3_ACCESS_KEY,
            secretKey: parsed.S3_SECRET_KEY,
        }
    }
};
