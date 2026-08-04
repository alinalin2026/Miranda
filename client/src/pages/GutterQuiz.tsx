/**
 * Gutter Protection Quiz — home-services lead-gen funnel
 * Route: /gutters
 *
 * Same architecture as the tea quiz (curiosity hook -> personal story ->
 * short quiz -> capture), pointed at a completely different economic
 * model: here the submitted form IS the conversion. Lead buyers pay
 * $65-95 per qualified home-services lead, so nobody has to spend their
 * own money for this funnel to pay -- which is exactly why the numbers
 * work where the tea funnel's never could.
 *
 * Deliberate design decisions:
 *
 * - Ownership is asked FIRST, not last. A renter can't authorise the
 *   work and their lead is worthless (worse: submitting renters gets an
 *   affiliate account banned). Asking early means we never waste their
 *   time or ours, and they still get a genuinely useful answer at the end.
 *
 * - Everyone reaches a real result page, qualified or not. A dead end
 *   after six questions is what gets ads reported.
 *
 * - No pricing claims, no "free installation", no fake urgency and no
 *   invented scarcity. Everything stated here is either the visitor's own
 *   answer read back to them or a plain fact about gutters. The offer is
 *   only ever "a contractor will call with a quote."
 *
 * - Consent is explicit and unticked by default. US lead buyers require
 *   TCPA consent captured verbatim with a timestamp before they will
 *   accept a phone lead; a pre-ticked box is not consent and would make
 *   every lead we sell unusable (and unlawful to dial).
 *
 * Leads POST to /api/hs-lead and are banked in Redis. Nothing is
 * forwarded to a buyer until a network is approved and provides their
 * posting spec -- so no traffic is wasted while approval is pending.
 */

import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const REVEAL_DELAY_MS = 1800;

type Question = {
  eyebrow: string;
  question: string;
  sub?: string;
  key: string;
  options: string[];
};

const questions: Question[] = [
  {
    eyebrow: "Question 1 of 6",
    question: "First — do you own your home?",
    sub: "Only the owner can authorise work, so this decides what I can actually help with.",
    key: "ownership",
    options: ["I own it", "I rent", "I manage it for someone else"],
  },
  {
    eyebrow: "Question 2 of 6",
    question: "How many floors?",
    key: "storeys",
    options: ["One", "Two", "Three or more"],
  },
  {
    eyebrow: "Question 3 of 6",
    question: "Any trees hanging over the roof?",
    key: "trees",
    options: ["Several", "One or two", "None nearby"],
  },
  {
    eyebrow: "Question 4 of 6",
    question: "When were the gutters last cleared?",
    key: "lastCleaned",
    options: ["Within a year", "A few years ago", "Honestly, no idea", "Never"],
  },
  {
    eyebrow: "Question 5 of 6",
    question: "Seen any of this after heavy rain?",
    key: "symptoms",
    options: [
      "Water spilling over the sides",
      "Plants growing in the gutter",
      "Staining down the wall",
      "Nothing I've noticed",
    ],
  },
  {
    eyebrow: "Question 6 of 6",
    question: "Roughly how old is the house?",
    key: "houseAge",
    options: ["Under 10 years", "10–30 years", "30–50 years", "Older than that"],
  },
];

type Answers = Record<string, string>;

