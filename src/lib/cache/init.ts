import { RedisCachProvider } from "../../pkg/cache/redis";
import { env } from "../config/env";
export const cacheProvider = new RedisCachProvider({
     host:env.redis.host,
     port:env.redis.port,
     password:env.redis.password || '',
})