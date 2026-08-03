// Maps a product's review-page slug to the single real (affiliate)
// destination its /review/<product>/buy endpoint redirects to (with the
// promoter slug appended as a tracking param -- see subidParamByProduct
// and middleware.ts). Keeping this server-side means the raw affiliate/
// tracking URL never ships in the client JS bundle, and swapping an
// offer link doesn't require a client rebuild.
export const destinations: Record<string, string> = {
  "vanotium-cutting-board":
    "https://afflat3d2.com/trk/lnk/8613E3A5-B445-46B2-BA81-CD563CDBA746/?o=32482&c=918277&a=798445&k=3E4BD68C2D6D53166E9E824DFEE5E678&l=38251",
  "mellaramax-pillow":
    "https://afflat3d3.com/trk/lnk/8613E3A5-B445-46B2-BA81-CD563CDBA746/?o=32483&c=918277&a=798445&k=2DDB66231407BE428A6D7BA862057E76&l=38250",
  "all-day-slimming-tea": "https://hop.clickbank.net/?affiliate=honest2026&vendor=allslimtea&op=vsl26",
};

// Most networks accept an arbitrary `subid` passthrough param, but
// ClickBank hoplinks use `tid` (max 24 chars) for the same purpose.
// Products not listed here default to "subid" in appendSubid() below.
export const subidParamByProduct: Record<string, string> = {
  "all-day-slimming-tea": "tid",
};

// Per-country overrides, checked before falling back to `destinations`
// above. `x-vercel-ip-country` supplies the visitor's country (see
// middleware.ts); a product with no entry here, or a country with no
// entry under it, just uses the product's default destination.
export const destinationOverridesByCountry: Record<string, Record<string, string>> = {
  "vanotium-cutting-board": {
    US: "https://afflat3d3.com/trk/lnk/8613E3A5-B445-46B2-BA81-CD563CDBA746/?o=32631&c=918277&a=798445&k=9E89AA3945091FB13A8CE82CAD4A9499&l=38452",
  },
};
