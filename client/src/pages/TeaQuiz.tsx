/**
 * Tea Match Quiz
 * Route: /tea-quiz
 *
 * Five one-tap questions, one near-full-screen card each, then a result
 * screen. Questions are deliberately about the visitor's own tastes and
 * goals -- nothing here states what any product does.
 *
 * Rendered standalone, without the site Header/Footer: the result screen
 * is attributed to "Stacey" to stay continuous with the ad creative and
 * the video it hands off to, so the Miranda branding is deliberately
 * absent here. The rest of the site (including the recipe article) is
 * still Miranda's.
 *
 * The result screen's CTA points at /review/all-day-slimming-tea/buy, the
 * server-side redirect in middleware.ts, so the raw affiliate URL never
 * ships in the client bundle and promoter attribution (cookie -> &tid=)
 * keeps working. Reach this page via /quiz (see SHORTCUTS in
 * middleware.ts) to have the click logged and the ref cookie set.
 */

import { useEffect, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Brief pause between the last answer and the result. Cutting straight
// from a tap to the result screen reads as a jump-cut; a moment of
// "working on it" makes the result feel like it was arrived at.
const REVEAL_DELAY_MS = 2200;

const BUY_URL = "/review/all-day-slimming-tea/buy";

type Question = {
  image: string;
  eyebrow: string;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    image: "/images/tea/quiz/q1_herbs.jpg",
    eyebrow: "Question 1 of 5",
    question: "Do you believe in the power of plants?",
    options: ["Absolutely", "Somewhat", "I'm curious"],
  },
  {
    image: "/images/tea/quiz/q2_tea.jpg",
    eyebrow: "Question 2 of 5",
    question: "What's your favourite tea?",
    options: ["Green", "Herbal", "Black", "Mint"],
  },
  {
    image: "/images/tea/quiz/q3_spread.jpg",
    eyebrow: "Question 3 of 5",
    question: "When do you drink your tea?",
    options: ["Morning", "Afternoon", "Evening", "All day"],
  },
  {
    image: "/images/tea/quiz/q4_iced.jpg",
    eyebrow: "Question 4 of 5",
    question: "Hot or iced?",
    options: ["Hot", "Iced", "Both"],
  },
  {
    image: "/images/tea/quiz/q5_glass.jpg",
    eyebrow: "Question 5 of 5",
    question: "What do you want from your tea?",
    options: ["Energy", "Calm", "Feel lighter", "All of it"],
  },
];

type Answers = {
  plants: string;
  favourite: string;
  when: string;
  temperature: string;
  goal: string;
};

