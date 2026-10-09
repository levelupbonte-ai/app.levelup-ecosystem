import { NextResponse, type NextRequest } from "next/server";

import { callPlatform } from "@/lib/platform-api";

/**
 * LevelUp Ecosystem public API, used by the levelup.js tag on client websites:
 *   POST https://levelup-ecosystem.com/api/v1/<action>   (JSON body)
 *
 * The browser only ever talks to levelup-ecosystem.com. This route calls the
 * platform from the server and forwards the visitor's Origin header, so the
 * per-website origin allowlist and the rate limits (enforced by the platform)
 * behave exactly as before. Errors are mapped to short, neutral messages.
 */

export const dynamic = "force-dynamic";

type Field = "string" | "object";
type Action = {
  fn: string;
  /** Public body key → [platform argument, type]. */
  args: Record<string, [string, Field]>;
};

const SITE: Record<string, [string, Field]> = {
  site: ["p_website_id", "string"],
};

const ACTIONS: Record<string, Action> = {
  site: { fn: "get_site_bundle", args: SITE },
  website: { fn: "get_public_website", args: SITE },
  forms: {
    fn: "submit_form",
    args: {
      ...SITE,
      type: ["p_form_type", "string"],
      name: ["p_name", "string"],
      email: ["p_email", "string"],
      phone: ["p_phone", "string"],
      company: ["p_company", "string"],
      message: ["p_message", "string"],
      data: ["p_data", "object"],
      source: ["p_source", "string"],
    },
  },
  appointments: {
    fn: "book_appointment",
    args: {
      ...SITE,
      service: ["p_service_slug", "string"],
      date: ["p_date", "string"],
      time: ["p_time", "string"],
      name: ["p_name", "string"],
      email: ["p_email", "string"],
      phone: ["p_phone", "string"],
      teamMember: ["p_team_member_slug", "string"],
      notes: ["p_notes", "string"],
    },
  },
  "waitlist-join": {
    fn: "join_waitlist",
    args: {
      ...SITE,
      name: ["p_name", "string"],
      phone: ["p_phone", "string"],
      email: ["p_email", "string"],
      service: ["p_service_slug", "string"],
      teamMember: ["p_team_member_slug", "string"],
    },
  },
  waitlist: { fn: "get_public_waitlist", args: SITE },
  tickets: {
    fn: "get_ticket_status",
    args: { ...SITE, code: ["p_ticket_code", "string"] },
  },
  ping: {
    fn: "tag_ping",
    args: { ...SITE, version: ["p_version", "string"] },
  },
};

const MAX_BODY_BYTES = 32 * 1024;
const MAX_STRING = 10_000;
const SITE_ID = /^ws_[a-z0-9]{8,32}$/;

const MESSAGES = {
  PT403: [403, "This action is not available on this website."],
  PT404: [404, "Not found."],
  PT409: [409, "This time slot is no longer available."],
  PT429: [429, "Too many requests, please try again later."],
  invalid: [400, "Some information is missing or invalid."],
  unavailable: [
    503,
    "Service temporarily unavailable. Please try again later.",
  ],
} as const;
type Code = keyof typeof MESSAGES;

function cors(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin");
  return {
    // Any website may read public data; writes are checked against the
    // website's allowed origins by the platform itself.
    "Access-Control-Allow-Origin": origin && origin !== "null" ? origin : "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
}

function fail(request: NextRequest, code: Code) {
  const [status, message] = MESSAGES[code];
  return NextResponse.json(
    { code, message },
    { status, headers: cors(request) },
  );
}

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: cors(request) });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action: name } = await params;
  const action = Object.prototype.hasOwnProperty.call(ACTIONS, name)
    ? ACTIONS[name]
    : null;
  if (!action) return fail(request, "PT404");

  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) return fail(request, "invalid");
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return fail(request, "invalid");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(request, "invalid");
  }

  if (typeof body.site !== "string" || !SITE_ID.test(body.site))
    return fail(request, "invalid");

  const args: Record<string, unknown> = {};
  for (const [key, [arg, type]] of Object.entries(action.args)) {
    const value = body[key];
    if (value === undefined || value === null) continue;
    if (type === "string") {
      if (typeof value !== "string" && typeof value !== "number")
        return fail(request, "invalid");
      args[arg] = String(value).slice(0, MAX_STRING);
    } else {
      if (typeof value !== "object" || Array.isArray(value))
        return fail(request, "invalid");
      args[arg] = value;
    }
  }

  // Forward the visitor's Origin (bounded) so the allowlist check still applies.
  const origin = request.headers.get("origin");
  const { status, body: result } = await callPlatform(action.fn, args, {
    origin: origin ? origin.slice(0, 200) : null,
    timeoutMs: 8000,
  });

  if (status >= 200 && status < 300) {
    return NextResponse.json(result ?? null, { headers: cors(request) });
  }
  const code =
    result && typeof result === "object" && "code" in result
      ? String((result as { code: unknown }).code)
      : "";
  if (status === 429 || code === "PT429") return fail(request, "PT429");
  if (code === "PT403" || code === "PT404" || code === "PT409")
    return fail(request, code);
  if (status >= 400 && status < 500) return fail(request, "invalid");
  return fail(request, "unavailable");
}
