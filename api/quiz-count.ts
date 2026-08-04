import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

// Real "teas made today" counter. POST increments today's count (called
// once when a visitor completes the quiz) and returns the new value, so
// the result screen can honestly say "yours is tea #N made today". GET
// returns the current count without incrementing.

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

const DAY_KEY_TTL_SECONDS = 60 * 60 * 50; // ~2 days, outlives the UTC day it counts

export default async function handler(request: Request) {
  try {
    const redis = getRedis();
    const key = keys.quizMadeDay(todayUTC());

    if (request.method === "POST") {
      const today = await redis.incr(key);
      if (today === 1) {
        await redis.expire(key, DAY_KEY_TTL_SECONDS);
      }
      return new Response(JSON.stringify({ today }), {
        headers: { "content-type": "application/json" },
      });
    }

    const today = await redis.get<number>(key);
    return new Response(JSON.stringify({ today: today ?? 0 }), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (err) {
    console.error("quiz-count failed", err);
    return new Response(JSON.stringify({ today: null }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
