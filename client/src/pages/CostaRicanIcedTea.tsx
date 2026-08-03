/**
 * Costa Rican-Style Iced Tea — Recipe Article
 * Authored by Miranda Rodríguez
 * Route: /recipes/costa-rican-iced-tea
 *
 * Standalone editorial content, written in Miranda's own voice. The only
 * outbound link on the page is the "All Day Slimming Tea" mention at the
 * very end, routed through /review/all-day-slimming-tea/go/recipe-article
 * so it still lands on that page's own compliant pre-lander first, rather
 * than jumping straight to the offer.
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CostaRicanIcedTea() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <article className="container max-w-2xl py-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            Recipes &amp; Wellness
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-8">
            I Tried The Costa Rican Iced Tea Recipe Everyone's Sharing —
            Here's What I Thought
          </h1>

          {/* Bio intro */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
            <img
              src="/images/miranda-portrait.jpg"
              alt="Miranda Rodríguez"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <p className="text-foreground/70 text-lg leading-relaxed">
              Hi, I'm Miranda — 40, based in Austin, and a bit of a tea person. I've been
              collecting recipes like this one for years, mostly because I got tired of
              choosing between plain water and another cup of coffee every afternoon.
            </p>
          </div>

          <img
            src="/images/tea/hero_iced_tea.jpg"
            alt="Herbal iced tea with mint and lemon"
            className="w-full rounded-2xl shadow-lg mb-8"
          />

          <div className="space-y-6 text-foreground/80 text-xl leading-relaxed">
            <p>
              A few weeks ago, a version of this recipe kept showing up in my feed — mint,
              lemon, and a splash of apple cider vinegar, brewed into a simple iced tea. It's
              apparently a home-kitchen staple in parts of Costa Rica, passed around more as a
              refreshing afternoon habit than anything fancy. I was curious enough to actually
              make it, so I did — for about a week, most afternoons.
            </p>

            <p>
              I'll say upfront: this is not a miracle drink, and I'm not going to pretend it is.
              It's an herbal iced tea. What I can say honestly is that it's genuinely pleasant,
              easy to make with things most people already have in the kitchen, and it became a
              nice ritual to have around 3pm instead of reaching for another coffee.
            </p>

            <img
              src="/images/tea/glass_closeup.jpg"
              alt="Close-up of iced tea with mint and lemon"
              className="w-full rounded-2xl shadow-lg my-8"
            />

            <h2 className="text-3xl font-bold text-foreground pt-4">The Recipe</h2>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-xl">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/80">
                  <li>1 cup brewed black or green tea, cooled</li>
                  <li>1 tbsp apple cider vinegar</li>
                  <li>Juice of half a lemon</li>
                  <li>A small handful of fresh mint leaves</li>
                  <li>Ice</li>
                  <li>Optional: a pinch of baking soda to soften the tartness</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-xl">Steps</h3>
                <ol className="list-decimal list-inside space-y-1 text-foreground/80">
                  <li>Brew the tea and let it cool to room temperature.</li>
                  <li>Stir in the apple cider vinegar and lemon juice.</li>
                  <li>Bruise the mint leaves lightly between your fingers and drop them in.</li>
                  <li>Pour over ice and let it sit a few minutes so the mint infuses.</li>
                  <li>Taste — add the pinch of baking soda if it's too sharp for you.</li>
                </ol>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground pt-4">A Few Honest Notes</h2>

            <p>
              Apple cider vinegar and mint have both been kitchen staples for a very long time —
              mint shows up constantly in recipes meant to be refreshing or easy on the stomach
              after a meal, and apple cider vinegar has a long history as a pantry ingredient
              people add to drinks and dressings for its tang. None of that makes this tea a
              treatment for anything, and I'm not suggesting it is — I just think it's a genuinely
              nice-tasting way to drink more water in the afternoon, which is a perfectly good
              reason on its own.
            </p>

            <p>
              If you have any health conditions, are pregnant or nursing, or take medication,
              it's worth checking with a doctor before making vinegar a daily habit — it's acidic,
              and that's worth being mindful of, same as with citrus.
            </p>

            <h2 className="text-3xl font-bold text-foreground pt-4">
              If You'd Rather Try a Ready-Made Blend
            </h2>

            <p>
              I like mixing my own, but I know not everyone wants to keep apple cider vinegar
              and fresh mint on hand all week. A few readers asked what I'd recommend instead,
              so here's what's actually in my own pantry rotation:
            </p>

            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>
                <span className="font-semibold text-foreground">Traditional Medicinals</span> —
                a longtime favorite, easy to find at most grocery stores.
              </li>
              <li>
                <span className="font-semibold text-foreground">Yogi Tea</span> — another
                staple of mine, known for their wide range of herbal combinations.
              </li>
              <li>
                <span className="font-semibold text-foreground">All Day Slimming Tea</span> —
                a pre-made herbal blend a few of you asked about after I mentioned trying it;
                it's a reasonable option if you'd rather skip the mixing altogether.{" "}
                <a
                  href="/review/all-day-slimming-tea/go/recipe-article"
                  className="text-primary font-medium underline hover:no-underline"
                >
                  Take a look here
                </a>
                .
              </li>
            </ul>

            <p>
              If you try the homemade version, I'd genuinely love to hear how yours turns out —
              and what you tweak to make it your own.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
