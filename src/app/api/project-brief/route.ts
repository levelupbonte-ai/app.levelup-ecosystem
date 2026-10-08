import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { generateText } from "@/lib/ai/router";
import { registerSubmission } from "@/lib/supabase";

// "Start a project" studio: saves the brief in the LevelUp database (quote request)
// and returns a short AI recap of the project for the visitor.
//
// Quota protection: the AI runs at most once per *accepted* brief, and briefs go
// through submit_form, which the database rate-limits (5 per contact and 300 per
// site per hour). A per-instance IP limit, a small prompt and a capped output
// keep each call cheap; if the AI is unavailable the brief is still saved.

const MAX_PER_IP_PER_DAY = 3;
const ipHits = new Map<string, { day: string; count: number }>();

const Answer = z.union([z.string().max(2000), z.array(z.string().max(200)).max(30), z.number()]);
const Body = z.object({
  id: z.string().regex(/^LU-\d{5}$/),
  type: z.string().max(120),
  category: z.string().max(120),
  complexity: z.string().max(20).optional(),
  eta_min: z.string().max(20).optional(),
  eta_max: z.string().max(20).optional(),
  answers: z.record(z.string().max(40), Answer).refine((a) => Object.keys(a).length <= 60),
});

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

const str = (v: unknown) => (typeof v === "string" ? v.trim() : Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v));

async function recap(brief: z.infer<typeof Body>): Promise<string | null> {
  const lines = Object.entries(brief.answers)
    .filter(([k]) => !["cname", "email", "phone"].includes(k))
    .map(([k, v]) => `- ${k}: ${str(v).slice(0, 300)}`)
    .join("\n");
  const prompt = `You are the project lead at LevelUp Ecosystem, a web engineering studio.
A visitor just submitted this project brief. Write a short, warm recap for them
in the language of their answers (default English): 3 to 5 sentences covering what
we understood, the key pages/features we recommend, and one smart suggestion.
No prices, no promises of dates, no markdown headings, no emojis, plain text only.

Project type: ${brief.type} (${brief.category})
Answers:
${lines}`;
  try {
    // "site" route: free fast models first (Groq, Mistral), Gemini as fallback.
    const text = await generateText("site", {
      prompt: prompt.slice(0, 6000),
      maxTokens: 260,
      temperature: 0.5,
    });
    return text.trim().slice(0, 1200) || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const brief = parsed.data;
  const a = brief.answers;
  const email = str(a.email).toLowerCase();
  if (!z.string().email().max(254).safeParse(email).success) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const saved = await registerSubmission({
    formType: "quote",
    name: str(a.cname).slice(0, 120) || undefined,
    email,
    phone: str(a.phone).slice(0, 40) || undefined,
    company: str(a.org).slice(0, 160) || undefined,
    message: `${brief.type} — ${brief.category}`,
    data: { reference: brief.id, ...brief },
    source: "start-project",
  });
  if (saved === "rate_limited") return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  if (saved !== "ok") return NextResponse.json({ error: "unavailable" }, { status: 503 });

  // Vercel sets x-vercel-forwarded-for / x-real-ip itself; a client-supplied
  // x-forwarded-for value is only a last resort.
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown";
  const summary = allowIp(ip) ? await recap(brief) : null;
  return NextResponse.json({ reference: brief.id, summary });
}
