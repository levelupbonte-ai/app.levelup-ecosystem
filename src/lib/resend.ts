import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_"));
}

/**
 * Every e-mail leaves from the LevelUp domain (verified in Resend), never from a
 * third-party sender. RESEND_FROM_EMAIL overrides the public sender if needed.
 */
const SENDERS = {
  contact: process.env.RESEND_FROM_EMAIL || "LevelUp Ecosystem <contact@levelup-ecosystem.com>",
  system: "LevelUp System <system@levelup-ecosystem.com>",
} as const;

export const TEAM_INBOX = "teams@levelup-ecosystem.com";

/** Sends one branded e-mail; true only when Resend accepted it. Never throws. */
export async function sendBrandedEmail(message: {
  to: string;
  subject: string;
  html: string;
  sender?: keyof typeof SENDERS;
}): Promise<boolean> {
  if (!isResendConfigured() || !resend) return false;
  try {
    const { error } = await resend.emails.send({
      from: SENDERS[message.sender ?? "contact"],
      to: [message.to],
      replyTo: "contact@levelup-ecosystem.com",
      subject: message.subject,
      html: message.html,
    });
    if (error && process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[Resend] send rejected:", error.name);
    }
    return !error;
  } catch {
    return false;
  }
}
