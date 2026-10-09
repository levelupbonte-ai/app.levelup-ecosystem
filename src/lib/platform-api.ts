import "server-only";

/**
 * Single server-side gateway to the LevelUp platform's public functions.
 *
 * Browsers never talk to the platform directly: pages, the Project Studio and
 * the public levelup.js tag call our own routes (/api/...), which call these
 * functions from the server. The address and the publishable key therefore
 * stay in server code only. Prefer the non-public env names; the NEXT_PUBLIC_
 * fallbacks are read here, on the server, so they are never inlined into a
 * browser bundle (no client component imports this file).
 */

const BASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

// Publishable key only (or the legacy anon JWT). Never the secret key.
const PUBLIC_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const PLATFORM_CONFIGURED = Boolean(BASE_URL && PUBLIC_KEY);

export interface PlatformResult {
  /** HTTP status of the platform (503 when unreachable or not configured). */
  status: number;
  body: unknown;
}

export interface PlatformCallOptions {
  /**
   * Browser Origin of the visitor, forwarded so the platform's per-website
   * origin allowlist keeps working exactly as when browsers called it directly.
   * Omit for our own server-side calls (same behaviour as before: no Origin).
   */
  origin?: string | null;
  timeoutMs?: number;
  /** Next data cache options (server components only). */
  next?: { revalidate?: number; tags?: string[] };
}

/** Calls a public platform function. Never throws. */
export async function callPlatform(
  fn: string,
  args: Record<string, unknown>,
  options: PlatformCallOptions = {},
): Promise<PlatformResult> {
  if (!BASE_URL || !PUBLIC_KEY) return { status: 503, body: null };
  if (!/^[a-z_][a-z0-9_]{0,62}$/.test(fn)) return { status: 400, body: null };
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: PUBLIC_KEY,
    Authorization: `Bearer ${PUBLIC_KEY}`,
  };
  if (options.origin) headers.Origin = options.origin;
  try {
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers,
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(options.timeoutMs ?? 8000),
      ...(options.next ? { next: options.next } : { cache: "no-store" }),
    });
    const text = await res.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    return { status: res.status, body };
  } catch {
    return { status: 503, body: null };
  }
}
