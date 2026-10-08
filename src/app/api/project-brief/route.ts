import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { generateTextWithTarget, type AiTarget } from "@/lib/ai/router";
import {
  getProjectRequestAlertHtml,
  getProjectRequestReceivedHtml,
} from "@/lib/email-templates";
import {
  qualifyProjectRequest,
  recordQualification,
  submitProjectRequest,
  type ProjectRequestPayload,
} from "@/lib/project-requests";
import { TEAM_INBOX, sendBrandedEmail } from "@/lib/resend";
import { registerSubmission } from "@/lib/supabase";

// "Start a project" studio. The finished brief is:
//   1. registered through submit_form (quote request, database rate limit:
//      5 per contact and 300 per site per hour),
//   2. stored in project_requests through submit_project_request (5 per e-mail
//      per day), which hands back a one-time qualification token,
//   3. qualified by the AI (strict JSON, validated here and again in the
//      database; any failure means verdict "review"), recorded once with the token,
//   4. sent to the team by e-mail with the score, verdict and summary.
// The visitor never sees the verdict: a request without a real business is
// simply pointed to the free LevelStudio preview.
//
// Quota protection: AI runs only for accepted requests, a per-instance IP limit
// caps the visitor recap, prompts are small and outputs capped.

const MAX_PER_IP_PER_DAY = 3;
const ipHits = new Map<string, { day: string; count: number }>();

const Answer = z.union([
  z.string().max(2000),
  z.array(z.string().max(300)).max(30),
  z.number(),
]);
const Body = z.object({
  id: z.string().regex(/^LU-\d{5}$/),
  type: z.string().max(120),
  category: z.string().max(120),
  complexity: z.string().max(20).optional(),
  eta_min: z.string().max(20).optional(),
  eta_max: z.string().max(20).optional(),
  locale: z.enum(["fr", "en"]).optional(),
  answers: z
    .record(z.string().max(40), Answer)
    .refine((a) => Object.keys(a).length <= 70),
});
type Brief = z.infer<typeof Body>;

function allowIp(ip: string): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const hit = ipHits.get(ip);
  if (!hit || hit.day !== day) {
    if (ipHits.size > 5000) ipHits.clear();
    ipHits.set(ip, { day, count: 1 });
    return true;
  }
  hit.count += 1;
  return hit.count <= MAX_PER_IP_PER_DAY;
}

const str = (v: unknown) =>
  typeof v === "string"
    ? v.trim()
    : Array.isArray(v)
      ? v.join(", ")
      : v == null
        ? ""
        : String(v);
const opt = (v: unknown, max: number) => str(v).slice(0, max) || null;

/** Keys the visitor typed as contact or qualification details (not repeated in prompts). */
const CONTACT_KEYS = ["cname", "email", "phone"];
const QUALIFY_KEYS = [
  "hb",
  "stage",
  "age",
  "biz",
  "sector",
  "web",
  "ig",
  "fb",
  "gmb",
  "tt",
  "olink",
  "reg",
  "proof",
  "act",
];

/** URL-looking tokens (with or without scheme) from free text. */
function links(text: string, max = 8): string[] {
  return text
    .split(/[\s,;]+/)
    .map((t) => t.trim().replace(/[).]+$/, ""))
    .filter((t) =>
      /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(t),
    )
    .slice(0, max)
    .map((t) => t.slice(0, 300));
}

function toPayload(brief: Brief): ProjectRequestPayload {
  const a = brief.answers;
  const hb = str(a.hb);
  const social = ["ig", "fb", "gmb", "tt", "olink"]
    .map((k) => str(a[k]).slice(0, 300))
    .filter(Boolean);
  const proof = str(a.proof);
  return {
    locale: brief.locale ?? "en",
    name: str(a.cname).slice(0, 120),
    email: str(a.email).toLowerCase().slice(0, 254),
    phone: opt(a.phone, 40),
    business_name: (str(a.biz) || str(a.name) || str(a.org)).slice(0, 160),
    has_business: /^(yes|oui)$/i.test(hb)
      ? true
      : /^(no|non)$/i.test(hb)
        ? false
        : null,
    business_stage: opt(a.stage, 80),
    sector: opt(a.sector, 120),
    business_age: opt(a.age, 60),
    website: opt(a.web, 300) ?? opt(a.url, 300),
    social_links: social,
    registration_number: opt(a.reg, 40),
    proof_links: links(proof),
    budget: opt(a.budget, 60),
    timeline: opt(a.when, 60),
    project_type: `${brief.type} (${brief.category})`.slice(0, 120),
    activity:
      opt(a.act, 2000) ??
      opt(a.does, 2000) ??
      opt(a.idea, 2000) ??
      opt(a.what, 2000) ??
      opt(a.svc, 2000),
    brief: {
      reference: brief.id,
      type: brief.type,
      category: brief.category,
      complexity: brief.complexity ?? null,
      eta_min: brief.eta_min ?? null,
      eta_max: brief.eta_max ?? null,
      proof_text: proof.slice(0, 2000) || null,
      answers: a,
    },
  };
}

