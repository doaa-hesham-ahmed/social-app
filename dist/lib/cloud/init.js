"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3CloudProvider = void 0;
const s3_cloud_1 = require("../../pkg/cloud/s3.cloud");
const env_1 = require("../config/env");
exports.s3CloudProvider = new s3_cloud_1.S3CloudProvider({
    region: env_1.env.aws.s3.region,
    accessKey: env_1.env.aws.s3.accessKey,
    secretKey: env_1.env.aws.s3.accessKey,
    bucketName: env_1.env.aws.s3.bucketName,
});
