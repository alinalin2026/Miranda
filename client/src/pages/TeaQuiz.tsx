/**
 * Tea Match Quiz
 * Route: /tea-quiz
 *
 * Nine one-tap questions, one near-full-screen card each, then a result
 * screen. Questions are deliberately about the visitor's own tastes,
 * habits and preferences -- favourite tea, how they take it, how much they
 * drink -- not symptoms (energy/digestion/sleep/stress). Nothing here
 * states what any product does or treats.
 *
 * Rendered standalone, without the site Header/Footer: the result screen
 * is attributed to "Stacey" to stay continuous with the ad creative, so
 * the Miranda branding is deliberately absent here. The rest of the site
 * (including the recipe article) is still Miranda's.
 *
 * Story runs start to end: the intro is Stacey's grandmother-taught-tea
 * narrative (matches the "I pour vinegar in my tea" ad creative -- the
 * grandmother's version included vinegar too), the result frames the
 * match as "the version she'd make you," and email capture is framed as
 * Stacey sending her grandmother's recipe personally.
 *
 * IMPORTANT: after email submit, this page shows a "check your inbox"
 * confirmation only -- there is no on-page link to the offer anymore (the
 * previous "Watch The Video" button pointing at
 * /review/all-day-slimming-tea/buy has been removed, per instruction not
 * to show it once someone has left their email). That means this funnel
 * currently has NO path to the affiliate offer at all until outbound
 * email sending is wired up -- the email is captured (POST
 * /api/quiz-lead, stored in Redis, see api/_lib/keys.ts) but nothing is
 * sent yet.
 */

import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

// Brief pause between the last answer and the result. Cutting straight
// from a tap to the result screen reads as a jump-cut; a moment of
// "working on it" makes the result feel like it was arrived at.
const REVEAL_DELAY_MS = 2200;

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

// "All day" and "Both" don't slot into a sentence the way the other
// options do ("in the all day", "served both"), so they get their own
// phrasing rather than a bare .toLowerCase().
function whenPhrase(when: string): string {
  return when === "All day" ? "throughout the day" : `in the ${when.toLowerCase()}`;
}

function tempPhrase(temperature: string): string {
  return temperature === "Both" ? "hot or iced" : temperature.toLowerCase();
}

// The result is keyed off the last question (what they want from their
// tea), with the blurb worked back around their earlier answers so it
// reads as a genuine match rather than the same screen for everyone. Each
// blurb describes why the blend suits their stated routine -- it doesn't
// claim an outcome.
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

  // Save is best-effort: a failed write still marks the email as
  // submitted, since the point is the visitor experience (confirmation
  // screen), not blocking on Redis being reachable.
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

  // Intro carries the same face as the ad creative and opens with the
  // same line ("I pour vinegar in my tea"), then continues into the
  // grandmother story -- the vinegar is hers, not a random habit.
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
            My grandmother never followed diets.
          </h1>

          <div className="space-y-5 text-neutral-800 text-2xl leading-relaxed">
            <p>
              She just made tea — a different version depending on how I
              looked or felt that morning. Some days lighter. Some days
              stronger. Sometimes with a small splash of vinegar.
            </p>

            <p>
              When I was younger I didn't pay much attention. In my 40s, I
              came back to her way.
            </p>

            <p>
              I stopped forcing strict routines and started making tea the
              way she taught me — according to what I actually needed that
              day, not a plan written for someone else.
            </p>

            <p>
              It became the one thing I never quit. I still make it most
              mornings.
            </p>

            <p className="font-semibold text-neutral-900">
              I can show you the version that fits you. It'll take about a
              minute — just a few quick questions about how you drink tea.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="w-full mt-10 bg-amber-800 hover:bg-amber-900 text-white font-bold text-2xl px-8 py-9 rounded-2xl shadow-[0_10px_0_0_#5C3A1E] hover:shadow-[0_6px_0_0_#5C3A1E] hover:translate-y-1 active:shadow-none active:translate-y-2.5 transition-all border-2 border-amber-950"
          >
            Find My Tea Version →
          </Button>
        </div>
      </div>
    );
  }

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

  if (done) {
    const picked = toAnswers(answers);
    const result = results[picked.goal] ?? results["All of it"];

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
            This is close to the pattern she had — a version built around how
            you actually feel, not a strict routine.
          </p>

          {!emailSubmitted ? (
            <form onSubmit={(e) => submitEmail(e, picked, result.name)} className="space-y-4">
              <p className="text-neutral-800 text-lg leading-relaxed mb-2 font-medium">
                I'll send you my grandmother's full recipe — the exact way
                she taught me.
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full text-center text-2xl px-6 py-6 rounded-2xl border-[3px] border-neutral-800 bg-white text-neutral-900 shadow-[0_6px_0_0_#171412] focus:outline-none focus:border-amber-800 focus:shadow-[0_6px_0_0_#92400E] transition-all placeholder:text-neutral-400"
              />
              <Button
                type="submit"
                size="lg"
                disabled={submittingEmail}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold text-2xl px-8 py-9 rounded-2xl shadow-[0_10px_0_0_#5C3A1E] hover:shadow-[0_6px_0_0_#5C3A1E] hover:translate-y-1 active:shadow-none active:translate-y-2.5 transition-all border-2 border-amber-950 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Mail className="!w-7 !h-7 mr-1" />
                {submittingEmail ? "Sending…" : "Send Me Grandma's Recipe"}
              </Button>
              <p className="text-sm text-neutral-500">Just the recipe. No spam.</p>
            </form>
          ) : (
            <div className="bg-white border-[3px] border-neutral-800 rounded-2xl p-8 shadow-[0_6px_0_0_#171412]">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">Thank you.</h2>
              <p className="text-neutral-800 text-xl leading-relaxed">
                Check your inbox — I'm sending over my grandmother's recipe,
                along with the rest of the story.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
              className="w-full text-center text-2xl font-bold text-neutral-900 bg-white border-[3px] border-neutral-800 rounded-2xl py-6 px-6 shadow-[0_6px_0_0_#171412] hover:border-amber-800 hover:text-amber-800 hover:shadow-[0_6px_0_0_#92400E] active:shadow-none active:translate-y-1.5 transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
