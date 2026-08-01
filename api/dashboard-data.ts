import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

interface LogEntry {
  ts: number;
  slug: string;
  country: string;
  referrer: string;
}

function parseLogEntry(raw: unknown): LogEntry | null {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as LogEntry;
    } catch {
      return null;
    }
  }
  if (raw && typeof raw === "object") {
    return raw as LogEntry;
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
    const slugs = ((await redis.smembers(keys.slugs)) as string[]) || [];

    const rows = await Promise.all(
      slugs.map(async (slug) => {
        const hits = await redis.get<number>(keys.hits(slug));
        return { slug, hits: hits ?? 0 };
      }),
    );
    rows.sort((a, b) => b.hits - a.hits);

    const [totalHits, rawLog] = await Promise.all([redis.get<number>(keys.hitsTotal), redis.lrange(keys.log, 0, 49)]);

    const recent = (rawLog as unknown[]).map(parseLogEntry).filter((entry): entry is LogEntry => entry !== null);

    return new Response(JSON.stringify({ totalHits: totalHits ?? 0, rows, recent }), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (err) {
    console.error("dashboard-data failed", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Redis error: ${message}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
