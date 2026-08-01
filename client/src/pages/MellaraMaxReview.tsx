/**
 * MellaraMax Butterfly Ergonomic Pillow — Affiliate Review Page
 * Authored by Miranda Rodríguez
 * Route: /review/mellaramax-pillow
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Check, X, ChevronDown, Target, Feather, Waves, Snowflake } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Routed through /review/mellaramax-pillow/buy (handled in middleware.ts)
// rather than linking the merchant URL directly. That endpoint reads back
// whichever promoter slug brought this visitor in (via a cookie set by
// /go/<slug>, falling back to "onsite" for direct traffic) and forwards to
// the merchant with that slug as &subid=, matching the dashboard.
const SHOP_URL = "/review/mellaramax-pillow/buy";

const comparisonRows = [
  {
    label: "Cervical Support",
    mellaramax: { text: "Precision butterfly contour", good: true },
    flat: { text: "None — neck bends all night", good: false },
    foam: { text: "Basic — no contour", good: null },
  },
  {
    label: "Heat Retention",
    mellaramax: { text: "Cool — open-cell airflow design", good: true },
    flat: { text: "Moderate", good: null },
    foam: { text: "High — traps body heat", good: false },
  },
  {
    label: "Shape Retention",
    mellaramax: { text: "Maintains form night after night", good: true },
    flat: { text: "Compresses overnight", good: false },
    foam: { text: "Loses shape within months", good: false },
  },
  {
    label: "Side Sleeper Support",
    mellaramax: { text: "Raised wings fill shoulder gap", good: true },
    flat: { text: "Forces neck into lateral bend", good: false },
    foam: { text: "Partial — no shoulder cutout", good: null },
  },
  {
    label: "Allergen Resistance",
    mellaramax: { text: "Non-allergenic materials", good: true },
    flat: { text: "Collects dust mites", good: false },
    foam: { text: "Moderate", good: null },
  },
  {
    label: "Lifespan",
    mellaramax: { text: "3+ years with proper care", good: true },
    flat: { text: "6–12 months", good: false },
    foam: { text: "1–2 years", good: null },
  },
];

const pros = [
  "Zero neck pain after 30 nights — my chronic morning stiffness is completely gone",
  "Butterfly contour supports every sleep position — back, side, and combination sleepers",
  "Cooling open-cell foam — I never wake up hot or sweaty anymore",
  "Holds its shape perfectly — no flattening or permanent indentations after 30 nights",
  "Arm numbness eliminated — the shoulder arch design solved my side-sleeping arm problem",
  "Non-allergenic materials — safe for sensitive sleepers and allergy sufferers",
];

const cons = [
  "Adjustment period of 2–3 nights — your body needs time to adapt to proper alignment",
  "Not ideal for strict stomach sleepers — the contour is designed for back and side positions",
  "Premium price point — though the current 70% off deal makes it genuinely accessible",
];

const faqs = [
  {
    q: "How long before I notice a difference?",
    a: "Many people notice a difference after the very first night — the butterfly contour immediately places your neck in a more neutral position. That said, your body may need 2–3 nights to fully adjust if you've been sleeping on a flat pillow for years. By the end of the first week, most users report significantly reduced morning stiffness. By week two, the difference is typically dramatic.",
  },
  {
    q: "Is it suitable for side sleepers?",
    a: "Absolutely — side sleepers are actually the primary beneficiary of the butterfly design. The raised support wings on either side fill the gap between your ear and shoulder, preventing the lateral neck bend that causes morning stiffness. The shoulder arch release area also reduces trapezius tension and eliminates the arm numbness that side sleepers commonly experience. As a side sleeper myself, this was the single biggest improvement I noticed.",
  },
  {
    q: "Will it stay cool all night?",
    a: "Yes — the open-cell foam construction allows continuous airflow through the pillow, preventing the heat buildup that makes traditional memory foam so uncomfortable. After 30 nights, I never once woke up feeling hot or sweaty. The cooling effect is genuine and consistent. That said, if you run very hot, pairing it with a cooling pillowcase will give you the best results.",
  },
  {
    q: "How long will it hold its shape?",
    a: "After 30 nights of nightly use, the pillow looks and feels identical to day one — no flattening, no permanent indentations. The high-density memory foam is specifically formulated to resist compression set. Based on the surface integrity I've observed, I believe the 3+ year lifespan claim is realistic. This is a genuine buy-it-once product compared to standard pillows that need replacing every 6–12 months.",
  },
  {
    q: "Is there a return policy?",
    a: "MellaraMax offers a 30-night satisfaction guarantee. If you don't love it, contact their team for a simple return and complete refund — no questions asked. Combined with the current 70% off promotion, there's genuinely no financial risk in trying it. I'd encourage anyone with chronic neck pain or poor sleep quality to give it a full two weeks before judging.",
  },
  {
    q: "Can it help with snoring?",
    a: "The MellaraMax's cervical alignment design can help reduce snoring caused by poor neck positioning — specifically the forward head flexion that narrows the airway when a pillow is too thick. By keeping the neck in a neutral position, the airway stays more open. My partner noticed I was snoring less within the first week. That said, snoring has multiple causes, and if you have suspected sleep apnea or persistent snoring, please consult a physician rather than relying solely on a pillow change.",
  },
];

const sciencePoints = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "Central Head Cradle",
    text: "The recessed center keeps your head in a neutral position, preventing the forward flexion that strains your neck when a pillow is too thick.",
  },
  {
    icon: <Feather className="w-5 h-5" />,
    title: "Raised Support Wings",
    text: "The elevated side wings fill the gap between your ear and shoulder when side sleeping — eliminating the lateral neck bend that causes morning stiffness.",
  },
  {
    icon: <Waves className="w-5 h-5" />,
    title: "Shoulder Arch Release",
    text: "The cutout arch at the base relieves pressure on the trapezius and upper shoulder, reducing the tension that builds up during a full night of sleep.",
  },
  {
    icon: <Snowflake className="w-5 h-5" />,
    title: "Open-Cell Cooling Foam",
    text: "Unlike traditional memory foam that traps heat, the open-cell structure allows continuous airflow — keeping the microclimate around your head cool and sleep-conducive all night.",
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

export default function MellaraMaxReview() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

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
                <span className="text-primary font-semibold text-sm">Verified 30-Night Review</span>
              </div>

              <p className="text-primary font-semibold text-xs uppercase tracking-widest">
                Sleep &amp; Wellness
              </p>

              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                I Finally Woke Up Without
                <span className="text-primary italic block">Neck Pain</span>
              </h1>

              <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
                After 30 nights sleeping on the MellaraMax Butterfly Ergonomic Pillow, my chronic morning neck stiffness is gone. No more tossing. No more waking up exhausted. Here's my honest verdict.
              </p>

              {/* Author byline */}
              <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 w-fit shadow-sm">
                <img
                  src="/images/mellaramax/miranda_thumb.jpg"
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
                    Shop MellaraMax — Up to 70% Off
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
                  src="/images/mellaramax/hero_main.jpg"
                  alt="Miranda sleeping peacefully on the MellaraMax Butterfly Ergonomic Pillow"
                  className="w-full max-h-[560px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>
              {/* Floating verdict card */}
              <div className="absolute bottom-0 -left-4 bg-white rounded-xl shadow-xl p-5">
                <p className="text-xs font-semibold text-primary mb-1">Miranda's Verdict</p>
                <p className="text-4xl font-bold text-foreground leading-none">9.7</p>
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
              { num: "0", label: "Mornings with Neck Pain" },
              { num: "30+", label: "Nights Tested" },
              { num: "9.7", label: "Miranda's Rating" },
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
              Your Pillow Is Probably Ruining Your Sleep
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mb-12 leading-relaxed">
              Most people blame stress, screens, or their mattress for poor sleep. But the real culprit is often right under your head — a flat, unsupportive pillow that forces your neck into unnatural positions all night long.
            </p>

            {/* Three problem cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  accent: "bg-amber-500",
                  cat: "Flat Standard Pillows",
                  catColor: "text-amber-600",
                  title: "No Support Where It Matters",
                  text: "Standard rectangular pillows compress overnight and provide zero cervical support. Your neck bends sideways for 7–8 hours, straining muscles and ligaments. The result: morning stiffness, headaches, and that groggy feeling that follows you all day.",
                },
                {
                  accent: "bg-blue-500",
                  cat: "Old Memory Foam Pillows",
                  catColor: "text-blue-600",
                  title: "Heat Trap. Shape Loss. Frustration.",
                  text: "Traditional memory foam retains body heat, creating a hot microclimate around your head that disrupts deep sleep. They also lose their shape within months, leaving you with a flat, unsupportive lump that does more harm than good.",
                },
                {
                  accent: "bg-primary",
                  cat: "MellaraMax Butterfly Design",
                  catColor: "text-primary",
                  title: "Engineered for Every Sleep Position.",
                  text: "The butterfly contour cradles your head, supports your neck's natural curve, and accommodates your shoulders — whether you sleep on your back, side, or stomach. Cooling open-cell foam keeps you comfortable all night. It solves every problem at once.",
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
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold text-foreground/60">Flat Pillow</th>
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold text-foreground/60">Old Memory Foam</th>
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold bg-primary">MellaraMax</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 1 ? "bg-background" : "bg-white"}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{row.label}</td>
                      <td className="px-5 py-3.5 text-center text-foreground/60">
                        <div className="flex flex-col items-center gap-1">
                          <RatingCell good={row.flat.good} />
                          <span className="text-xs">{row.flat.text}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center text-foreground/60">
                        <div className="flex flex-col items-center gap-1">
                          <RatingCell good={row.foam.good} />
                          <span className="text-xs">{row.foam.text}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center bg-primary/5 font-semibold text-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <RatingCell good={row.mellaramax.good} />
                          <span className="text-xs">{row.mellaramax.text}</span>
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
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">My 30-Night Test</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              I Slept on It Every Night. Here's What Happened.
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mb-12 leading-relaxed">
              I've been waking up with neck stiffness for years. I blamed my mattress, my stress levels, everything. Then I tried the MellaraMax. Four moments changed everything.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  img: "/images/mellaramax/pillow_closeup.jpg",
                  alt: "Close-up of the MellaraMax pillow's contour on Miranda's first night",
                  step: "Night 1 — First Impression",
                  title: "The Butterfly Shape Actually Works",
                  text: "I was skeptical about the unusual shape. But the moment my head settled into the central cradle and my neck rested on the contoured support, I felt the difference. My spine was in a neutral position for the first time in years. I fell asleep faster than usual.",
                },
                {
                  img: "/images/mellaramax/miranda_sleeping.jpg",
                  alt: "Miranda sleeping on her side on the MellaraMax pillow",
                  step: "Week 1 — Side Sleeping",
                  title: "The Wings Changed Everything",
                  text: "I'm primarily a side sleeper. The raised support wings fill the gap between my ear and shoulder perfectly — no more lateral neck bend. I stopped waking up at 3am to reposition. The shoulder arch release area meant my arm stopped going numb. A genuine revelation.",
                },
                {
                  img: "/images/mellaramax/miranda_waking_up.jpg",
                  alt: "Miranda waking up refreshed after sleeping on the MellaraMax pillow",
                  step: "Week 2 — The Morning Test",
                  title: "No Stiffness. Zero.",
                  text: "By week two, I noticed something extraordinary: I was waking up without neck pain for the first time in years. I'd roll over, sit up, and just… feel fine. No slow, stiff shuffle to the bathroom. No need to stretch my neck for five minutes before I could function. Just awake and ready.",
                },
                {
                  img: "/images/mellaramax/miranda_neck_check.jpg",
                  alt: "Miranda checking her neck after 30 nights with the MellaraMax pillow",
                  step: "Night 30 — Final Check",
                  title: "30 Nights. Still Perfect.",
                  text: "After a full month, the pillow holds its shape exactly as it did on day one. No flattening, no permanent indentations. The cooling effect is still working — I never wake up hot and sweaty. My chronic neck stiffness hasn't returned once. This is the most transformative sleep product I've ever reviewed.",
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

            <div className="mt-10 bg-primary/10 border border-primary/20 rounded-xl p-6 max-w-2xl">
              <p className="text-sm font-semibold text-primary mb-1">Miranda's Verdict</p>
              <p className="text-lg font-semibold text-foreground">
                The most effective sleep upgrade I've ever tested — and the only pillow I'd recommend to anyone who wakes up with neck pain or stiffness.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHY IT WORKS ── */}
        <section className="py-20 bg-gradient-to-b from-white to-primary/5" id="science">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">The Design</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Why the Butterfly Shape Is Different
                </h2>
                <p className="text-foreground/70 leading-relaxed mb-8">
                  The core innovation is the butterfly contour — a precision-engineered shape that works with your body's natural geometry instead of against it. Here's what makes it work.
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
                  src="/images/mellaramax/pillow_product.jpg"
                  alt="MellaraMax butterfly ergonomic pillow showing its contour design"
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
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">MellaraMax vs. Standard vs. Old Memory Foam</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Here's how the MellaraMax stacks up across the metrics that actually affect your sleep quality.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-border shadow-md overflow-x-auto mb-12">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-foreground">
                    <th className="text-left px-5 py-4 text-xs uppercase tracking-wide font-semibold text-white/80">Category</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide font-semibold bg-primary text-white">MellaraMax</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide font-semibold text-white/60">Standard Pillow</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide font-semibold text-white/60">Old Memory Foam</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Neck & Spine Support", v: "Precision butterfly contour alignment", w: "None — flat and unsupported", p: "Basic — no cervical contour" },
                    { cat: "Side Sleeper Fit", v: "Raised wings fill shoulder gap perfectly", w: "Forces lateral neck bend", p: "Partial — no shoulder accommodation" },
                    { cat: "Temperature Regulation", v: "Excellent — open-cell cooling foam", w: "Moderate — breathable fill", p: "Poor — traps body heat" },
                    { cat: "Shape Retention", v: "Maintains form for 3+ years", w: "Compresses overnight", p: "Loses shape within months" },
                    { cat: "Morning Stiffness", v: "Eliminated — zero after 30 nights", w: "Common — neck bends all night", p: "Frequent — heat disrupts sleep" },
                    { cat: "Allergen Resistance", v: "Non-allergenic materials", w: "Collects dust mites", p: "Moderate protection" },
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
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < 3 ? "fill-muted text-muted-foreground" : "text-muted-foreground"} />)}
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
            src="/images/mellaramax/miranda_holding_pillow.jpg"
            alt="Miranda holding the MellaraMax Butterfly Ergonomic Pillow"
            className="w-full h-full object-cover object-[center_20%]"
          />
        </div>

        {/* ── QUOTE ── */}
        <section className="bg-foreground py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[20rem] font-serif text-white/[0.03] leading-none">"</span>
          </div>
          <blockquote className="relative z-10 font-serif text-2xl md:text-4xl italic text-white/90 max-w-3xl mx-auto leading-snug mb-8">
            "I've reviewed hundreds of wellness products. The MellaraMax is the first pillow that made me feel like I was{" "}
            <em className="not-italic text-primary">actually investing in my health</em> — not just buying another sleep gadget."
          </blockquote>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <img
              src="/images/mellaramax/miranda_thumb.jpg"
              alt="Miranda Rodríguez"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/50"
            />
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Miranda Rodríguez</p>
              <p className="text-white/50 text-xs">MirandaReviews.com · 30-Night Tested</p>
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
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Ready to Sleep Without Pain?</h2>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
            After 30 nights of real-world testing, the MellaraMax Butterfly Ergonomic Pillow is the only pillow I'd recommend to anyone who wakes up stiff, sleeps hot, or simply wants to wake up feeling genuinely rested. No neck pain. No heat. No compromise.
          </p>
          <a href={SHOP_URL} target="_blank" rel="nofollow sponsored">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold text-base px-10 py-6 hover:shadow-lg transition-all">
              Shop MellaraMax — Up to 70% Off Today
            </Button>
          </a>
          <p className="mt-4 text-sm text-foreground/50">30-Night Money-Back Guarantee · Free Returns · Secure Checkout</p>
        </section>

        {/* Disclosure */}
        <p className="text-center text-xs text-foreground/40 px-6 pb-10 max-w-2xl mx-auto">
          <strong className="text-foreground/50">Disclosure:</strong> This is a sponsored/affiliate review. I received the MellaraMax pillow to test and may earn a commission on purchases through links on this page. All opinions are my own based on 30 nights of real-world use.
        </p>

      </main>

      <Footer />
    </div>
  );
}
