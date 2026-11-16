import { z } from "zod";
import { config } from "dotenv";
config()
const Schema = z.object({
    PORT:z.string().default('3000'),

    MONGOOSE_URL:z.string(),
     //nodeMailer
    MAIL_USER:z.string().trim().toLowerCase(),
    MAIL_PASSWORD:z.string(),
    SMTP_HOST: z.string().default("smtp.gmail.com"),
    SMTP_PORT: z.coerce.number().default(465),
    MAIL_FROM_EMAIL: z.string().email(),

    //JWT_SECRET:z.string(),
    ACCESS_SECRET:z.string(),
    REFRESH_SECRET:z.string(),
    //login with google
    GOOGLE_OAUT_CLIENT_ID:z.string(),
    //caching
    REDIS_HOST:z.string(),
    // REDIS_PORT:z.string().describe('6379'),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD:z.string(),
     //mailjet
    MAILJET_API_KEY:z.string(),
    MAILJET_API_SECRET:z.string(),
    MAILJET_FROM_EMAIL:z.string(),
    MAILJET_FROM_NAME:z.string(),

    //SMS

    SMS_PROVIDER: z.enum(["smsmisr", "cequens", "twilio"]).default("smsmisr"),
    SMS_API_URL: z.string().url(),
    SMS_USER_NAME: z.string().min(1),
    SMS_PASSWORD: z.string().min(1),
    SMS_SENDER: z.string().min(1),
    SMS_ENVIRONMENT: z.string(),
    SMS_LANGUAGE: z.string(),

    //aws_s3_cloud

    S3_REGION: z.string(),
    S3_BUCKET_NAME: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
})


const parsed =  Schema.parse(process.env);
export const env ={
    
    port:Number(parsed.PORT),
    db:{
        url:parsed.MONGOOSE_URL,
    },
    google:{
       authClientId:parsed.GOOGLE_OAUT_CLIENT_ID,
    },
    jwt:{
      //secret:parsed.JWT_SECRET,
      accessScret:parsed.ACCESS_SECRET,
      refreshScret:parsed.REFRESH_SECRET,
    },
    redis:{
        host:parsed.REDIS_HOST,
        port:parsed.REDIS_PORT,
        password:parsed.REDIS_PASSWORD,
    },
    nodemailer: {
        user: parsed.MAIL_USER,
        mailPassword: parsed.MAIL_PASSWORD,
        host: parsed.SMTP_HOST,
        port: parsed.SMTP_PORT,
        fromEmail: parsed.MAIL_FROM_EMAIL,
    },
    mailjet:{
        apiKey:parsed.MAILJET_API_KEY,
        apiSecret:parsed.MAILJET_API_SECRET,
        fromEmail:parsed.MAILJET_FROM_EMAIL,
        fromName:parsed.MAILJET_FROM_NAME,
    },
    sms:{
    provider: parsed.SMS_PROVIDER,
    apiUrl: parsed.SMS_API_URL,
    username: parsed.SMS_USER_NAME,
    password: parsed.SMS_PASSWORD,
    sender: parsed.SMS_SENDER,
    environment: parsed.SMS_ENVIRONMENT,
    language: parsed.SMS_LANGUAGE,
    },

    aws:{
        s3:{
            region:parsed.S3_REGION,
            bucketName:parsed.S3_BUCKET_NAME,
            accessKey:parsed.S3_ACCESS_KEY,
            secretKey:parsed.S3_SECRET_KEY,
        }
    }


}