import * as z from "zod";

/**
 * Request bodies of the public JSON routes. Every field is bounded; control
 * characters and angle brackets are stripped from free text.
 */
const text = (max: number, min = 0) =>
  z
    .string()
    .transform((v) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, "").trim())
    .pipe(z.string().min(min).max(max));

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(150)
  .pipe(z.email());

/** Anti-spam signals sent by the public forms (see lib/form-guard). */
const guard = {
  botTrap: z.unknown().optional(),
  honeypot: z.unknown().optional(),
  startedAt: z.number().optional()
};

export const weddingRsvpBody = z.object({
  type: z.literal("wedding_rsvp"),
  nom: text(100).optional(),
  email,
  inviteCode: text(50).optional(),
  telephone: text(30).optional(),
  slotTime: text(50).optional(),
  ...guard
});

export const previewRequestBody = z.object({
  type: z.literal("preview_request"),
  name: text(100).optional(),
  email,
  company: text(120).optional(),
  employees: text(50).optional(),
  message: text(3000).optional(),
  isWaitlisted: z.boolean().optional(),
  queuePosition: z.number().int().min(1).max(10_000).optional(),
  ...guard
});

export const sendEmailBody = z.discriminatedUnion("type", [weddingRsvpBody, previewRequestBody]);
export type SendEmailBody = z.infer<typeof sendEmailBody>;
