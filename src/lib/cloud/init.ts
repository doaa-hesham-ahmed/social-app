import {S3CloudProvider} from "../../pkg/cloud/s3.cloud";
import {env} from "../config/env";

export const s3CloudProvider = new S3CloudProvider({
    region:env.aws.s3.region,
    accessKey:env.aws.s3.accessKey,
    secretKey:env.aws.s3.accessKey,
    bucketName:env.aws.s3.bucketName,
})