"use server";

import { headers } from "next/headers";

import { actionClient } from "./safe-action";

import {
  getInternalLeadAlertHtml,
  getPreviewRequestEmailHtml,
} from "@/lib/email-templates";
import {
  FormError,
  RATE_LIMITED_MESSAGE,
  clientIp,
  guardSubmission,
} from "@/lib/form-guard";
import { serverFormSchema } from "@/lib/form-schema";
import { TEAM_INBOX, sendBrandedEmail } from "@/lib/resend";
import { registerSubmission } from "@/lib/supabase";

export const serverAction = actionClient
  .inputSchema(serverFormSchema)
  .action(async ({ parsedInput }) => {
    const isWaitlisted = false;
    const queuePosition = 1;

    // Anti-spam: honeypot + time-to-submit + per-IP window (the database adds
    // its own limits below). Bots get a normal-looking success, nothing is sent.
    const guard = guardSubmission({
      honeypot: parsedInput.hp,
      startedAt: parsedInput.startedAt,
      ip: clientIp(await headers()),
      bucket: "contact",
      max: 5,
      windowMs: 10 * 60 * 1000,
    });
    if (guard === "bot") {
      return {
        success: true,
        isWaitlisted,
        emailDelivered: false,
        message: "Thank you! Our team has received your request.",
      };
    }
    if (guard === "rate_limited") throw new FormError(RATE_LIMITED_MESSAGE);

    // Stored only through the rate-limited submit_form RPC (form_submissions).
    const gate = await registerSubmission({
      formType: "preview_request",
      name: parsedInput.name.slice(0, 120),
      email: parsedInput.email.trim().toLowerCase(),
      company: parsedInput.company?.slice(0, 120) || "",
      message: parsedInput.message.slice(0, 3000),
      data: {
        employees: parsedInput.employees?.slice(0, 50) || "",
        is_waitlisted: isWaitlisted,
      },
      source: "contact_form_server_action",
    });
    // Fail closed: no e-mail at all unless the submission was accepted (rate limits,
    // valid e-mail, feature enabled). Anything else could turn this into a mail relay.
    if (gate !== "ok") {
      throw new FormError(
        gate === "rate_limited"
          ? RATE_LIMITED_MESSAGE
          : "Your request could not be sent. Please try again later.",
      );
    }

    // 3. Automated email dispatch via Resend
    // The auto-reply goes to whatever address was typed: greet by first name only
    // and never echo free text the visitor wrote.
    const emailDelivered = await sendBrandedEmail({
      to: parsedInput.email,
      subject: isWaitlisted
        ? "Priority Waitlist: Your Website Preview Request — LevelUp Ecosystem"
        : "We Received Your Free Mobile Preview Request — LevelUp Ecosystem",
      html: getPreviewRequestEmailHtml({
        name: parsedInput.name.split(/\s+/)[0].slice(0, 40),
        isWaitlisted,
        queuePosition,
      }),
    });
    await sendBrandedEmail({
      sender: "system",
      to: TEAM_INBOX,
      subject: `[New Lead] ${parsedInput.name}${parsedInput.company ? ` (${parsedInput.company})` : ""}${isWaitlisted ? " [Priority Waitlist]" : ""}`,
      html: getInternalLeadAlertHtml({
        name: parsedInput.name,
        email: parsedInput.email,
        company: parsedInput.company,
        employees: parsedInput.employees,
        message: parsedInput.message,
        isWaitlisted,
        queuePosition,
      }),
    });

    return {
      success: true,
      isWaitlisted,
      emailDelivered,
      message: isWaitlisted
        ? "High demand notice: Immediate build capacity is currently full. Your request has been placed on our priority waitlist (estimated 3 to 5 business days turnaround). Our team will review your project details as soon as a slot opens."
        : "Thank you! Our team has received your request and will prepare your free interactive mobile preview within 24 to 48 hours.",
    };
  });