function toAnswers(picked: string[]): Answers {
  return {
    plants: picked[0] ?? "Absolutely",
    favourite: picked[1] ?? "Herbal",
    when: picked[2] ?? "All day",
    temperature: picked[3] ?? "Both",
    goal: picked[4] ?? "All of it",
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

// The result is keyed off Q5 (what they want from their tea), with the
// blurb worked back around their earlier answers so it reads as a genuine
// match rather than the same screen for everyone. Each blurb describes why
// the blend suits their stated routine -- it doesn't claim an outcome.
const results: Record<string, { name: string; blurb: (a: Answers) => string }> = {
  Energy: {
    name: "The Morning Lift Blend",
    blurb: (a) =>
      `You reach for tea ${whenPhrase(a.when)} and want something with a bit of lift. A brighter ${a.favourite.toLowerCase()} blend, ${tempPhrase(a.temperature)}, fits that best.`,
  },
  Calm: {
    name: "The Evening Calm Blend",
    blurb: (a) =>
      `You're after the quiet part of the day. A softer, caffeine-light herbal blend — ${tempPhrase(a.temperature)}, the way you like it — suits drinking it ${whenPhrase(a.when)}.`,
  },
  "Feel lighter": {
    name: "The Everyday Light Blend",
    blurb: (a) =>
      `You want something that sits well and doesn't weigh you down. A gentle ${a.favourite.toLowerCase()} blend you can drink ${whenPhrase(a.when)}, ${tempPhrase(a.temperature)}, is the easiest place to start.`,
  },
  "All of it": {
    name: "The Everyday All-Rounder",
    blurb: (a) =>
      `You're not after one single thing — you want a tea that does a bit of everything. A balanced ${a.favourite.toLowerCase()} blend, ${tempPhrase(a.temperature)}, covers the most ground, and it's an easy one to come back to ${whenPhrase(a.when)}.`,
  },
};

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2 w-full max-w-md mx-auto mb-8">
      {questions.map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
            i <= step ? "bg-primary" : "bg-primary/15"
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

  // Intro carries the same face and the same line as the ad creative, so
  // the page a visitor lands on matches what they just tapped, and it
  // frames the quiz as the route to the answer rather than a detour
  // around it.
  if (!started) {
    return (
      <div className="min-h-[100dvh] bg-background px-6 py-12">
        <div className="w-full max-w-md mx-auto">
          <img
            src="/images/tea/stacey.jpg"
            alt="Stacey with a cup of tea"
            className="w-44 h-44 rounded-full object-cover shadow-xl mx-auto mb-8"
          />

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-6 text-center">
            Hi, I'm Stacey
          </h1>

          <div className="space-y-5 text-foreground/80 text-xl leading-relaxed">
            <p>
              I'm 51 — and every single morning, I put a splash of apple cider
              vinegar in my tea.
            </p>

            <p>
              I know exactly how that sounds. The first time a friend told me
              she did it, I pulled a face. Vinegar belongs on a salad, not in a
              teacup. But she'd been doing it for years, and she was stubborn
              about it, so eventually I stopped arguing and tried it.
            </p>

            <p>
              The honest truth? That first cup was awful. I used far too much,
              didn't balance it with anything, and it tasted like a mistake. It
              took me a few weeks of fiddling — a little lemon, some fresh mint,
              the right tea underneath it — before I landed on something I
              actually looked forward to.
            </p>

            <p>
              That was four years ago, and I haven't skipped a morning since.
              Not because it's magic. Because it's <em>mine</em> — ten quiet
              minutes before the house wakes up, a warm cup in my hands,
              something that tastes good and feels like looking after myself.
            </p>

            <p>
              People ask me for the recipe constantly. Here's the thing though:
              there isn't <em>one</em> recipe. What works depends on when you
              drink your tea, whether you take it hot or iced, whether you want
              something bright in the morning or something calmer at night. My
              blend is built around my routine. Yours should be built around
              yours.
            </p>

            <p className="font-semibold text-foreground">
              So before I show you what's in mine, let me ask you five quick
              questions. Takes about twenty seconds — and at the end I'll show
              you the blend that actually fits how you drink tea, and explain
              why the vinegar is in there.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="w-full mt-10 bg-primary hover:bg-primary/90 text-white font-bold text-2xl px-8 py-9 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Take The Quiz →
          </Button>
        </div>
      </div>
    );
  }

  if (done && !revealed) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center leading-tight">
          Preparing your tea…
        </h1>
        <p className="text-foreground/60 text-lg text-center mt-4">
          Matching your answers to the right blend
        </p>
      </div>
    );
  }

  if (done) {
    const picked = toAnswers(answers);
    const result = results[picked.goal] ?? results["All of it"];

    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <img
            src="/images/tea/hero_iced_tea.jpg"
            alt="Herbal iced tea with mint and lemon"
            className="w-full rounded-3xl shadow-xl mb-8"
          />

          <p className="text-primary font-bold text-base uppercase tracking-widest mb-4">
            Based on your answers
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-5">
            Stacey's Secret Tea Recipe
          </h1>

          <p className="text-primary font-bold text-xl mb-4">
            Your match: {result.name}
          </p>

          <p className="text-foreground/70 text-xl leading-relaxed mb-3">
            {result.blurb(picked)}
          </p>

          <p className="text-foreground/70 text-xl leading-relaxed mb-3">
            But the vinegar is only one part of it. What matters just as much
            is the tea underneath — and that's the part most people get wrong.
          </p>

          <p className="text-foreground/70 text-xl leading-relaxed mb-8">
            Stacey walks through the whole thing in the video below.
          </p>

          <a href={BUY_URL} target="_blank" rel="nofollow sponsored" className="block">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-2xl px-8 py-9 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <PlayCircle className="!w-8 !h-8 mr-1" />
              Watch The Video
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <ProgressBar step={step} />

        <img
          src={q.image}
          alt=""
          className="w-full h-52 sm:h-60 object-cover rounded-3xl shadow-lg mb-8"
        />

        <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3 text-center">
          {q.eyebrow}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-8 text-center">
          {q.question}
        </h1>

        <div className="space-y-4">
          {q.options.map((option) => (
            <button
              key={option}
              onClick={() => choose(option)}
              className="w-full text-center text-2xl font-semibold text-foreground bg-card border-2 border-border rounded-2xl py-6 px-6 hover:border-primary hover:bg-primary/5 active:scale-[0.98] transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
