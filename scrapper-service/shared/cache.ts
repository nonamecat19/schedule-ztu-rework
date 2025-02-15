import "dotenv/config"
import {createClient} from "redis";

const redis = await createClient({
    url: process.env.REDIS_URL,
}).connect();

type CacheKey = `${string}:${string}`;

export async function readCache(key: CacheKey) {
    try {
        return await redis.get(key);
    } catch (error) {
        console.error("Redis GET error:", error);
        return null;
    }
}


export async function setCache(key: CacheKey, value: unknown, ttl = 3600) {
    try {
        const stringValue = typeof value === "string" ? value : JSON.stringify(value);
        await redis.set(key, stringValue, {EX: ttl});
    } catch (error) {
        console.error("Redis SET error:", error);
    }
}