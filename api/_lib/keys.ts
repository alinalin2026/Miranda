// This Redis database is shared with other projects (e.g. the
// timebucks-prelander "time" project), which uses its own unprefixed
// "go:*" keys for the same /go/:slug tracking pattern. Namespace every
// key this project writes so the two projects' click data never mixes.
const NS = "miranda:go";

export const keys = {
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
};
