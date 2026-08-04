import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

interface LogEntry {
  ts: number;
  product: string;
  slug: string;
  country: string;
  referrer: string;
  userAgent?: string;
}

interface SlugRow {
  slug: string;
  hits: number;
}

interface ProductRow {
  product: string;
  total: number;
  slugs: SlugRow[];
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
    const products = ((await redis.smembers(keys.products)) as string[]) || [];

    const productRows: ProductRow[] = await Promise.all(
      products.map(async (product) => {
        const [total, slugList] = await Promise.all([
          redis.get<number>(keys.productTotal(product)),
          redis.smembers(keys.slugsFor(product)) as Promise<string[]>,
        ]);

        const slugs = await Promise.all(
          (slugList || []).map(async (slug) => {
            const hits = await redis.get<number>(keys.hits(product, slug));
            return { slug, hits: hits ?? 0 };
          }),
        );
        slugs.sort((a, b) => b.hits - a.hits);

        return { product, total: total ?? 0, slugs };
      }),
    );
    productRows.sort((a, b) => b.total - a.total);

    const today = new Date().toISOString().slice(0, 10);
    const [totalHits, rawLog, quizLeadCount, hsLeadCount, hsLeadsToday, hsQualifiedToday] =
      await Promise.all([
        redis.get<number>(keys.grandTotal),
        redis.lrange(keys.log, 0, 49),
        redis.get<number>(keys.quizLeadCount),
        redis.get<number>(keys.hsLeadCount),
        redis.get<number>(keys.hsLeadsDay(today)),
        redis.get<number>(keys.hsQualifiedDay(today)),
      ]);

    const recent = (rawLog as unknown[]).map(parseLogEntry).filter((entry): entry is LogEntry => entry !== null);

    return new Response(
      JSON.stringify({
        totalHits: totalHits ?? 0,
        products: productRows,
        recent,
        quizLeadCount: quizLeadCount ?? 0,
        hsLeadCount: hsLeadCount ?? 0,
        hsLeadsToday: hsLeadsToday ?? 0,
        hsQualifiedToday: hsQualifiedToday ?? 0,
      }),
      { headers: { "content-type": "application/json", "cache-control": "no-store" } },
    );
  } catch (err) {
    console.error("dashboard-data failed", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Redis error: ${message}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
