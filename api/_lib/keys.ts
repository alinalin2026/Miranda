// This Redis database is shared with other projects (e.g. the
// timebucks-prelander "time" project), which uses its own unprefixed
// "go:*" keys for the same /go/:slug tracking pattern. Namespace every
// key this project writes so the two projects' click data never mixes.
const NS = "miranda:go";

export const keys = {
  hits: (slug: string) => `${NS}:hits:${slug}`,
  hitsTotal: `${NS}:hits:total`,
  slugs: `${NS}:slugs`,
  log: `${NS}:log`,
};
