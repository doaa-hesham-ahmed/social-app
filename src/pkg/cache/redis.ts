import Redis from "ioredis"
import {ICachProvider} from "./cach.interface";

interface IRedisConfig {
    host:string,
    port:number,
    password:string,
}

export class RedisCachProvider implements ICachProvider{
     private client :Redis;

    constructor(config:IRedisConfig){
        this.client = new Redis({
         host:config.host,
         port:config.port,//port:6379
         password:config.password,
         lazyConnect:true,
         maxLoadingRetryTime:3,
        })

        this.client.on('error',(err:Error) => console.log("Redis Server Error:",err.message));
        this.client.connect().catch((err:Error) => console.log("fail to connect to Redis",err.message))
    }
    async set(key:string,value:string,ttl:number){
        return this.client.set(key,value,'EX',ttl)
    }
    async get(key:string){
        return this.client.get(key)
    }
    async del(key:string){
        return this.client.del(key)
    }
    async ttl(key:string){
        return this.client.ttl(key)
    }
}