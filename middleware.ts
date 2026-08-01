import { getRedis } from "./api/_lib/redis";
import { destinations } from "./api/_lib/destinations";

// Edge Middleware runs before static files, functions, and vercel.json
// rewrites are even considered, so /go/:slug is guaranteed to be intercepted
// here rather than depending on rewrite-ordering to reach a nested function.
export const config = {
  matcher: "/go/:slug",
};

async function middleware(request: Request) {
  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || "unknown");
  const country = request.headers.get("x-vercel-ip-country") || "XX";
  const referrer = request.headers.get("referer") || "";

  try {
    const redis = getRedis();
    const entry = JSON.stringify({ ts: Date.now(), slug, country, referrer });

    await Promise.all([
      redis.incr(`go:hits:${slug}`),
      redis.incr("go:hits:total"),
      redis.sadd("go:slugs", slug),
      redis.lpush("go:log", entry),
      redis.ltrim("go:log", 0, 499),
    ]);
  } catch (err) {
    // Don't block the redirect if Redis isn't reachable/configured - a
    // visitor should never get stuck because click tracking failed.
    console.error("go-link tracking failed", err);
  }

  const destination = destinations[slug] || new URL("/", url.origin).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      "Cache-Control": "no-store",
    },
  });
}

// Vercel's standalone (non-Next.js) Edge Middleware convention expects a
// default export, but exporting both here removes any doubt.
export default middleware;
export { middleware };
