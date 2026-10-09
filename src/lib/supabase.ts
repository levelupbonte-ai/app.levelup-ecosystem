import "server-only";

import { PLATFORM_CONFIGURED, callPlatform } from "@/lib/platform-api";

/**
 * Write layer for levelup-ecosystem.com (server only).
 *
 * All public writes go through the rate-limited `submit_form` RPC of the shared
 * LevelUp database (form_submissions), called with the PUBLISHABLE key only.
 * Site content is read through `get_site_bundle` in lib/levelup-site.ts.
 * The legacy tables (leads, bookings, pricing_plans, projects, faqs,
 * testimonials, entities, site_settings, legal_documents) are no longer used.
 */

/** Form types accepted by submit_form. */
export type SubmissionFormType =
  | "contact"
  | "quote"
  | "vip_signup"
  | "newsletter"
  | "registration"
  | "preview_request";

/** submit_form rejects p_data larger than 8 KB. */
const MAX_DATA_BYTES = 8 * 1024;

/**
 * Registers a public form submission for levelup-ecosystem.com in the shared
 * LevelUp tables (form_submissions) through the rate-limited `submit_form` RPC.
 * Returns "rate_limited" when the visitor exceeded the allowance, so callers
 * can refuse before sending any email.
 */
export async function registerSubmission(input: {
  formType: SubmissionFormType;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  data?: Record<string, unknown>;
  source?: string;
}): Promise<"ok" | "rate_limited" | "unavailable"> {
  if (!PLATFORM_CONFIGURED) return "unavailable";
  const data = input.data || {};
  if (new TextEncoder().encode(JSON.stringify(data)).length > MAX_DATA_BYTES) {
    // eslint-disable-next-line no-console
    console.warn("submit_form data exceeds 8KB, not sent");
    return "unavailable";
  }
  const { status } = await callPlatform("submit_form", {
    p_website_id: process.env.WEBSITE_ID || "ws_6e797257f5b32b86",
    p_form_type: input.formType,
    p_name: input.name || null,
    p_email: input.email,
    p_phone: input.phone || null,
    p_company: input.company || null,
    p_message: input.message || null,
    p_data: data,
    p_source: input.source || "website",
  });
  if (status === 429) return "rate_limited";
  if (status < 200 || status >= 300) {
    // eslint-disable-next-line no-console
    console.warn("submit_form error:", status);
    return "unavailable";
  }
  return "ok";
}
