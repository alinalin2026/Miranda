// Maps a product's review-page slug to the single real (affiliate)
// destination its /review/<product>/buy endpoint redirects to (with
// &subid=<promoter-slug> appended, see middleware.ts). Keeping this
// server-side means the raw affiliate/tracking URL never ships in the
// client JS bundle, and swapping an offer link doesn't require a client
// rebuild.
export const destinations: Record<string, string> = {
  "vanotium-cutting-board":
    "https://afflat3d2.com/trk/lnk/8613E3A5-B445-46B2-BA81-CD563CDBA746/?o=32482&c=918277&a=798445&k=3E4BD68C2D6D53166E9E824DFEE5E678&l=38251",
  "mellaramax-pillow":
    "https://afflat3d3.com/trk/lnk/8613E3A5-B445-46B2-BA81-CD563CDBA746/?o=32483&c=918277&a=798445&k=2DDB66231407BE428A6D7BA862057E76&l=38250",
};
