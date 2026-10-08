"use server";

import { actionClient } from "./safe-action";

import {
  getInternalLeadAlertHtml,
  getPreviewRequestEmailHtml,
} from "@/lib/email-templates";
import { formSchema } from "@/lib/form-schema";
import { isResendConfigured, resend } from "@/lib/resend";
import { registerSubmission } from "@/lib/supabase";

export const serverAction = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput }) => {
    const isWaitlisted = false;
    const queuePosition = 1;

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
      throw new Error(
        gate === "rate_limited"
          ? "Too many requests. Please try again later."
          : "Your request could not be sent. Please try again later.",
      );
    }

    // 3. Automated email dispatch via Resend
    let emailDelivered = false;
    if (isResendConfigured() && resend) {
      try {
        // The auto-reply goes to whatever address was typed: greet by first name only
        // and never echo free text the visitor wrote.
        const clientHtml = getPreviewRequestEmailHtml({
          name: parsedInput.name.split(/\s+/)[0].slice(0, 40),
          isWaitlisted,
          queuePosition,
        });

        const primaryFrom = process.env.RESEND_FROM_EMAIL || "LevelUp Ecosystem <contact@levelup-ecosystem.com>";
        try {
          await resend.emails.send({
            from: primaryFrom,
            to: [parsedInput.email],
            subject: isWaitlisted
              ? "Priority Waitlist: Your Website Preview Request — LevelUp Ecosystem"
              : "We Received Your Free Mobile Preview Request — LevelUp Ecosystem",
            html: clientHtml,
          });
          emailDelivered = true;
        } catch {
          // If custom domain is not verified yet, fallback to default Resend test sender
          try {
            await resend.emails.send({
              from: "LevelUp <onboarding@resend.dev>",
              to: [parsedInput.email],
              subject: isWaitlisted
                ? "Priority Waitlist: Your Website Preview Request — LevelUp Ecosystem"
                : "We Received Your Free Mobile Preview Request — LevelUp Ecosystem",
              html: clientHtml,
            });
            emailDelivered = true;
          } catch (fallbackErr) {
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console
              console.warn("[Resend] Both primary and fallback email send failed:", fallbackErr);
            }
          }
        }

        // Internal team notification sent to teams@levelup-ecosystem.com (auto-forwarded to Gmail)
        const teamHtml = getInternalLeadAlertHtml({
          name: parsedInput.name,
          email: parsedInput.email,
          company: parsedInput.company,
          employees: parsedInput.employees,
          message: parsedInput.message,
          isWaitlisted,
          queuePosition,
        });

        // Internal team notification
        try {
          const systemFrom = process.env.RESEND_FROM_EMAIL || "LevelUp System <system@levelup-ecosystem.com>";
          await resend.emails.send({
            from: systemFrom,
            to: ["teams@levelup-ecosystem.com"],
            subject: `[New Lead] ${parsedInput.name}${parsedInput.company ? ` (${parsedInput.company})` : ""}${isWaitlisted ? " [Priority Waitlist]" : ""}`,
            html: teamHtml,
          });
        } catch {
          try {
            await resend.emails.send({
              from: "LevelUp <onboarding@resend.dev>",
              to: ["teams@levelup-ecosystem.com"],
              subject: `[New Lead] ${parsedInput.name}${parsedInput.company ? ` (${parsedInput.company})` : ""}${isWaitlisted ? " [Priority Waitlist]" : ""}`,
              html: teamHtml,
            });
          } catch (teamFallbackErr) {
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console
              console.warn("[Resend] Team email fallback send failed:", teamFallbackErr);
            }
          }
        }
      } catch (emailErr) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("[Resend] Failed to send preview email:", emailErr);
        }
      }
    }

    return {
      success: true,
      isWaitlisted,
      emailDelivered,
      message: isWaitlisted
        ? "High demand notice: Immediate build capacity is currently full. Your request has been placed on our priority waitlist (estimated 3 to 5 business days turnaround). Our team will review your project details as soon as a slot opens."
        : "Thank you! Our team has received your request and will prepare your free interactive mobile preview within 24 to 48 hours.",
    };
  });

