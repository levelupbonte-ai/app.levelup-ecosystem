import "server-only";

/**
 * Anti-spam helpers shared by every public form of the showcase:
 *
 *  1. honeypot: a field real visitors never see; any value means a bot,
 *  2. time-to-submit: a form submitted faster than a human can type (or with a
 *     missing / impossible timestamp) is a bot,
 *  3. rate limit: a best-effort in-memory window per IP address.
 *
 * The authoritative rate limit lives in the database (`submit_form` and
 * `submit_project_request` count submissions per contact and per site, and
 * answer 429); this in-memory limit only stops a flood earlier and is per
 * server instance (serverless instances do not share it), so it is never the
 * only protection.
 *
 * Bots get a normal-looking success response, so they learn nothing.
 */

export const MIN_FILL_MS = 2_500;
export const MAX_FORM_AGE_MS = 48 * 60 * 60 * 1000;

export type GuardResult = "ok" | "bot" | "rate_limited";

/** Visitor IP as seen by the platform proxy (first hop only, bounded). */
export function clientIp(headers: Headers): string {
  const raw =
    headers.get("x-real-ip") ||
    headers.get("x-vercel-forwarded-for") ||
    headers.get("x-forwarded-for") ||
    "";
  return raw.split(",")[0].trim().slice(0, 64) || "unknown";
}

/** `startedAt` is the epoch (ms) at which the visitor's form was displayed. */
export function fillTimeIsHuman(startedAt: unknown, now = Date.now()): boolean {
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) return false;
  const elapsed = now - startedAt;
  return elapsed >= MIN_FILL_MS && elapsed <= MAX_FORM_AGE_MS;
}

type Window = { start: number; count: number };
const buckets = new Map<string, Window>();
const MAX_BUCKETS = 10_000;

/** Fixed-window counter. Returns true when the call is allowed. */
export function allow(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  const w = buckets.get(key);
  if (!w || now - w.start >= windowMs) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [k, v] of buckets) if (now - v.start >= windowMs) buckets.delete(k);
      if (buckets.size >= MAX_BUCKETS) buckets.clear();
    }
    buckets.set(key, { start: now, count: 1 });
    return true;
  }
  w.count += 1;
  return w.count <= max;
}

export function guardSubmission(input: {
  honeypot?: unknown;
  startedAt?: unknown;
  /** Skip the time check for flows that have no single "form displayed" moment. */
  skipTiming?: boolean;
  ip: string;
  bucket: string;
  max: number;
  windowMs: number;
}): GuardResult {
  if (typeof input.honeypot === "string" ? input.honeypot.trim() !== "" : input.honeypot != null && input.honeypot !== false) {
    return "bot";
  }
  if (!input.skipTiming && !fillTimeIsHuman(input.startedAt)) return "bot";
  if (!allow(`${input.bucket}:${input.ip}`, input.max, input.windowMs)) return "rate_limited";
  return "ok";
}

/** Error whose message is safe to show to visitors; everything else stays generic. */
export class FormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormError";
  }
}

export const GENERIC_FORM_ERROR = "Something went wrong. Please try again later.";
export const RATE_LIMITED_MESSAGE = "Too many requests. Please try again later.";
