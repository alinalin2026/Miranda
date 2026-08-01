import { getRedis } from "./api/_lib/redis";
import { destinations } from "./api/_lib/destinations";
import { keys } from "./api/_lib/keys";

// Edge Middleware runs before static files, functions, and vercel.json
// rewrites are even considered, so /review/:product/go/:slug is guaranteed
// to be intercepted here rather than depending on rewrite-ordering to reach
// a nested function.
//
// URL shape: /review/<product-slug>/go/<promoter-slug>
// - <product-slug> matches the product's review page (e.g.
//   vanotium-cutting-board) and looks up the one real destination URL in
//   destinations.ts.
// - <promoter-slug> is whatever you hand out to a given promoter
//   (affiliateno1, affiliateno2, ...). It's never pre-registered anywhere --
//   any value just works and gets its own click count the first time it's
//   used.
export const config = {
  matcher: "/review/:product/go/:slug",
};

async function middleware(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  // ["review", "<product>", "go", "<slug>"]
  const product = decodeURIComponent(segments[1] || "unknown");
  const slug = decodeURIComponent(segments[3] || "unknown");
  const country = request.headers.get("x-vercel-ip-country") || "XX";
  const referrer = request.headers.get("referer") || "";

  try {
    const redis = getRedis();
    const entry = JSON.stringify({ ts: Date.now(), product, slug, country, referrer });

    await Promise.all([
      redis.incr(keys.hits(product, slug)),
      redis.incr(keys.productTotal(product)),
      redis.incr(keys.grandTotal),
      redis.sadd(keys.products, product),
      redis.sadd(keys.slugsFor(product), slug),
      redis.lpush(keys.log, entry),
      redis.ltrim(keys.log, 0, 499),
    ]);
  } catch (err) {
    // Don't block the redirect if Redis isn't reachable/configured - a
    // visitor should never get stuck because click tracking failed.
    console.error("go-link tracking failed", err);
  }

  const destination = destinations[product] || new URL("/", url.origin).toString();

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
