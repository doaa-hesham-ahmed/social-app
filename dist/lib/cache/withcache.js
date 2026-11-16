"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCache = withCache;
const init_1 = require("./init");
function withCache(ttl = 3600) {
    return async (req, res, next) => {
        let key = `${req.method}:${req.originalUrl}`;
        //check cache  
        const cached = await init_1.cacheProvider.get(key);
        //if yes ->get from cache
        if (cached) {
            res.setHeader('X-cache', 'HIT');
            return res.json(JSON.parse(cached));
        }
        //if NO ->get from DB
        const originalJSON = res.json.bind(res);
        res.json = ((body) => {
            init_1.cacheProvider.set(key, JSON.stringify(body), ttl);
            if (res.statusCode >= 200 && res.statusCode < 300) {
                init_1.cacheProvider.set(key, JSON.stringify(body), ttl);
                res.setHeader("X-Cache", "MISS");
            }
            return originalJSON(body);
        });
        //cahed + res
        next();
    };
}
