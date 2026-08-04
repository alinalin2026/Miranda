import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";
import { sendEmail } from "./_lib/resend";
import { buildRecipeEmail } from "./_lib/email-templates";

export const config = { runtime: "edge" };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  let body: {
    email?: string;
    name?: string;
    memory?: string;
    answers?: Record<string, string>;
    result?: string;
    source?: string;
  };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 40) : "";
  const memory = typeof body.memory === "string" ? body.memory.trim().slice(0, 280) : "";
  const answers = body.answers ?? {};
  const result = body.result ?? "";

  // Send inline rather than fire-and-forget: this is a plain fetch
  // handler with no ExecutionContext.waitUntil to keep work alive after
  // the response returns, so an un-awaited send would just get killed
  // mid-flight. The quiz page's "ink drying" beat (~2s) already masks
  // this latency, and sendEmail has its own 8s timeout so a slow Resend
  // API can't hang the quiz completion.
  const { subject, html, text } = buildRecipeEmail({ name, answers, resultName: result });
  const sendResult = await sendEmail({ to: email, subject, html, text });

  try {
    const redis = getRedis();
    const record = {
      ts: Date.now(),
      email,
      name,
      memory,
      answers,
      result,
      source: body.source ?? "quiz",
      emailSent: sendResult.ok,
      emailSentAt: sendResult.ok ? Date.now() : null,
      emailError: sendResult.ok ? null : sendResult.error ?? null,
    };

    await Promise.all([
      redis.hset(keys.quizLeadsByEmail, { [email]: JSON.stringify(record) }),
      redis.incr(keys.quizLeadCount),
    ]);

    return new Response(JSON.stringify({ ok: true, emailSent: sendResult.ok }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("quiz-lead failed", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Redis error: ${message}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
