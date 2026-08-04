/**
 * Tea Match Quiz
 * Route: /tea-quiz
 *
 * Flow: personal intro (grandmother story) -> 9 taste/habit questions ->
 * "preparing your tea" spinner -> result (matched blend + email capture)
 * -> PAYOFF screen (handwritten recipe card + the vinegar secret).
 *
 * Why the payoff is on-page, not just emailed: the ad promises "why the
 * vinegar," so if someone completes the quiz and never learns it, they
 * feel cheated and report the ad. Showing the recipe + the vinegar
 * explanation immediately after email capture guarantees they get what
 * they came for, with no dependency on outbound email actually sending.
 *
 * The vinegar explanation is the "switchel" angle -- a real 1600s
 * farmhouse drink (vinegar + honey + ginger + water). It's true, it's
 * charming, and it explains the vinegar purely as taste/tradition. It
 * makes NO health claim, deliberately.
 *
 * Questions are about tastes/habits/preferences only (favourite tea, how
 * they take it, how much they drink) -- never symptoms. Nothing states
 * what any product does or treats.
 *
 * Rendered standalone (no site Header/Footer). Attributed to "Stacey" to
 * stay continuous with the ad creative. Email capture posts to
 * /api/quiz-lead (stored in Redis, see api/_lib/keys.ts); the save is
 * best-effort and never blocks the visitor from reaching the payoff.
 *
 * There is intentionally NO on-page link to the affiliate offer here --
 * the video/offer is delivered later by email once sending is wired up.
 */

import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

// Brief pause between the last answer and the result. Cutting straight
// from a tap to the result reads as a jump-cut; a moment of "working on
// it" makes the result feel arrived at.
const REVEAL_DELAY_MS = 2200;

const HANDWRITING = "'Caveat', cursive";

type Question = {
  image: string;
  eyebrow: string;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    image: "/images/tea/quiz/q1_herbs.jpg",
    eyebrow: "Question 1 of 9",
    question: "Do you believe in the power of plants?",
    options: ["Absolutely", "Somewhat", "I'm curious"],
  },
  {
    image: "/images/tea/quiz/q2_tea.jpg",
    eyebrow: "Question 2 of 9",
    question: "How many cups of tea do you drink a day?",
    options: ["1", "2-3", "4+", "I want to drink more"],
  },
  {
    image: "/images/tea/quiz/q3_spread.jpg",
    eyebrow: "Question 3 of 9",
    question: "What's your favourite tea?",
    options: ["Green", "Herbal", "Black", "Mint"],
  },
  {
    image: "/images/tea/quiz/q4_iced.jpg",
    eyebrow: "Question 4 of 9",
    question: "What flavours do you enjoy most?",
    options: ["Fruity", "Sour", "Sweet", "Earthy"],
  },
  {
    image: "/images/tea/quiz/q5_glass.jpg",
    eyebrow: "Question 5 of 9",
    question: "When do you drink your tea?",
    options: ["Morning", "Afternoon", "Evening", "All day"],
  },
  {
    image: "/images/tea/glass_closeup.jpg",
    eyebrow: "Question 6 of 9",
    question: "Hot or iced?",
    options: ["Hot", "Iced", "Both"],
  },
  {
    image: "/images/tea/hero_iced_tea.jpg",
    eyebrow: "Question 7 of 9",
    question: "What age group are you in?",
    options: ["Under 40", "40s", "50s", "60+"],
  },
  {
    image: "/images/tea/quiz/q3_spread.jpg",
    eyebrow: "Question 8 of 9",
    question: "How do you take your tea?",
    options: ["Plain", "With honey", "With lemon", "With milk"],
  },
  {
    image: "/images/tea/quiz/q5_glass.jpg",
    eyebrow: "Question 9 of 9",
    question: "What do you want most from your tea?",
    options: ["Energy", "Calm", "Feel lighter", "All of it"],
  },
];

type Answers = {
  plants: string;
  cupsPerDay: string;
  favourite: string;
  flavour: string;
  when: string;
  temperature: string;
  ageGroup: string;
  preparation: string;
  goal: string;
};

