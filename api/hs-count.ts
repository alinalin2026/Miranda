import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

// Real "people checked theirs today" counter for the gutter funnel.
//
// POST increments (fired once when a visitor finishes the questions) and
// returns the new value, so the number the page shows always includes
// the person reading it and is never below 1. GET reads without
// incrementing.
//
// This counts quiz COMPLETIONS, which is exactly what the on-page copy
// claims -- deliberately not the same key as submitted leads, so the
// number can never quietly drift into meaning something other than what
// the sentence next to it says.

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

const DAY_KEY_TTL_SECONDS = 60 * 60 * 50; // ~2 days, outlives the UTC day it counts

export default async function handler(request: Request) {
  try {
    const redis = getRedis();
    const key = keys.hsCompletedDay(todayUTC());

    if (request.method === "POST") {
      const today = await redis.incr(key);
      if (today === 1) await redis.expire(key, DAY_KEY_TTL_SECONDS);
      return new Response(JSON.stringify({ today }), {
        headers: { "content-type": "application/json" },
      });
    }

    const today = await redis.get<number>(key);
    return new Response(JSON.stringify({ today: today ?? 0 }), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (err) {
    console.error("hs-count failed", err);
    return new Response(JSON.stringify({ today: null }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
