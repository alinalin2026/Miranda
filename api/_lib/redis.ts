import { Redis } from "@upstash/redis";

let client: Redis | null = null;

// Lazy singleton: only throws when an endpoint actually tries to use Redis,
// not at module load, so the rest of the app keeps working without it configured.
export function getRedis(): Redis {
  if (client) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Redis environment variables (UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN)",
    );
  }

  client = new Redis({ url, token });
  return client;
}
