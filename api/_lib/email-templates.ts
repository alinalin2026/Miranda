// The recipe email sent after a quiz completion (see api/quiz-lead.ts) and
// on manual/bulk resend from the admin dashboard (see api/send-recipe-email.ts).
//
// Table-based layout with inline styles throughout -- not div/flex -- for
// the widest possible email-client compatibility (Outlook desktop in
// particular only reliably renders table layouts). Caveat is loaded via
// Google Fonts for clients that support it (most webmail, Apple Mail); the
// Georgia serif fallback still reads as a warm, personal recipe card where
// it doesn't.

export interface RecipeEmailInput {
  name: string;
  answers: Record<string, string>;
  resultName: string;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

function teaWordFor(favourite: string | undefined): string {
  return (favourite || "herbal").toLowerCase();
}

function servedFor(temperature: string | undefined): string {
  if (temperature === "Iced") return "over ice";
  if (temperature === "Both") return "hot or over ice";
  return "hot";
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildRecipeEmail({ name, answers, resultName }: RecipeEmailInput): BuiltEmail {
  const teaWord = escapeHtml(teaWordFor(answers.favourite));
  const served = escapeHtml(servedFor(answers.temperature));
  const safeName = name ? escapeHtml(name) : "";
  const safeResult = escapeHtml(resultName || "your match");

  const subject = safeName ? `${safeName}, here's your tea recipe` : "Here's your tea recipe";

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#FBF4E8;font-family:Georgia,'Times New Roman',serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nana's ${teaWord} tea, written out by hand — plus why the vinegar.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF4E8;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="text-align:center;padding-bottom:20px;">
                <p style="margin:0;color:#92400e;font-weight:bold;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">Your match: ${safeResult}</p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#FFFDF5;border-radius:4px;padding:32px 28px;">
                <p style="margin:0 0 2px;text-align:center;font-family:'Caveat',Georgia,serif;font-weight:700;font-size:34px;color:#18120c;">Nana's Morning Tea</p>
                <p style="margin:0 0 22px;text-align:center;font-family:Georgia,serif;font-style:italic;font-size:14px;color:#78716c;">(the way she taught me${safeName ? ` — for ${safeName}` : ""})</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
                  <tr><td style="font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.55;padding:2px 0;">• 1 cup ${teaWord} tea, brewed strong</td></tr>
                  <tr><td style="font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.55;padding:2px 0;">• juice of half a lemon</td></tr>
                  <tr><td style="font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.55;padding:2px 0;">• a few fresh mint leaves, torn</td></tr>
                  <tr><td style="font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.55;padding:2px 0;">• 1 teaspoon honey</td></tr>
                  <tr><td style="font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.55;padding:2px 0;">• 1 small splash of apple cider vinegar</td></tr>
                </table>
                <p style="margin:0 0 4px;font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.5;">Brew the tea, let it sit 5 min.</p>
                <p style="margin:0 0 4px;font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.5;">Stir everything in while it's warm.</p>
                <p style="margin:0 0 18px;font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;line-height:1.5;">Serve it ${served}. Sip it slow — don't rush.</p>
                <p style="margin:0;font-family:'Caveat',Georgia,serif;font-weight:700;font-size:26px;color:#18120c;line-height:1.4;">The vinegar is the whole secret. Just a splash — don't overdo it! ♡</p>
                <p style="margin:14px 0 0;text-align:right;font-family:'Caveat',Georgia,serif;font-weight:600;font-size:26px;color:#18120c;">— made with love, Miranda x</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 4px 0;">
                <h2 style="margin:0 0 10px;font-family:Georgia,serif;font-size:19px;color:#1c1917;">So — why the vinegar?</h2>
                <p style="margin:0 0 12px;font-family:Georgia,serif;font-size:15px;line-height:1.7;color:#44403c;">Here's the part Nana never spelled out. She grew up on a farm, and out there they drank something called a <strong>switchel</strong> — water, a little vinegar, some ginger and honey — to cool off after working in the fields. It goes back hundreds of years.</p>
                <p style="margin:0 0 12px;font-family:Georgia,serif;font-size:15px;line-height:1.7;color:#44403c;">She never called it health food. She just said the splash of vinegar &quot;woke the drink up.&quot; That little sour edge balances the honey and the tea so the whole cup tastes cleaner and more alive.</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:15px;line-height:1.7;color:#44403c;">That's the whole secret. No magic — just an old farmhouse habit that happens to taste wonderful. A teaspoon is plenty. Any more and you've made a salad dressing.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 4px 0;border-top:1px solid #E6DEC5;margin-top:8px;">
                <p style="margin:18px 0 0;font-family:Georgia,serif;font-size:12px;line-height:1.6;color:#a8a29e;">You're getting this because you completed the tea quiz at mirandareviews.com. If that wasn't you, just ignore it — you won't hear from us again unless you take the quiz yourself.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Nana's Morning Tea (the way she taught me${name ? ` — for ${name}` : ""})

Your match: ${resultName || "your match"}

- 1 cup ${teaWordFor(answers.favourite)} tea, brewed strong
- juice of half a lemon
- a few fresh mint leaves, torn
- 1 teaspoon honey
- 1 small splash of apple cider vinegar

Brew the tea, let it sit 5 min. Stir everything in while it's warm. Serve it ${servedFor(answers.temperature)}. Sip it slow — don't rush.

The vinegar is the whole secret. Just a splash — don't overdo it!
— made with love, Miranda x

So — why the vinegar?
Nana grew up on a farm, and out there they drank something called a switchel -- water, a little vinegar, some ginger and honey -- to cool off after working in the fields. It goes back hundreds of years. She never called it health food, she just said the splash "woke the drink up." That little sour edge balances the honey and the tea so the whole cup tastes cleaner and more alive. That's the whole secret -- no magic, just an old farmhouse habit that happens to taste wonderful.

You're getting this because you completed the tea quiz at mirandareviews.com.`;

  return { subject, html, text };
}