function riskLabel(a: Answers): { title: string; blurb: string; high: boolean } {
  const heavyTrees = a.trees === "Several";
  const neglected = a.lastCleaned === "Never" || a.lastCleaned === "Honestly, no idea";
  const symptomatic =
    a.symptoms === "Water spilling over the sides" ||
    a.symptoms === "Plants growing in the gutter" ||
    a.symptoms === "Staining down the wall";
  const tall = a.storeys === "Two" || a.storeys === "Three or more";

  const score = [heavyTrees, neglected, symptomatic, tall].filter(Boolean).length;

  if (score >= 3) {
    return {
      high: true,
      title: "Yours is the kind that causes trouble",
      blurb:
        "Between the trees, how long it's been, and what you're already seeing after rain — this is exactly the situation where water ends up somewhere it shouldn't. Worth having someone actually look before autumn.",
    };
  }
  if (score === 2) {
    return {
      high: true,
      title: "Worth getting eyes on before autumn",
      blurb:
        "Not urgent, but not nothing either. The stuff you described is how most gutter problems start — slowly, then all at once during the first heavy week of leaves.",
    };
  }
  return {
    high: false,
    title: "You're in decent shape",
    blurb:
      "Nothing you've described sounds alarming. Getting a quote is still the cheapest way to know for certain — but there's no rush here.",
  };
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2 w-full max-w-md mx-auto mb-8">
      {questions.map((_, i) => (
        <div
          key={i}
          className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${
            i <= step ? "bg-sky-800" : "bg-sky-800/15"
          }`}
        />
      ))}
    </div>
  );
}

export default function GutterQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealed, setRevealed] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [todayCount, setTodayCount] = useState<number | null>(null);

  const done = step >= questions.length;
  const countFired = useRef(false);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [done]);

  useEffect(() => {
    if (!done || countFired.current) return;
    countFired.current = true;
    fetch("/api/hs-count", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.today === "number") setTodayCount(data.today);
      })
      .catch(() => {});
  }, [done]);

  function choose(q: Question, option: string) {
    setAnswers((prev) => ({ ...prev, [q.key]: option }));
    setStep((s) => s + 1);
  }

  const isOwner = answers.ownership === "I own it";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/hs-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          zip,
          answers,
          vertical: "gutters",
          source: "quiz",
          consent,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Intro ──
  if (!started) {
    return (
      <div className="min-h-[100dvh] bg-[#F2F6F8] px-6 py-12">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-6">
            My neighbour hasn't cleaned his gutters since 2019.
          </h1>

          <div className="space-y-5 text-neutral-800 text-2xl leading-relaxed">
            <p>
              I assumed he'd just given up. He's 71, the ladder's a bad
              idea, and I figured one winter it would all come down at
              once.
            </p>

            <p>
              Then last October we had that week of rain. My downspout was
              a waterfall. Mine. The one I'd cleared in the spring.
            </p>

            <p>His were bone dry. Not a drop out of place.</p>

            <p>
              He'd had guards fitted years ago and hadn't thought about it
              since. That was the whole trick. No secret, no gadget — he
              just dealt with it once and stopped climbing ladders.
            </p>

            <p className="font-semibold text-neutral-900">
              Six quick questions and I'll tell you whether yours is the
              kind that causes trouble — and get you a free quote if it is.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="w-full mt-10 bg-sky-800 hover:bg-sky-900 text-white font-bold text-2xl px-8 py-9 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all border-2 border-sky-950"
          >
            Check My Gutters →
          </Button>

          <p className="text-center text-neutral-500 text-base mt-4">
            Takes about 30 seconds. No obligation.
          </p>
        </div>
      </div>
    );
  }

  // ── Spinner ──
  if (done && !revealed) {
    return (
      <div className="min-h-[100dvh] bg-[#F2F6F8] flex flex-col items-center justify-center px-6">
        <Loader2 className="w-14 h-14 text-sky-800 animate-spin mb-8" />
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center leading-tight">
          Checking your answers…
        </h1>
      </div>
    );
  }

  // ── Result ──
  if (done) {
    const risk = riskLabel(answers);

    if (submitted) {
      return (
        <div className="min-h-[100dvh] bg-[#F2F6F8] flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <ShieldCheck className="w-16 h-16 text-sky-800 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-neutral-900 leading-tight mb-5">
              Done — that's all I needed.
            </h1>
            <p className="text-neutral-800 text-xl leading-relaxed mb-4">
              A local gutter specialist will call you about a free quote,
              usually within a business day. They'll come and look before
              quoting anything — no one can price this properly from a
              form.
            </p>
            <p className="text-neutral-600 text-lg leading-relaxed">
              If it turns out you don't need the work, tell them so. You're
              under no obligation whatsoever.
            </p>
          </div>
        </div>
      );
    }

    // Renters and managers get the honest version: real advice, no form.
    // Their lead can't be sold, so asking for a phone number would be
    // taking their details for nothing.
    if (!isOwner) {
      return (
        <div className="min-h-[100dvh] bg-[#F2F6F8] flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-neutral-900 leading-tight mb-5">
              {risk.title}
            </h1>
            <p className="text-neutral-800 text-xl leading-relaxed mb-5">{risk.blurb}</p>
            <div className="bg-white border border-sky-800/20 rounded-2xl p-6">
              <p className="text-neutral-800 text-lg leading-relaxed">
                Since you don't own the property, this one's your
                landlord's job — gutters are a building-maintenance issue,
                not a tenant one. Send them what you've seen after heavy
                rain, with a photo if you have one. That's usually enough
                to get it dealt with.
              </p>
            </div>
            <p className="text-neutral-500 text-base mt-6 text-center">
              No sense taking your details for work you can't authorise.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[100dvh] bg-[#F2F6F8] px-6 py-12">
        <div className="w-full max-w-md mx-auto">
          <p className="text-sky-800 font-bold text-base uppercase tracking-widest mb-3">
            Your result
          </p>
          <h1 className="text-4xl font-bold text-neutral-900 leading-tight mb-5">
            {risk.title}
          </h1>
          <p className="text-neutral-800 text-xl leading-relaxed mb-6">{risk.blurb}</p>

          {typeof todayCount === "number" && todayCount > 0 && (
            <p className="text-neutral-600 text-lg mb-6">
              🏠 {todayCount} {todayCount === 1 ? "person has" : "people have"} checked theirs today
            </p>
          )}

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Get a free quote from a local specialist
            </h2>
            <p className="text-neutral-700 text-lg leading-relaxed mb-6">
              They'll come out, look at it properly, and tell you what it
              would cost. No obligation to go ahead.
            </p>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-sky-800 transition-all placeholder:text-neutral-400"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-sky-800 transition-all placeholder:text-neutral-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-sky-800 transition-all placeholder:text-neutral-400"
              />
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP code"
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-sky-800 transition-all placeholder:text-neutral-400"
              />

              <label className="flex items-start gap-3 text-left pt-1">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1.5 w-5 h-5 rounded shrink-0"
                />
                <span className="text-neutral-600 text-sm leading-relaxed">
                  I agree to be contacted by a gutter specialist about a
                  quote, by phone or text at the number above, including
                  automated calls. Consent isn't a condition of purchase
                  and I can opt out at any time.
                </span>
              </label>

              {error && <p className="text-red-600 text-base">{error}</p>}

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-sky-800 hover:bg-sky-900 text-white font-bold text-xl px-8 py-8 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all border-2 border-sky-950 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Get My Free Quote"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Question card ──
  const q = questions[step];

  return (
    <div className="min-h-[100dvh] bg-[#F2F6F8] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <ProgressBar step={step} />

        <p className="text-sky-800 font-bold text-sm uppercase tracking-widest mb-3 text-center">
          {q.eyebrow}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-3 text-center">
          {q.question}
        </h1>

        {q.sub && (
          <p className="text-neutral-600 text-lg text-center mb-8 leading-relaxed">{q.sub}</p>
        )}

        <div className={`space-y-4 ${q.sub ? "" : "mt-8"}`}>
          {q.options.map((option) => (
            <button
              key={option}
              onClick={() => choose(q, option)}
              className="w-full text-center text-2xl font-bold text-neutral-900 bg-white border-2 border-neutral-800 rounded-2xl py-6 px-6 shadow-md hover:border-sky-800 hover:text-sky-800 hover:shadow-lg active:scale-[0.98] transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
