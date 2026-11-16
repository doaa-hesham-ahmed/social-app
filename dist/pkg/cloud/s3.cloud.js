"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3CloudProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_s3_2 = require("@aws-sdk/client-s3");
class S3CloudProvider {
    //encaspulations
    client;
    bucketName;
    constructor(config) {
        this.client = new client_s3_1.S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey,
            }
        });
        this.bucketName = config.bucketName;
    }
    async uploadFile(file, path) {
        const command = new client_s3_2.PutObjectCommand({
            Bucket: this.bucketName,
            Body: file.buffer,
            ContentType: file.mimetype,
            Key: `${path} /${new Date().toISOString()} - ${file.originalname}`,
        });
        await this.client.send(command);
        return command.input.Key;
    }
    async deleteFile(key) {
        const command = new client_s3_2.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.client.send(command);
    }
    async getFile(key) {
        // const command = new GetObjectCommand({
        //     Bucket:this.bucketName,
        //     Key:key,
        // })
        // await this.client.send(command);
        return Promise.resolve(new Buffer("88"));
    }
}
exports.S3CloudProvider = S3CloudProvider;
