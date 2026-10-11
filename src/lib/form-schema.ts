import * as z from "zod";

export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, "");

export const formSchema = z.object({
  name: z
    .string({ message: "This field is required" })
    .transform(clean)
    .pipe(z.string().trim().min(1, "This field is required").max(100)),
  email: z
    .string({ message: "This field is required" })
    .trim()
    .toLowerCase()
    .max(150)
    .pipe(z.email({ message: "Please enter a valid email" })),
  company: z.string().transform(clean).pipe(z.string().trim().max(120)).optional(),
  employees: z.string().min(1, "Please select an item").max(50).optional(),
  message: z
    .string({ message: "This field is required" })
    .transform(clean)
    .pipe(z.string().trim().min(1, "This field is required").max(3000)),
  agree: z.literal(true, { message: "This field is required" }),
});

/**
 * What the server action receives: the visitor's fields plus the anti-spam
 * signals (never shown to the visitor): `hp` is the honeypot, which must stay
 * empty, and `startedAt` is when the form was displayed.
 */
export const serverFormSchema = formSchema.extend({
  hp: z.string().max(200).optional(),
  startedAt: z.number().int().optional(),
});

/** The hero prompt box (opens LevelStudio with the text as brief). */
export const PROMPT_MAX = 500;
export const promptSchema = z
  .string()
  .transform(clean)
  .transform((v) => v.replace(/\s+/g, " ").trim())
  .pipe(z.string().min(1).max(PROMPT_MAX));
