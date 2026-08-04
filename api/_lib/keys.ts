// This Redis database is shared with other projects (e.g. the
// timebucks-prelander "time" project), which uses its own unprefixed
// "go:*" keys for the same /go/:slug tracking pattern. Namespace every
// key this project writes so the two projects' click data never mixes.
const NS = "miranda:go";
const QUIZ_NS = "miranda:quiz";
const HS_NS = "miranda:hs";

export const keys = {
  // One record per person, keyed by lowercased email -- overwritten on
  // every quiz completion or resend, so it always reflects current state
  // (including whether the recipe email was sent). This is what the
  // admin leads manager reads and writes.
  quizLeadsByEmail: `${QUIZ_NS}:leads:byEmail`,
  // Total quiz completions, all-time (counts repeats; a running total for
  // the dashboard tile, not a count of unique people).
  quizLeadCount: `${QUIZ_NS}:leads:count`,
  // Real count of quiz completions per UTC day ("teas made today").
  // Incremented once per completion; the key expires after ~2 days.
  quizMadeDay: (day: string) => `${QUIZ_NS}:made:${day}`,

  // Home-services lead-gen funnel. Unlike the tea quiz (where the payday
  // is a downstream purchase we never see), here the submitted form IS
  // the conversion -- so these are stored separately and surfaced with
  // their own live counters.
  hsLeads: `${HS_NS}:leads`,
  hsLeadCount: `${HS_NS}:leads:count`,
  hsLeadsDay: (day: string) => `${HS_NS}:leads:day:${day}`,
  // Quiz completions per UTC day -- incremented when someone finishes
  // the questions, which is what the on-page "N people checked theirs
  // today" line actually reports. Kept distinct from hsLeadsDay (form
  // submissions) so the number shown is never a different metric than
  // the words next to it.
  hsCompletedDay: (day: string) => `${HS_NS}:completed:day:${day}`,
  // Qualified vs disqualified split, per UTC day. A renter or a
  // "not interested" answer still finishes the quiz, but must never be
  // submitted to a lead buyer -- selling those gets an affiliate account
  // shut down faster than anything else in this business.
  hsQualifiedDay: (day: string) => `${HS_NS}:qualified:day:${day}`,

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
