// This Redis database is shared with other projects (e.g. the
// timebucks-prelander "time" project), which uses its own unprefixed
// "go:*" keys for the same /go/:slug tracking pattern. Namespace every
// key this project writes so the two projects' click data never mixes.
const NS = "miranda:go";
const QUIZ_NS = "miranda:quiz";

export const keys = {
  // Capped log of quiz email captures, newest first.
  quizLeads: `${QUIZ_NS}:leads`,
  // Total quiz emails captured, all-time (the list above is capped).
  quizLeadCount: `${QUIZ_NS}:leads:count`,
  // Real count of quiz completions per UTC day ("teas made today").
  // Incremented once per completion; the key expires after ~2 days.
  quizMadeDay: (day: string) => `${QUIZ_NS}:made:${day}`,

  // Per (product, promoter-slug) click count. Any slug value works without
  // pre-registration -- it's just a Redis key, created on first use.
  hits: (product: string, slug: string) => `${NS}:hits:${product}:${slug}`,
  // Total clicks for a product across every promoter slug.
  productTotal: (product: string) => `${NS}:hits:${product}:total`,
  // Grand total across every product.
  grandTotal: `${NS}:hits:total`,
  // Set of every product slug seen at least once.
  products: `${NS}:products`,
  // Set of every promoter slug seen at least once for a given product.
  slugsFor: (product: string) => `${NS}:slugs:${product}`,
  // Capped recent-activity log shared across all products.
  log: `${NS}:log`,
  // Short-lived dedup marker per (product, slug, ip) -- caps rapid repeat
  // hits (script loops, retries, prefetching) from inflating the count
  // even when the User-Agent looks like a normal browser.
  dedup: (product: string, slug: string, ip: string) => `${NS}:dedup:${product}:${slug}:${ip}`,
};