function answerLines(brief: Brief, skip: string[]): string {
  return Object.entries(brief.answers)
    .filter(([k]) => !skip.includes(k))
    .map(([k, v]) => `- ${k}: ${str(v).slice(0, 300)}`)
    .join("\n");
}

async function recap(
  brief: Brief,
): Promise<{ text: string; target: AiTarget } | null> {
  const prompt = `You are the project lead at LevelUp Ecosystem, a web engineering studio.
A visitor just submitted this project brief. Write a short, warm recap for them
in ${brief.locale === "fr" ? "French" : "the language of their answers (default English)"}: 3 to 5 sentences covering what
we understood, the key pages/features we recommend, and one smart suggestion.
No prices, no promises of dates, no markdown headings, no emojis, plain text only.

Project type: ${brief.type} (${brief.category})
Answers:
${answerLines(brief, CONTACT_KEYS)}`;
  try {
    // "site" route: free fast models first (Groq, Mistral), Gemini as fallback.
    const { text, target } = await generateTextWithTarget("site", {
      prompt: prompt.slice(0, 6000),
      maxTokens: 260,
      temperature: 0.5,
      timeoutMs: 9000,
    });
    const clean = text.trim().slice(0, 1200);
    return clean ? { text: clean, target } : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  const brief = parsed.data;
  const payload = toPayload(brief);
  if (!z.string().email().max(254).safeParse(payload.email).success) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!payload.name || !payload.business_name) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Existing quote pipeline: also the per-contact / per-site rate gate.
  const saved = await registerSubmission({
    formType: "quote",
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? undefined,
    company: payload.business_name,
    message: `${brief.type} — ${brief.category}`,
    data: { reference: brief.id, ...brief },
    source: "start-project",
  });
  if (saved === "rate_limited")
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const stored = await submitProjectRequest(payload);
  if (!stored.ok) {
    if (stored.reason === "rate_limited")
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    if (stored.reason === "invalid")
      return NextResponse.json({ error: "incomplete" }, { status: 400 });
    if (saved !== "ok")
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  // Vercel sets x-vercel-forwarded-for / x-real-ip itself; a client-supplied
  // x-forwarded-for value is only a last resort.
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown";

  const [qualification, summary] = await Promise.all([
    qualifyProjectRequest(
      payload,
      answerLines(brief, [...CONTACT_KEYS, ...QUALIFY_KEYS]),
    ),
    allowIp(ip) ? recap(brief) : Promise.resolve(null),
  ]);

  let verdict = qualification.result.verdict;
  if (stored.ok) {
    const calls = [
      ...(qualification.call ? [qualification.call] : []),
      ...(summary ? [{ task: "site", target: summary.target }] : []),
    ];
    verdict = await recordQualification(
      stored.id,
      stored.token,
      qualification.result,
      calls,
    );
  }
  const declined = verdict === "rejected";

  const alert = sendBrandedEmail({
    sender: "system",
    to: TEAM_INBOX,
    subject: `[Projet ${verdict === "qualified" ? "qualifié" : declined ? "non qualifié" : "à vérifier"}${qualification.result.score != null ? ` ${qualification.result.score}/100` : ""}] ${payload.business_name} — ${brief.type}`,
    html: getProjectRequestAlertHtml({
      reference: brief.id,
      requestId: stored.ok ? stored.id : null,
      payload,
      qualification: { ...qualification.result, verdict },
      recap: summary?.text ?? null,
    }),
  });
  // Confirmation to the visitor only when we will actually follow up.
  const receipt = declined
    ? Promise.resolve(false)
    : sendBrandedEmail({
        to: payload.email,
        subject:
          payload.locale === "fr"
            ? `Votre projet ${brief.id} est bien reçu — LevelUp Ecosystem`
            : `We received your project ${brief.id} — LevelUp Ecosystem`,
        html: getProjectRequestReceivedHtml({
          locale: payload.locale,
          name: payload.name.split(/\s+/)[0].slice(0, 40),
          reference: brief.id,
        }),
      });
  await Promise.all([alert, receipt]);

  return NextResponse.json({
    reference: brief.id,
    summary: declined ? null : (summary?.text ?? null),
    followup: declined ? "studio" : "contact",
  });
}
