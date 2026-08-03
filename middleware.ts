import { getRedis } from "./api/_lib/redis";
import { destinations, destinationOverridesByCountry, subidParamByProduct } from "./api/_lib/destinations";
import { keys } from "./api/_lib/keys";
import { getCookie } from "./api/_lib/cookies";
import { isLikelyBot } from "./api/_lib/bots";

// Edge Middleware runs before static files, functions, and vercel.json
// rewrites are even considered, so all paths below are guaranteed to be
// intercepted here rather than depending on rewrite-ordering to reach a
// nested function.
//
// Two-step funnel:
//
// 1. /review/<product-slug>/go/<promoter-slug> -- the link you hand out to a
//    promoter. Logs the click, remembers the promoter slug in a cookie, and
//    redirects to the review page itself (/review/<product-slug>) so the
//    visitor reads the article before buying. <promoter-slug> is never
//    pre-registered -- any value just works and gets its own click count.
//
// 2. /review/<product-slug>/buy -- the on-page "Shop"/"Buy" button. Reads
//    the promoter slug back out of the cookie (falling back to "onsite" if
//    the visitor arrived directly, with no cookie), and redirects to the
//    product's real destination URL with that slug appended as MaxBounty's
//    &subid= parameter, so MaxBounty's own reporting can attribute the
//    click to the same promoter our dashboard shows. The destination itself
//    can vary by visitor country -- see destinationOverridesByCountry in
//    api/_lib/destinations.ts (e.g. US traffic on the cutting board gets a
//    separate US-specific offer link).
//
// Standalone shortcuts, not tied to any review page -- each redirects
// straight to a product's destination (no landing page in between),
// tracked under a slug matching its own path name (e.g. &subid=order),
// same as the two-step flow above.
//
// 3. /order -- Vanotium cutting board
// 4. /shop  -- MellaraMax pillow
// 5. /tea   -- All Day Slimming Tea
export const config = {
  matcher: ["/review/:product/go/:slug", "/review/:product/buy", "/order", "/shop", "/tea"],
};

const SHORTCUTS: Record<string, string> = {
  order: "vanotium-cutting-board",
  shop: "mellaramax-pillow",
  tea: "all-day-slimming-tea",
};

const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const DEDUP_WINDOW_SECONDS = 10;

async function trackClick(product: string, slug: string, request: Request) {
  const country = request.headers.get("x-vercel-ip-country") || "XX";
  const referrer = request.headers.get("referer") || "";
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  // Known bots/crawlers/link-preview fetchers hit this URL over plain HTTP
  // without ever running JS, so they'd never show up in an analytics tool
  // that relies on client-side JS -- but they would inflate this count
  // unless filtered out here. Still redirect them below; just don't count
  // or log the hit.
  if (isLikelyBot(userAgent)) return;

  try {
    const redis = getRedis();

    // Second line of defense against a script that spoofs a normal-looking
    // User-Agent: collapse repeat hits from the same (product, slug, ip)
    // within a short window down to a single count. SET NX only succeeds
    // the first time; a real person re-clicking within 10s of their own
    // last click is not a meaningfully different "click" anyway.
    const firstInWindow = await redis.set(keys.dedup(product, slug, ip), 1, { nx: true, ex: DEDUP_WINDOW_SECONDS });
    if (!firstInWindow) return;

    const entry = JSON.stringify({ ts: Date.now(), product, slug, country, referrer, userAgent });

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
}

function appendSubid(destinationUrl: string, slug: string, product: string): string {
  const paramName = subidParamByProduct[product] ?? "subid";
  const separator = destinationUrl.includes("?") ? "&" : "?";
  return `${destinationUrl}${separator}${paramName}=${encodeURIComponent(slug)}`;
}

function resolveDestination(product: string, country: string): string | undefined {
  return destinationOverridesByCountry[product]?.[country] ?? destinations[product];
}

async function middleware(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);

  const shortcutProduct = segments.length === 1 ? SHORTCUTS[segments[0]] : undefined;
  if (shortcutProduct) {
    const slug = segments[0];
    await trackClick(shortcutProduct, slug, request);

    const country = request.headers.get("x-vercel-ip-country") || "XX";
    const destinationUrl = resolveDestination(shortcutProduct, country);
    const destination = destinationUrl ? appendSubid(destinationUrl, slug, shortcutProduct) : new URL("/", url.origin).toString();

    return new Response(null, {
      status: 302,
      headers: {
        Location: destination,
        "Cache-Control": "no-store",
      },
    });
  }

  const product = decodeURIComponent(segments[1] || "unknown");
  const refCookieName = `mr_ref_${product}`;

  if (segments[2] === "go") {
    // ["review", "<product>", "go", "<slug>"]
    const slug = decodeURIComponent(segments[3] || "unknown");
    await trackClick(product, slug, request);

    const dest = new URL(`/review/${product}`, url.origin);
    return new Response(null, {
      status: 302,
      headers: {
        Location: dest.toString(),
        "Set-Cookie": `${refCookieName}=${encodeURIComponent(slug)}; Path=/; Max-Age=${REF_COOKIE_MAX_AGE}; SameSite=Lax; Secure`,
        "Cache-Control": "no-store",
      },
    });
  }

  // ["review", "<product>", "buy"]
  const slug = getCookie(request, refCookieName) || "onsite";
  const country = request.headers.get("x-vercel-ip-country") || "XX";
  const destinationUrl = resolveDestination(product, country);
  const destination = destinationUrl ? appendSubid(destinationUrl, slug, product) : new URL("/", url.origin).toString();

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
