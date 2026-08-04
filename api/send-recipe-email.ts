import { getRedis } from "./_lib/redis";
import { keys } from "./_lib/keys";
import { sendEmail } from "./_lib/resend";
import { buildRecipeEmail } from "./_lib/email-templates";
import type { LeadRecord } from "./leads";

export const config = { runtime: "edge" };

function parseLead(raw: unknown): LeadRecord | null {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as LeadRecord;
    } catch {
      return null;
    }
  }
  if (raw && typeof raw === "object") {
    return raw as LeadRecord;
  }
  return null;
}

// Manual/bulk (re)send from the admin dashboard -- covers leads whose
// automatic send failed, or anyone captured before this endpoint existed.
export default async function handler(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  let body: { emails?: string[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const emails = Array.isArray(body.emails)
    ? Array.from(new Set(body.emails.map((e) => String(e).trim().toLowerCase()).filter(Boolean)))
    : [];
  if (emails.length === 0) {
    return new Response(JSON.stringify({ error: "No emails provided" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  // Caps a single click from fanning out into hundreds of sends at once --
  // send in a few batches from the dashboard instead.
  if (emails.length > 50) {
    return new Response(JSON.stringify({ error: "Send at most 50 at a time" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const redis = getRedis();
  const results = await Promise.all(
    emails.map(async (email) => {
      const raw = await redis.hget(keys.quizLeadsByEmail, email);
      const lead = parseLead(raw);
      if (!lead) {
        return { email, ok: false, error: "No lead on file for this email" };
      }

      const { subject, html, text } = buildRecipeEmail({
        name: lead.name || "",
        answers: lead.answers || {},
        resultName: lead.result || "",
      });
      const sendResult = await sendEmail({ to: email, subject, html, text });

      const updated: LeadRecord = {
        ...lead,
        emailSent: sendResult.ok,
        emailSentAt: sendResult.ok ? Date.now() : lead.emailSentAt,
        emailError: sendResult.ok ? null : sendResult.error ?? null,
      };
      await redis.hset(keys.quizLeadsByEmail, { [email]: JSON.stringify(updated) });

      return { email, ok: sendResult.ok, error: sendResult.error };
    }),
  );

  return new Response(JSON.stringify({ results }), {
    headers: { "content-type": "application/json" },
  });
}
