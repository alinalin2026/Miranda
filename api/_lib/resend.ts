const RESEND_API_URL = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// Calls Resend's REST API directly rather than the `resend` npm package --
// same reasoning as api/quiz-note.ts's Anthropic fix: SDKs built for Node
// tend to reference node:fs/node:path somewhere in their bundle, and
// Vercel's Edge runtime rejects that at build time even for code paths
// this handler never touches. A plain fetch has no such baggage.
//
// Requires RESEND_FROM_EMAIL's domain to be verified in Resend (SPF/DKIM
// records at the registrar) -- until then Resend will reject or hold
// sends to anyone other than the account owner's own address.
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const from = process.env.RESEND_FROM_EMAIL || "Miranda <miranda@mirandareviews.com>";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${bodyText.slice(0, 300)}` };
    }

    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  } finally {
    clearTimeout(timeout);
  }
}
