import { getRedis } from "./api/_lib/redis";
import { destinations } from "./api/_lib/destinations";
import { keys } from "./api/_lib/keys";
import { getCookie } from "./api/_lib/cookies";

// Edge Middleware runs before static files, functions, and vercel.json
// rewrites are even considered, so both paths below are guaranteed to be
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
//    click to the same promoter our dashboard shows.
export const config = {
  matcher: ["/review/:product/go/:slug", "/review/:product/buy"],
};

const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function trackClick(product: string, slug: string, request: Request) {
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
}

function appendSubid(destinationUrl: string, slug: string): string {
  const separator = destinationUrl.includes("?") ? "&" : "?";
  return `${destinationUrl}${separator}subid=${encodeURIComponent(slug)}`;
}

async function middleware(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
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
  const destinationUrl = destinations[product];
  const destination = destinationUrl ? appendSubid(destinationUrl, slug) : new URL("/", url.origin).toString();

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
