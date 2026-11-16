"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCachProvider = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisCachProvider {
    client;
    constructor(config) {
        this.client = new ioredis_1.default({
            host: config.host,
            port: config.port, //port:6379
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3,
        });
        this.client.on('error', (err) => console.log("Redis Server Error:", err.message));
        this.client.connect().catch((err) => console.log("fail to connect to Redis", err.message));
    }
    async set(key, value, ttl) {
        return this.client.set(key, value, 'EX', ttl);
    }
    async get(key) {
        return this.client.get(key);
    }
    async del(key) {
        return this.client.del(key);
    }
    async ttl(key) {
        return this.client.ttl(key);
    }
}
exports.RedisCachProvider = RedisCachProvider;
