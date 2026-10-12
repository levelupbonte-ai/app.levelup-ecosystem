import { NextRequest, NextResponse } from "next/server";

import { sendEmailBody } from "@/lib/api-schemas";
import {
  getInternalLeadAlertHtml,
  getPreviewRequestEmailHtml,
  getWeddingSimulationEmailHtml,
} from "@/lib/email-templates";
import { clientIp, guardSubmission } from "@/lib/form-guard";
import { TEAM_INBOX, sendBrandedEmail } from "@/lib/resend";
import { registerSubmission } from "@/lib/supabase";

const GENERIC_ERROR = "Something went wrong. Please try again later.";
const NOT_SENT = "Your request could not be sent. Please try again later.";

/**
 * Public form endpoint (wedding RSVP demo, preview requests).
 * Validated with Zod (bounded fields), protected by honeypot + time-to-submit +
 * a per-IP window here and by the database rate limits of submit_form.
 * Answers are generic: no stack traces, no provider or database messages.
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (raw.length > 16 * 1024) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Anti-spam first: bots get a normal-looking success and nothing is stored or sent.
    const signals = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
    const guard = guardSubmission({
      honeypot: signals.botTrap || signals.honeypot || signals.hp,
      startedAt: signals.startedAt,
      ip: clientIp(req.headers),
      bucket: "send-email",
      max: 6,
      windowMs: 10 * 60 * 1000,
    });
    if (guard === "bot") return NextResponse.json({ success: true, filtered: true });
    if (guard === "rate_limited") {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const parsed = sendEmailBody.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Some information is missing or invalid." }, { status: 400 });
    }
    const body = parsed.data;

    // 1. Simulation RSVP for the wedding demo
    if (body.type === "wedding_rsvp") {
      const cleanNom = body.nom || "Valued Guest";
      const cleanInviteCode = body.inviteCode || "WEDDING-SAMPLE";
      const cleanTelephone = body.telephone || "";
      const cleanSlotTime = body.slotTime || "";

      // The RSVP is stored only through submit_form (form_submissions, type "registration").
      const gate = await registerSubmission({
        formType: "registration",
        name: cleanNom,
        email: body.email,
        phone: cleanTelephone,
        data: {
          kind: "rsvp",
          event: "wedding_invitation",
          invite_code: cleanInviteCode,
          slot_time: cleanSlotTime || null,
        },
        source: "wedding_demo",
      });
      // Fail closed: no e-mail unless the submission was accepted by the database.
      if (gate !== "ok") {
        return gate === "rate_limited"
          ? NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
          : NextResponse.json({ error: NOT_SENT }, { status: 503 });
      }

      const sendSuccess = await sendBrandedEmail({
        to: body.email,
        subject: "RSVP Confirmation — Le Dernier Retrouvailles (Simulation Demo)",
        html: getWeddingSimulationEmailHtml({
          name: cleanNom.split(/\s+/)[0].slice(0, 40),
          inviteCode: cleanInviteCode,
          telephone: cleanTelephone,
        }),
      });

      return NextResponse.json({ success: true, delivered: sendSuccess, type: "wedding_rsvp" });
    }

    // 2. Preview request: auto-responder and internal alert
    const cleanName = body.name || "Friend";
    const cleanCompany = body.company || "";
    const cleanEmployees = body.employees || "";
    const cleanMessage = body.message || "";
    const sanitizedQueuePosition = body.queuePosition ?? 1;
    const isWaitlisted = Boolean(body.isWaitlisted);

    const gate = await registerSubmission({
      formType: "preview_request",
      name: cleanName,
      email: body.email,
      company: cleanCompany,
      message: cleanMessage,
      data: { employees: cleanEmployees, is_waitlisted: isWaitlisted },
      source: "website_contact",
    });
    // Fail closed: no e-mail unless the submission was accepted by the database.
    if (gate !== "ok") {
      return gate === "rate_limited"
        ? NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
        : NextResponse.json({ error: NOT_SENT }, { status: 503 });
    }

    // Auto-reply to whatever address was typed: first name only, no visitor free text.
    const clientDelivered = await sendBrandedEmail({
      to: body.email,
      subject: "We Received Your Free Mobile Preview Request — LevelUp Ecosystem",
      html: getPreviewRequestEmailHtml({
        name: cleanName.split(/\s+/)[0].slice(0, 40),
        isWaitlisted: false,
        queuePosition: 1,
      }),
    });
    const teamAlertDelivered = await sendBrandedEmail({
      sender: "system",
      to: TEAM_INBOX,
      subject: `[New Lead] ${cleanName}${cleanCompany ? ` (${cleanCompany})` : ""}${isWaitlisted ? ` [Queue #${sanitizedQueuePosition}]` : ""}`,
      html: getInternalLeadAlertHtml({
        name: cleanName,
        email: body.email,
        company: cleanCompany,
        employees: cleanEmployees,
        message: cleanMessage,
        isWaitlisted,
        queuePosition: sanitizedQueuePosition,
      }),
    });

    return NextResponse.json({
      success: true,
      delivered: clientDelivered,
      teamAlertDelivered,
      isWaitlisted,
      queuePosition: sanitizedQueuePosition,
    });
  } catch (err: unknown) {
    // Logged on the server only; the visitor gets a generic answer.
    // eslint-disable-next-line no-console
    console.error("[send-email]", err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
