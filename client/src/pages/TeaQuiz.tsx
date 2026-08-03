/**
 * Tea Match Quiz
 * Route: /tea-quiz
 *
 * Five one-tap questions, one near-full-screen card each, then a result
 * screen. Questions are deliberately about the visitor's own tastes and
 * goals -- nothing here states what any product does.
 *
 * The result screen's CTA points at /review/all-day-slimming-tea/buy, the
 * server-side redirect in middleware.ts, so the raw affiliate URL never
 * ships in the client bundle and promoter attribution (cookie -> &tid=)
 * keeps working. Reach this page via /tea-quiz (see SHORTCUTS in
 * middleware.ts) to have the click logged and the ref cookie set.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const done = step >= questions.length;

  function choose(option: string) {
    setAnswers((prev) => [...prev, option]);
    setStep((s) => s + 1);
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
            Your match
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-5">
            {result.name}
          </h1>

          <p className="text-foreground/70 text-xl leading-relaxed mb-8">
            {result.blurb(picked)}
          </p>

          <a href={BUY_URL} target="_blank" rel="nofollow sponsored" className="block">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xl px-8 py-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              See My Match →
            </Button>
          </a>

          <p className="text-sm text-foreground/50 leading-relaxed mt-6">
            Sponsored content. We may earn a commission from purchases made
            through this link, at no extra cost to you.
          </p>
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
