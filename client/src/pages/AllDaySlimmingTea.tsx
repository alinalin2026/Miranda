/**
 * All Day Slimming Tea — Affiliate Recipe Page
 * Authored by Miranda Rodríguez
 * Route: /review/all-day-slimming-tea
 *
 * Deliberately short: one photo, a short recipe-curiosity hook, one CTA.
 * Kept to the tea/recipe angle only — no weight-loss numbers or health
 * claims, since those are the kind of destination-page content that gets
 * ad accounts flagged/restricted.
 */

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Routed through /review/all-day-slimming-tea/buy (handled in
// middleware.ts) rather than linking the affiliate URL directly. That
// endpoint reads back whichever promoter slug brought this visitor in
// (via a cookie set by /go/<slug>, falling back to "onsite" for direct
// traffic) and forwards to the offer with that slug as &subid=, so the
// network's own reporting matches our dashboard.
const SHOP_URL = "/review/all-day-slimming-tea/buy";

export default function AllDaySlimmingTea() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <img
            src="/images/tea/result_tea.jpg"
            alt="Herbal iced tea with mint and lemon"
            className="w-full rounded-2xl shadow-lg"
          />

          <p className="text-primary font-semibold text-xs uppercase tracking-widest">
            Trending Recipe
          </p>

          <h1 className="text-3xl font-bold text-foreground leading-tight">
            The Iced Tea Recipe Everyone's Asking About
          </h1>

          <p className="text-foreground/70 text-base leading-relaxed">
            A simple herbal iced tea made with kitchen staples — mint, lemon, and apple
            cider vinegar. Naturally refreshing, and easy to make at home in a few minutes.
          </p>

          <a href={SHOP_URL} target="_blank" rel="nofollow sponsored" className="block">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-7 shadow-lg hover:shadow-xl transition-all"
            >
              Get The Recipe →
            </Button>
          </a>

          <p className="text-xs text-foreground/50 leading-relaxed">
            Sponsored content. We may earn a commission from purchases made through this
            link, at no extra cost to you.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
