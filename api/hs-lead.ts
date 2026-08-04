import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";

export const config = { runtime: "edge" };

// Home-services lead capture. The submitted form IS the conversion here
// (lead buyers pay per qualified lead), so this endpoint is the money
// event -- not a step on the way to one.
//
// Nothing is forwarded to a lead buyer yet: that happens once a network
// is approved and gives us their exact posting spec (field names, and
// usually a TCPA consent string that has to be captured verbatim
// alongside a timestamp). Until then every lead is banked in Redis so no
// traffic is wasted while approval is pending.

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// US phone: 10 digits, optionally +1 prefixed. Lead buyers reject
// anything they can't dial, so a bad number is worth catching here
// rather than discovering it on a rejection report.
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return null;
}

function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip.trim());
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    zip?: string;
    answers?: Record<string, string>;
    vertical?: string;
    source?: string;
    consent?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const name = (body.name || "").trim().slice(0, 60);
  const email = (body.email || "").trim().toLowerCase();
  const phone = normalizePhone(body.phone || "");
  const zip = (body.zip || "").trim();
  const answers = body.answers ?? {};

  if (!name || !isValidEmail(email) || !phone || !isValidZip(zip)) {
    return new Response(JSON.stringify({ error: "Please check your details and try again." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // A lead is only sellable if they own the property -- renters can't
  // authorise the work, and buyers reject (and eventually ban) for them.
  // They still see the full result page; we just never bill for them.
  const qualified = answers.ownership === "I own it";

  try {
    const redis = getRedis();
    const day = todayUTC();
    const entry = JSON.stringify({
      ts: Date.now(),
      name,
      email,
      phone,
      zip,
      answers,
      vertical: body.vertical ?? "gutters",
      source: body.source ?? "quiz",
      consent: body.consent === true,
      qualified,
      // Set once a lead is actually posted to a buyer's API.
      postedToBuyer: false,
    });

    const writes: Promise<unknown>[] = [
      redis.lpush(keys.hsLeads, entry),
      redis.ltrim(keys.hsLeads, 0, 999),
      redis.incr(keys.hsLeadCount),
      redis.incr(keys.hsLeadsDay(day)),
    ];
    if (qualified) writes.push(redis.incr(keys.hsQualifiedDay(day)));

    await Promise.all(writes);

    return new Response(JSON.stringify({ ok: true, qualified }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("hs-lead failed", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `Redis error: ${message}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
