import { NextRequest, NextResponse } from "next/server";

import {
  getInternalLeadAlertHtml,
  getPreviewRequestEmailHtml,
  getWeddingSimulationEmailHtml,
} from "@/lib/email-templates";
import { isResendConfigured, resend } from "@/lib/resend";
import { recordBooking, recordLead } from "@/lib/supabase";

// Standard RFC 5322 email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Sanitizes text to prevent HTML injection and XSS inside rendered emails
 */
function sanitize(input: unknown, maxLength = 500): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "") // Strip raw HTML tag brackets
    .trim()
    .slice(0, maxLength);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, botTrap, honeypot } = body;

    // Anti-bot honeypot check: reject automated bot submissions silently
    if (botTrap || honeypot) {
      return NextResponse.json({ success: true, filtered: true });
    }

    // 1. Simulation RSVP for Wedding Demo
    if (type === "wedding_rsvp") {
      const { nom, email, inviteCode, telephone } = body;

      const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 150) {
        return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
      }

      const cleanNom = sanitize(nom, 100) || "Valued Guest";
      const cleanInviteCode = sanitize(inviteCode, 50) || "WEDDING-SAMPLE";
      const cleanTelephone = sanitize(telephone, 30);

      const emailHtml = getWeddingSimulationEmailHtml({
        name: cleanNom,
        inviteCode: cleanInviteCode,
        telephone: cleanTelephone,
      });

      let resendResponse = null;
      let sendSuccess = false;

      if (isResendConfigured() && resend) {
        const primaryFrom = process.env.RESEND_FROM_EMAIL || "LevelStudio <studio@levelup-ecosystem.com>";
        try {
          resendResponse = await resend.emails.send({
            from: primaryFrom,
            to: [cleanEmail],
            subject: "RSVP Confirmation — Le Dernier Retrouvailles (Simulation Demo)",
            html: emailHtml,
          });
          sendSuccess = true;
        } catch {
          try {
            resendResponse = await resend.emails.send({
              from: "LevelStudio <onboarding@resend.dev>",
              to: [cleanEmail],
              subject: "RSVP Confirmation — Le Dernier Retrouvailles (Simulation Demo)",
              html: emailHtml,
            });
            sendSuccess = true;
          } catch (fallbackErr) {
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console
              console.warn("[Resend] Both primary and fallback email send failed:", fallbackErr);
            }
          }
        }
      }

      // Persist RSVP booking into Supabase
      try {
        await recordBooking({
          type: "wedding_rsvp",
          name: cleanNom,
          email: cleanEmail,
          phone: cleanTelephone,
          inviteCode: cleanInviteCode,
          meta: { delivered: sendSuccess, resendId: resendResponse?.data?.id || null },
        });
      } catch (logErr) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[Supabase] Failed to persist wedding RSVP:", logErr);
        }
      }

      return NextResponse.json({
        success: true,
        delivered: sendSuccess,
        type: "wedding_rsvp",
      });
    }

    // 2. Booking / Preview Request Auto-responder & Internal Alert
    if (type === "preview_request") {
      const { name, email, company, employees, message, isWaitlisted, queuePosition } = body;

      const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 150) {
        return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
      }

      const cleanName = sanitize(name, 100) || "Friend";
      const cleanCompany = sanitize(company, 120);
      const cleanEmployees = sanitize(employees, 50);
      const cleanMessage = sanitize(message, 3000);
      const sanitizedQueuePosition = typeof queuePosition === "number" ? Math.max(1, queuePosition) : 1;

      const clientEmailHtml = getPreviewRequestEmailHtml({
        name: cleanName,
        company: cleanCompany,
        isWaitlisted: Boolean(isWaitlisted),
        queuePosition: sanitizedQueuePosition,
        message: cleanMessage,
      });

      const internalAlertHtml = getInternalLeadAlertHtml({
        name: cleanName,
        email: cleanEmail,
        company: cleanCompany,
        employees: cleanEmployees,
        message: cleanMessage,
        isWaitlisted: Boolean(isWaitlisted),
        queuePosition: sanitizedQueuePosition,
      });

      let clientDelivered = false;
      let teamAlertDelivered = false;

      if (isResendConfigured() && resend) {
        try {
          await resend.emails.send({
            from: "LevelUp Ecosystem <contact@levelup-ecosystem.com>",
            to: [cleanEmail],
            subject: isWaitlisted
              ? `Priority Queue (#${sanitizedQueuePosition}): Your Website Preview Request`
              : "We Received Your Free Mobile Preview Request — LevelUp Ecosystem",
            html: clientEmailHtml,
          });
          clientDelivered = true;

          try {
            const systemSender = process.env.RESEND_FROM_EMAIL || "LevelUp System <system@levelup-ecosystem.com>";
            await resend.emails.send({
              from: systemSender,
              to: ["teams@levelup-ecosystem.com"],
              subject: `[New Lead] ${cleanName}${cleanCompany ? ` (${cleanCompany})` : ""}${isWaitlisted ? ` [Queue #${sanitizedQueuePosition}]` : ""}`,
              html: internalAlertHtml,
            });
            teamAlertDelivered = true;
          } catch {
            try {
              await resend.emails.send({
                from: "LevelUp <onboarding@resend.dev>",
                to: ["teams@levelup-ecosystem.com"],
                subject: `[New Lead] ${cleanName}${cleanCompany ? ` (${cleanCompany})` : ""}${isWaitlisted ? ` [Queue #${sanitizedQueuePosition}]` : ""}`,
                html: internalAlertHtml,
              });
              teamAlertDelivered = true;
            } catch (tErr) {
              if (process.env.NODE_ENV === "development") {
                // eslint-disable-next-line no-console
                console.warn("[Resend] Team alert fallback failed:", tErr);
              }
            }
          }
        } catch (resendErr) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.warn("[Resend] Preview request dispatch failed:", resendErr);
          }
        }
      }

      // Persist new client lead directly into Supabase
      try {
        await recordLead({
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          employees: cleanEmployees,
          message: cleanMessage,
          isWaitlisted: Boolean(isWaitlisted),
          queuePosition: sanitizedQueuePosition,
          source: "contact_preview_request",
        });
      } catch (logErr) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[Supabase] Failed to persist client lead:", logErr);
        }
      }

      return NextResponse.json({
        success: true,
        delivered: clientDelivered,
        teamAlertDelivered,
        isWaitlisted: Boolean(isWaitlisted),
        queuePosition: sanitizedQueuePosition,
      });
    }

    return NextResponse.json({ error: "Unknown email type requested" }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
