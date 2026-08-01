// Maps a /go/:slug to the real (affiliate) destination it should redirect to.
// Keeping this server-side means the raw affiliate/tracking URL never ships
// in the client JS bundle, and swapping an offer link doesn't require a
// client rebuild.
export const destinations: Record<string, string> = {
  vanotium:
    "https://afflat3d2.com/trk/lnk/8613E3A5-B445-46B2-BA81-CD563CDBA746/?o=32482&c=918277&a=798445&k=3E4BD68C2D6D53166E9E824DFEE5E678&l=38251",
};