function toAnswers(picked: string[]): Answers {
  return {
    plants: picked[0] ?? "Absolutely",
    cupsPerDay: picked[1] ?? "2-3",
    favourite: picked[2] ?? "Herbal",
    flavour: picked[3] ?? "Fruity",
    when: picked[4] ?? "All day",
    temperature: picked[5] ?? "Both",
    ageGroup: picked[6] ?? "50s",
    preparation: picked[7] ?? "Plain",
    goal: picked[8] ?? "All of it",
  };
}

function whenPhrase(when: string): string {
  return when === "All day" ? "throughout the day" : `in the ${when.toLowerCase()}`;
}

function tempPhrase(temperature: string): string {
  return temperature === "Both" ? "hot or iced" : temperature.toLowerCase();
}

const results: Record<string, { name: string; blurb: (a: Answers) => string }> = {
  Energy: {
    name: "The Morning Lift Blend",
    blurb: (a) =>
      `You reach for tea ${whenPhrase(a.when)} and want something with a bit of lift. A brighter ${a.favourite.toLowerCase()} blend with a ${a.flavour.toLowerCase()} edge, ${tempPhrase(a.temperature)}, fits that best.`,
  },
  Calm: {
    name: "The Evening Calm Blend",
    blurb: (a) =>
      `You're after the quiet part of the day. A softer, caffeine-light herbal blend — ${a.flavour.toLowerCase()}, ${tempPhrase(a.temperature)}, the way you like it — suits drinking it ${whenPhrase(a.when)}.`,
  },
  "Feel lighter": {
    name: "The Everyday Light Blend",
    blurb: (a) =>
      `You want something that sits well and doesn't weigh you down. A gentle ${a.favourite.toLowerCase()} blend with a ${a.flavour.toLowerCase()} note, drunk ${whenPhrase(a.when)}, ${tempPhrase(a.temperature)}, is the easiest place to start.`,
  },
  "All of it": {
    name: "The Everyday All-Rounder",
    blurb: (a) =>
      `You're not after one single thing — you want a tea that does a bit of everything. A balanced ${a.favourite.toLowerCase()} blend, leaning ${a.flavour.toLowerCase()}, ${tempPhrase(a.temperature)}, covers the most ground, and it's an easy one to come back to ${whenPhrase(a.when)}.`,
  },
};

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2 w-full max-w-md mx-auto mb-8">
      {questions.map((_, i) => (
        <div
          key={i}
          className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${
            i <= step ? "bg-amber-800" : "bg-amber-800/15"
          }`}
        />
      ))}
    </div>
  );
}

// Handwritten recipe card, lightly personalised to their answers. Kept
// deliberately human: a natural crossed-out correction, a signature, a
// slight tilt. The vinegar line is the payoff the ad promised.
function RecipeCard({ a }: { a: Answers }) {
  const teaWord = a.favourite === "Herbal" ? "herbal" : a.favourite.toLowerCase();
  const served = a.temperature === "Iced" ? "over ice" : a.temperature === "Both" ? "hot or over ice" : "hot";

  return (
    <div
      className="relative bg-[#FFFDF5] rounded-sm px-7 py-8 text-neutral-800 shadow-2xl"
      style={{
        transform: "rotate(-1.2deg)",
        backgroundImage:
          "repeating-linear-gradient(#FFFDF5, #FFFDF5 37px, #E6DEC5 38px, #FFFDF5 39px)",
        boxShadow: "0 18px 40px -12px rgba(0,0,0,.35)",
      }}
    >
      {/* tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-200/70 rotate-1 shadow-sm" />

      <p style={{ fontFamily: HANDWRITING }} className="text-4xl font-bold text-amber-900 text-center leading-none mb-1">
        Nana's Morning Tea
      </p>
      <p style={{ fontFamily: HANDWRITING }} className="text-2xl text-neutral-600 text-center mb-6">
        (the way she taught me)
      </p>

      <ul style={{ fontFamily: HANDWRITING }} className="text-3xl leading-[1.5] space-y-1">
        <li>• 1 cup {teaWord} tea, brewed strong</li>
        <li>• juice of half a lemon</li>
        <li>• a few fresh mint leaves, torn</li>
        <li>
          • 1{" "}
          <span className="line-through decoration-2 text-neutral-400">teaspon</span> teaspoon
          honey
        </li>
        <li>• 1 small splash of apple cider vinegar</li>
      </ul>

      <div style={{ fontFamily: HANDWRITING }} className="text-3xl leading-[1.5] mt-6 space-y-1">
        <p>Brew the tea, let it sit 5 min.</p>
        <p>Stir everything in while it's warm.</p>
        <p>Serve it {served}. Sip it slow — don't rush.</p>
      </div>

      <p style={{ fontFamily: HANDWRITING }} className="text-3xl text-amber-900 mt-7 leading-snug">
        The vinegar is the whole secret. Just a splash — don't
        overdo it! ♡
      </p>

      <p style={{ fontFamily: HANDWRITING }} className="text-3xl text-right mt-6 text-neutral-700">
        — made with love, Stacey x
      </p>
    </div>
  );
}

export default function TeaQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);

  const done = step >= questions.length;

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [done]);

  function choose(option: string) {
    setAnswers((prev) => [...prev, option]);
    setStep((s) => s + 1);
  }

  async function submitEmail(e: React.FormEvent, picked: Answers, resultName: string) {
    e.preventDefault();
    setSubmittingEmail(true);
    try {
      await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, answers: picked, result: resultName, source: "quiz" }),
      });
    } catch (err) {
      console.error("Failed to save quiz lead", err);
    } finally {
      setSubmittingEmail(false);
      setEmailSubmitted(true);
    }
  }

  // ── Intro: the personal grandmother story ──
  if (!started) {
    return (
      <div className="min-h-[100dvh] bg-[#FBF4E8] px-6 py-12">
        <div className="w-full max-w-md mx-auto">
          <img
            src="/images/tea/stacey.jpg"
            alt="Stacey with a cup of tea"
            className="w-44 h-44 rounded-full object-cover shadow-2xl ring-4 ring-white mx-auto mb-8"
          />

          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-6 text-center">
            My grandmother never followed a single diet.
          </h1>

          <div className="space-y-5 text-neutral-800 text-2xl leading-relaxed">
            <p>
              We just called her Nana. She had a chipped enamel pot that
              lived on the back of the stove, and most mornings there was
              tea in it — made a little differently depending on the day.
            </p>

            <p>
              Some mornings light and green. Some dark and strong. And now
              and then, a small splash of apple cider vinegar that made me
              wrinkle my nose as a girl.
            </p>

            <p>
              <em>"That's the wake-up,"</em> she'd say. She never explained
              it past that.
            </p>

            <p>
              I forgot about it for years — chasing every plan and rule
              there was through my 30s. None of them stuck. Then somewhere
              in my 40s, tired of all of it, I started making tea again. Her
              way. Not by a rulebook — just by how I actually felt that
              morning.
            </p>

            <p>
              It's the one thing I never quit. I still make it most
              mornings, in a cup that's not quite as chipped as hers was.
            </p>

            <p className="font-semibold text-neutral-900">
              Let me show you the version she'd have made for you — and
              finally tell you what that splash of vinegar is really for.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="w-full mt-10 bg-amber-800 hover:bg-amber-900 text-white font-bold text-2xl px-8 py-9 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all border-2 border-amber-950"
          >
            Find My Tea Version →
          </Button>
        </div>
      </div>
    );
  }

  // ── Spinner ──
  if (done && !revealed) {
    return (
      <div className="min-h-[100dvh] bg-[#FBF4E8] flex flex-col items-center justify-center px-6">
        <Loader2 className="w-16 h-16 text-amber-800 animate-spin mb-8" />
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center leading-tight">
          Preparing your tea…
        </h1>
        <p className="text-neutral-600 text-lg text-center mt-4">
          Matching your answers to the right blend
        </p>
      </div>
    );
  }

  // ── Result + email capture, then payoff ──
  if (done) {
    const picked = toAnswers(answers);
    const result = results[picked.goal] ?? results["All of it"];

    // PAYOFF: recipe card + the vinegar secret. Shown immediately after
    // email so the visitor always gets what the ad promised.
    if (emailSubmitted) {
      return (
        <div className="min-h-[100dvh] bg-[#FBF4E8] px-6 py-12">
          <div className="w-full max-w-md mx-auto">
            <p className="text-amber-800 font-bold text-base uppercase tracking-widest mb-3 text-center">
              Your recipe — {result.name}
            </p>
            <h1 className="text-4xl font-bold text-neutral-900 leading-tight mb-8 text-center">
              Here it is, in my own hand.
            </h1>

            <RecipeCard a={picked} />

            <div className="mt-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                So — why the vinegar?
              </h2>
              <div className="space-y-4 text-neutral-800 text-xl leading-relaxed">
                <p>
                  Here's the part Nana never spelled out. She grew up on a
                  farm, and out there they drank something called a{" "}
                  <strong>switchel</strong> — water, a little vinegar, some
                  ginger and honey — to cool off after working in the
                  fields. It goes back hundreds of years.
                </p>
                <p>
                  She never called it health food. She just said the splash
                  of vinegar <em>"woke the drink up."</em> And she was right:
                  it's the brightness. That little sour edge balances the
                  honey and the tea so the whole cup tastes cleaner and more
                  alive.
                </p>
                <p>
                  That's the whole secret. No magic — just an old farmhouse
                  habit that happens to taste wonderful. A teaspoon is
                  plenty. Any more and you've made a salad dressing.
                </p>
              </div>
            </div>

            <div className="mt-10 bg-white/70 border border-amber-800/20 rounded-2xl p-6 text-center">
              <p className="text-neutral-700 text-lg leading-relaxed">
                I've saved a copy to your inbox too — plus a little more of
                Nana's story. Keep an eye out for it. ♡
              </p>
              <p style={{ fontFamily: HANDWRITING }} className="text-3xl text-amber-900 mt-3">
                — Stacey
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Result + email gate
    return (
      <div className="min-h-[100dvh] bg-[#FBF4E8] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <img
            src="/images/tea/hero_iced_tea.jpg"
            alt="Herbal iced tea with mint and lemon"
            className="w-full rounded-3xl shadow-2xl ring-4 ring-white mb-8"
          />

          <p className="text-amber-800 font-bold text-base uppercase tracking-widest mb-4">
            Your grandmother-style match
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-5">
            The Tea She Would Make You
          </h1>

          <p className="text-amber-800 font-bold text-xl mb-4">
            Your match: {result.name}
          </p>

          <p className="text-neutral-800 text-xl leading-relaxed mb-3">
            {result.blurb(picked)}
          </p>

          <p className="text-neutral-800 text-xl leading-relaxed mb-8">
            I've written out the full recipe by hand — measurements and all
            — plus the real reason for the splash of vinegar.
          </p>

          <form onSubmit={(e) => submitEmail(e, picked, result.name)} className="space-y-4">
            <p className="text-black text-xl leading-relaxed mb-2 font-bold">
              Enter your email to see the recipe →
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full text-center text-2xl px-6 py-6 rounded-2xl border-2 border-neutral-800 bg-white text-neutral-900 shadow-md focus:outline-none focus:border-amber-800 focus:shadow-lg transition-all placeholder:text-neutral-400"
            />
            <Button
              type="submit"
              size="lg"
              disabled={submittingEmail}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold text-2xl px-8 py-9 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all border-2 border-amber-950 disabled:opacity-60"
            >
              <Mail className="!w-7 !h-7 mr-1" />
              {submittingEmail ? "Getting it ready…" : "Show Me The Recipe"}
            </Button>
            <p className="text-sm text-neutral-500">Just the recipe. No spam.</p>
          </form>
        </div>
      </div>
    );
  }

  // ── Question card ──
  const q = questions[step];

  return (
    <div className="min-h-[100dvh] bg-[#FBF4E8] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <ProgressBar step={step} />

        <img
          src={q.image}
          alt=""
          className="w-full h-52 sm:h-60 object-cover rounded-3xl shadow-2xl ring-4 ring-white mb-8"
        />

        <p className="text-amber-800 font-bold text-sm uppercase tracking-widest mb-3 text-center">
          {q.eyebrow}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-8 text-center">
          {q.question}
        </h1>

        <div className="space-y-4">
          {q.options.map((option) => (
            <button
              key={option}
              onClick={() => choose(option)}
              className="w-full text-center text-2xl font-bold text-neutral-900 bg-white border-2 border-neutral-800 rounded-2xl py-6 px-6 shadow-md hover:border-amber-800 hover:text-amber-800 hover:shadow-lg active:scale-[0.98] transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
