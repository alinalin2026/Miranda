import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  let body: { email?: string; answers?: Record<string, string>; result?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const redis = getRedis();
    const entry = JSON.stringify({
      ts: Date.now(),
      email,
      answers: body.answers ?? {},
      result: body.result ?? "",
      source: body.source ?? "quiz",
    });

    await Promise.all([redis.lpush(keys.quizLeads, entry), redis.ltrim(keys.quizLeads, 0, 999), redis.incr(keys.quizLeadCount)]);

    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
  } catch (err) {
    console.error("quiz-lead failed", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Redis error: ${message}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
