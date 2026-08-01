import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

export default async function handler(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  const body = await request.json().catch(() => null);
  const product = typeof body?.product === "string" ? body.product : null;
  const slug = typeof body?.slug === "string" ? body.slug : null; // omitted = reset the whole product

  if (!product) {
    return new Response(JSON.stringify({ error: "Missing product" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const redis = getRedis();

    if (slug) {
      // Reset a single promoter slug's count, backing it out of the
      // product/grand totals rather than just deleting the key so those
      // totals stay accurate.
      const count = (await redis.get<number>(keys.hits(product, slug))) ?? 0;
      await Promise.all([
        redis.del(keys.hits(product, slug)),
        redis.srem(keys.slugsFor(product), slug),
        redis.decrby(keys.productTotal(product), count),
        redis.decrby(keys.grandTotal, count),
      ]);
    } else {
      // Reset every slug under this product.
      const slugs = ((await redis.smembers(keys.slugsFor(product))) as string[]) || [];
      const total = (await redis.get<number>(keys.productTotal(product))) ?? 0;
      await Promise.all([
        ...slugs.map((s) => redis.del(keys.hits(product, s))),
        redis.del(keys.slugsFor(product)),
        redis.del(keys.productTotal(product)),
        redis.srem(keys.products, product),
        redis.decrby(keys.grandTotal, total),
      ]);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (err) {
    console.error("dashboard-reset failed", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Redis error: ${message}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
