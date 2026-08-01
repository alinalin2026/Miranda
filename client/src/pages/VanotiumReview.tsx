/**
 * Vanotium Titanium Cutting Board — Affiliate Review Page
 * Authored by Miranda Rodríguez
 * Route: /review/vanotium-cutting-board
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Check, X, ChevronDown, Shield, Droplets, Zap, Scissors } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

// Routed through /review/vanotium-cutting-board/go/<slug> (tracked in Redis,
// see middleware.ts) rather than linking the affiliate URL directly, so
// clicks are counted and the destination can change without a client
// rebuild. "onsite" identifies traffic from these on-page buttons, as
// opposed to a promoter-specific slug handed out separately (e.g.
// /review/vanotium-cutting-board/go/affiliateno1).
const SHOP_URL = "/review/vanotium-cutting-board/go/onsite";

const comparisonRows = [
  {
    label: "Microplastic Risk",
    vanotium: { text: "Zero — no plastic surface", good: true },
    wood: { text: "Low — wood fibers possible", good: null },
    plastic: { text: "High — sheds with every cut", good: false },
  },
  {
    label: "Bacteria Retention",
    vanotium: { text: "Non-porous — nowhere to hide", good: true },
    wood: { text: "Trapped in grain", good: false },
    plastic: { text: "Trapped in knife scratches", good: false },
  },
  {
    label: "Odor Absorption",
    vanotium: { text: "None — rinses clean instantly", good: true },
    wood: { text: "Absorbs garlic, fish, meat", good: false },
    plastic: { text: "Moderate retention", good: null },
  },
  {
    label: "Knife-Friendliness",
    vanotium: { text: "Gentle on blades", good: true },
    wood: { text: "Gentle on blades", good: true },
    plastic: { text: "Moderate wear", good: null },
  },
  {
    label: "Lifespan",
    vanotium: { text: "10+ years", good: true },
    wood: { text: "2–5 years", good: null },
    plastic: { text: "1–3 years", good: false },
  },
  {
    label: "Dishwasher Safe",
    vanotium: { text: "Yes — fully safe", good: true },
    wood: { text: "No — warps and cracks", good: false },
    plastic: { text: "Technically, but degrades faster", good: null },
  },
];

const pros = [
  "Completely non-porous — bacteria and mold have nowhere to live",
  "Zero microplastic shedding — no plastic surface to degrade",
  "Cleans in 10 seconds — fully dishwasher safe",
  "Zero knife grooves after 60 days of daily use",
  "No odor absorption — garlic and fish rinse straight off",
  "Built to last 10+ years — a genuine buy-it-once product",
];

const cons = [
  "Premium price point — though the 70% off deal makes it very accessible",
  "Requires proper knife technique — don't drag the blade sideways",
  "Heavier than a plastic board — noticeable but not a dealbreaker",
];

const faqs = [
  {
    q: "Is the Vanotium board dishwasher safe?",
    a: "Yes — fully and without caveats. Unlike wood boards that warp or plastic boards that degrade, the titanium composite is completely unaffected by high heat and detergent. I've run mine through 30+ cycles and it looks identical to day one. You can also just rinse it under the tap for 10 seconds.",
  },
  {
    q: "Will it dull my knives?",
    a: "No. Vanotium's titanium composite is specifically engineered to be knife-friendly — it's not glass, not ceramic, and not a hard metal surface. After 60 days of daily use with my 8-inch chef's knife, I noticed zero change in sharpness. Use proper technique and you'll have no issues.",
  },
  {
    q: "How long does it actually last?",
    a: "Based on the surface integrity after 60 days of hard daily use, I genuinely believe the 10+ year claim. The titanium composite doesn't warp, crack, or develop the deep knife grooves that make plastic boards unsanitary over time. This is a buy-it-once product.",
  },
  {
    q: "Does it really produce zero microplastics?",
    a: "Yes. Microplastic shedding from plastic boards is a genuine concern — particles shed with every knife stroke directly into your food. Because Vanotium's surface is titanium composite and not plastic, there is no plastic material to shed. This was the single biggest reason I switched.",
  },
  {
    q: "Is there a return policy?",
    a: "Vanotium offers a 30-day risk-free guarantee. Try it and if you don't love it, return it for a full refund — no questions asked. Combined with the current 70% off deal, there's genuinely no risk in trying it.",
  },
  {
    q: "Is it safe for raw meat and fish?",
    a: "Absolutely — this is where it truly shines. The non-porous surface means bacteria from raw chicken, beef, or fish cannot penetrate and survive after washing. With wood, pathogens can survive in the grain for days. With Vanotium, a quick rinse is genuinely sufficient.",
  },
];

const sciencePoints = [
  {
    icon: <Droplets className="w-5 h-5" />,
    title: "Non-Porous — Nothing Gets In",
    text: "No microscopic pores for bacteria, mold, or parasites to colonize. The surface remains sealed at a molecular level even after years of daily use.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Zero Microplastic Shedding",
    text: "Because there's no plastic surface layer, there is nothing to shed. No particles. No contamination. This was the single biggest reason I switched.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "No Wood Fibers, No Organic Contamination",
    text: "No fibers, no grain, no organic material for pathogens to feed on. E. coli, Salmonella, and Listeria have nowhere to survive after a rinse.",
  },
  {
    icon: <Scissors className="w-5 h-5" />,
    title: "Knife-Friendly by Design",
    text: "Unlike glass or ceramic that destroy knife edges, Vanotium's surface is engineered to be gentle on blades. Your knives stay sharper, longer.",
  },
];

function RatingCell({ good }: { good: boolean | null }) {
  if (good === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
  if (good === false) return <X className="w-4 h-4 text-destructive mx-auto" />;
  return <span className="text-muted-foreground text-xs">~</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex items-center justify-between text-left py-5 gap-4 font-semibold text-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-foreground/70 leading-relaxed text-[0.9375rem]">{a}</p>
      )}
    </div>
  );
}

export default function VanotiumReview() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Disclosure */}
      <div className="bg-primary/10 border-l-4 border-primary px-6 py-3 text-sm text-foreground/70">
        <div className="max-w-6xl mx-auto">
          <strong className="text-foreground">Disclosure:</strong> This is a sponsored/affiliate review. I received the Vanotium board to test and may earn a commission on purchases through links on this page. All opinions are my own based on 60 days of real-world use.
        </div>
      </div>

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-16 pb-0">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-10" />

          <div className="container grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6 pb-16 animate-fade-in">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-primary font-semibold text-sm">Verified 60-Day Review</span>
              </div>

              <p className="text-primary font-semibold text-xs uppercase tracking-widest">
                Kitchen &amp; Hygiene
              </p>

              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                I Switched From Wood to{" "}
                <span className="text-primary italic block">Titanium</span>
              </h1>

              <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
                After 60 days of daily cooking — raw chicken, fish, garlic, everything — the Vanotium Titanium Cutting Board changed how I think about kitchen safety. No microplastics. No bacteria. No smell. Here's my honest verdict.
              </p>

              {/* Author byline */}
              <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 w-fit shadow-sm">
                <img
                  src="/images/vanotium/miranda_thumb.jpg"
                  alt="Miranda Rodríguez"
                  className="w-11 h-11 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">Miranda Rodríguez</p>
                  <p className="text-xs text-foreground/60">Lifestyle Expert · 15+ Years · 500K+ Readers</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href={SHOP_URL} target="_blank" rel="nofollow sponsored">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold hover:shadow-lg transition-all">
                    Shop Vanotium — Up to 70% Off
                  </Button>
                </a>
                <a href="#test">
                  <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold">
                    See My Results
                  </Button>
                </a>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-8 pt-6 border-t border-border">
                {[
                  { num: "500K+", label: "Readers" },
                  { num: "15+", label: "Years Expertise" },
                  { num: "200+", label: "Products Reviewed" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-foreground">{s.num}</p>
                    <p className="text-xs text-foreground/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative h-full min-h-[440px] flex items-end">
              <div className="relative rounded-t-2xl overflow-hidden shadow-2xl w-full">
                <img
                  src="/images/vanotium/hero_main.jpg"
                  alt="Miranda cutting fresh vegetables on the Vanotium Titanium Cutting Board"
                  className="w-full max-h-[560px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>
              {/* Floating verdict card */}
              <div className="absolute bottom-0 -left-4 bg-white rounded-xl shadow-xl p-5">
                <p className="text-xs font-semibold text-primary mb-1">Miranda's Verdict</p>
                <p className="text-4xl font-bold text-foreground leading-none">9.8</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xs text-foreground/60 mt-1">Highly Recommended</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAND ── */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-10">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "0", label: "Microplastics Shed" },
              { num: "10+", label: "Year Lifespan" },
              { num: "10 sec", label: "Cleanup Time" },
              { num: "70%", label: "Off Today" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</p>
                <p className="text-sm text-foreground/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE PROBLEM ── */}
        <section className="py-20 bg-white" id="problem">
          <div className="container">
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your Cutting Board May Be the Dirtiest Thing in Your Kitchen
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mb-12 leading-relaxed">
              Most people wash their cutting boards and assume they're clean. Whether you use wood or plastic, you're likely introducing hidden contaminants into every meal.
            </p>

            {/* Three problem cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  accent: "bg-amber-500",
                  cat: "Wood Boards",
                  catColor: "text-amber-600",
                  title: "Bacteria Lives in the Grain",
                  text: "Wood is porous by nature. Bacteria — including E. coli and Salmonella — seep into the grain and survive even after washing. Wood also absorbs odors from garlic, onion, and fish that never fully wash out.",
                },
                {
                  accent: "bg-blue-500",
                  cat: "Plastic Boards",
                  catColor: "text-blue-600",
                  title: "Microplastics in Every Meal",
                  text: "Research has raised serious concerns about plastic boards shedding microplastic particles directly into food during cutting — potentially hundreds of thousands of particles per use. Every knife stroke is invisible contamination.",
                },
                {
                  accent: "bg-primary",
                  cat: "Vanotium Titanium",
                  catColor: "text-primary",
                  title: "Non-Porous. Nothing In, Nothing Out.",
                  text: "Titanium composite is non-porous. No bacteria can hide because the surface doesn't create grooves. No plastic particles. No odor absorption. It solves all three problems simultaneously.",
                },
              ].map((card) => (
                <div key={card.title} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`h-1.5 ${card.accent}`} />
                  <div className="p-6 space-y-3">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${card.catColor}`}>{card.cat}</p>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick comparison table */}
            <div className="rounded-xl overflow-hidden border border-border shadow-md overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-foreground text-white">
                    <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wide font-semibold">Feature</th>
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold text-foreground/60">Wood</th>
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold text-foreground/60">Plastic</th>
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold bg-primary">Vanotium Titanium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 1 ? "bg-background" : "bg-white"}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{row.label}</td>
                      <td className="px-5 py-3.5 text-center text-foreground/60">
                        <div className="flex flex-col items-center gap-1">
                          <RatingCell good={row.wood.good} />
                          <span className="text-xs">{row.wood.text}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center text-foreground/60">
                        <div className="flex flex-col items-center gap-1">
                          <RatingCell good={row.plastic.good} />
                          <span className="text-xs">{row.plastic.text}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center bg-primary/5 font-semibold text-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <RatingCell good={row.vanotium.good} />
                          <span className="text-xs">{row.vanotium.text}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── MIRANDA'S TEST ── */}
        <section className="py-20" id="test">
          <div className="container">
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">My 60-Day Test</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              I Put It Through Everything. Here's What I Found.
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mb-12 leading-relaxed">
              I didn't just use it for salads. I tested it the way a real kitchen demands — raw chicken, fish, garlic, citrus, everything.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  img: "/images/vanotium/miranda_cutting_chicken.jpg",
                  alt: "Miranda cutting raw chicken on the Vanotium board",
                  step: "Day 1 — Raw Protein",
                  title: "The Raw Chicken Test",
                  text: "I cut raw chicken directly on the board, then wiped it with a damp cloth. No smell. No staining. No visible residue — because there are no grooves for anything to hide in. The non-porous surface simply doesn't give bacteria anywhere to live.",
                },
                {
                  img: "/images/vanotium/hero_main.jpg",
                  alt: "Miranda chopping fresh vegetables on the Vanotium board",
                  step: "Week 2 — Daily Prep",
                  title: "Two Weeks of Daily Use",
                  text: "Carrots, bell peppers, garlic, herbs — the daily routine. After two weeks of constant use, the surface looked exactly as it did on day one. No discoloration. No garlic smell the next morning. The titanium composite simply doesn't absorb anything.",
                },
                {
                  img: "/images/vanotium/miranda_rinsing.jpg",
                  alt: "Miranda rinsing the Vanotium board under the tap",
                  step: "Every Day — Cleanup",
                  title: "The 10-Second Rinse",
                  text: "After cutting raw chicken, I rinsed the board under cold water for ten seconds. That was it. Completely clean. No scrubbing, no soaking, no special soap. Water beads off the non-porous surface and carries everything with it.",
                },
                {
                  img: "/images/vanotium/board_surface_macro.jpg",
                  alt: "Vanotium board surface showing zero knife grooves after 60 days",
                  step: "Day 60 — Surface Check",
                  title: "Zero Grooves After 60 Days",
                  text: "After two months of daily use with my chef's knife, I inspected the surface under direct light. Not a single groove or scratch. My plastic board after the same period would be a web of deep cuts — each one a bacteria trap.",
                },
              ].map((card) => (
                <div key={card.title} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-6 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{card.step}</p>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict box — from ProductReview.tsx */}
            <div className="mt-10 bg-primary/10 border border-primary/20 rounded-xl p-6 max-w-2xl">
              <p className="text-sm font-semibold text-primary mb-1">Miranda's Verdict</p>
              <p className="text-lg font-semibold text-foreground">
                The most hygienic cutting board I've ever used — and the only one I'd recommend to anyone who cooks with raw protein regularly.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHY TITANIUM ── */}
        <section className="py-20 bg-gradient-to-b from-white to-primary/5" id="science">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">The Science</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Why Titanium Solves Both Problems
                </h2>
                <p className="text-foreground/70 leading-relaxed mb-8">
                  The core differentiator comes down to one word: <strong className="text-foreground">porosity</strong>. Wood is porous. Plastic is porous. Titanium composite is not — and that changes everything.
                </p>

                <div className="space-y-6">
                  {sciencePoints.map((pt) => (
                    <div key={pt.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        {pt.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">{pt.title}</p>
                        <p className="text-sm text-foreground/70 leading-relaxed">{pt.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/vanotium/board_surface_macro.jpg"
                  alt="Macro close-up of the Vanotium titanium surface — water beading, zero grooves"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FULL COMPARISON ── */}
        <section className="py-20 bg-white" id="comparison">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">Head-to-Head</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Vanotium vs. Wood vs. Plastic</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Here's how the Vanotium stacks up across the metrics that actually matter.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-border shadow-md overflow-x-auto mb-12">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-foreground">
                    <th className="text-left px-5 py-4 text-xs uppercase tracking-wide font-semibold text-white/80">Category</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide font-semibold bg-primary text-white">Vanotium Titanium</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide font-semibold text-white/60">Wood Board</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide font-semibold text-white/60">Plastic Board</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Hygiene & Safety", v: "Non-porous, antibacterial surface", w: "Bacteria survives in grain", p: "Bacteria + microplastic risk" },
                    { cat: "Microplastic Risk", v: "Zero — no plastic surface", w: "Low — wood fibers possible", p: "High — sheds with every cut" },
                    { cat: "Odor Resistance", v: "Excellent — nothing absorbs", w: "Poor — absorbs garlic, fish", p: "Moderate retention" },
                    { cat: "Durability", v: "10+ years, scratch-proof", w: "2–5 years, warps over time", p: "1–3 years, grooves quickly" },
                    { cat: "Knife-Friendliness", v: "Excellent — gentle on blades", w: "Good — soft surface", p: "Moderate" },
                    { cat: "Cleanup", v: "10-second rinse or dishwasher", w: "Hand scrub only, no dishwasher", p: "Dishwasher OK but degrades" },
                  ].map((row, i) => (
                    <tr key={row.cat} className={i % 2 === 1 ? "bg-background" : "bg-white"}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{row.cat}</td>
                      <td className="px-5 py-3.5 text-center bg-primary/5 font-semibold text-foreground text-sm">{row.v}</td>
                      <td className="px-5 py-3.5 text-center text-foreground/60 text-sm">{row.w}</td>
                      <td className="px-5 py-3.5 text-center text-foreground/60 text-sm">{row.p}</td>
                    </tr>
                  ))}
                  <tr className="bg-white border-t-2 border-border">
                    <td className="px-5 py-4 font-semibold text-foreground">Miranda's Rating</td>
                    <td className="px-5 py-4 text-center bg-primary/5">
                      <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < 2 ? "fill-muted text-muted-foreground" : "text-muted-foreground"} />)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < 1 ? "fill-muted text-muted-foreground" : "text-muted-foreground"} />)}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pros / Cons */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">What I Love</h3>
                <ul className="space-y-3">
                  {pros.map((pro) => (
                    <li key={pro} className="flex gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-xl font-bold text-destructive">Worth Knowing</h3>
                <ul className="space-y-3">
                  {cons.map((con) => (
                    <li key={con} className="flex gap-3">
                      <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FULL-BLEED IMAGE ── */}
        <div className="overflow-hidden h-[420px]">
          <img
            src="/images/vanotium/miranda_holding_board.jpg"
            alt="Miranda holding the Vanotium Titanium Cutting Board"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* ── QUOTE ── */}
        <section className="bg-foreground py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[20rem] font-serif text-white/[0.03] leading-none">"</span>
          </div>
          <blockquote className="relative z-10 font-serif text-2xl md:text-4xl italic text-white/90 max-w-3xl mx-auto leading-snug mb-8">
            "I've reviewed hundreds of kitchen products. The Vanotium is the first cutting board that made me feel like I was{" "}
            <em className="not-italic text-primary">actually protecting my family</em> — not just cooking for them."
          </blockquote>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <img
              src="/images/vanotium/miranda_thumb.jpg"
              alt="Miranda Rodríguez"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/50"
            />
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Miranda Rodríguez</p>
              <p className="text-white/50 text-xs">MirandaReviews.com · 60-Day Tested</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 bg-white" id="faq">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Your Questions, Answered</h2>
            </div>
            <div className="max-w-2xl mx-auto">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 bg-gradient-to-br from-background to-primary/5 text-center px-6">
          <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">My Final Verdict</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Ready to Cook Cleaner?</h2>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
            After 60 days of real-world testing, the Vanotium Titanium Cutting Board is the only board I'd recommend to anyone who cares about what goes into their food. No microplastics. No bacteria. No compromise.
          </p>
          <a href={SHOP_URL} target="_blank" rel="nofollow sponsored">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold text-base px-10 py-6 hover:shadow-lg transition-all">
              Shop Vanotium — Up to 70% Off Today
            </Button>
          </a>
          <p className="mt-4 text-sm text-foreground/50">30-Day Money-Back Guarantee · Free Returns · Secure Checkout</p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
