import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

export interface LeadRecord {
  ts: number;
  email: string;
  name?: string;
  memory?: string;
  answers: Record<string, string>;
  result: string;
  source: string;
  emailSent: boolean;
  emailSentAt: number | null;
  emailError?: string | null;
}

function parseLead(raw: unknown): LeadRecord | null {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as LeadRecord;
    } catch {
      return null;
    }
  }
  if (raw && typeof raw === "object") {
    return raw as LeadRecord;
  }
  return null;
}

export default async function handler(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const redis = getRedis();
    const raw = (await redis.hgetall(keys.quizLeadsByEmail)) as Record<string, unknown> | null;
    const leads = Object.values(raw ?? {})
      .map(parseLead)
      .filter((l): l is LeadRecord => l !== null)
      .sort((a, b) => b.ts - a.ts);

    return new Response(JSON.stringify({ leads }), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (err) {
    console.error("leads failed", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Redis error: ${message}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
