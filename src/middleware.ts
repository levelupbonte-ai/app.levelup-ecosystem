import { NextResponse, type NextRequest } from "next/server";

/**
 * Sign-in safety net.
 *
 * Authentication only happens on the dashboard. If an OAuth / PKCE return
 * (Google sign-in) ever lands on a showcase URL with a stray `?code=` because
 * of a redirect misconfiguration, forward the browser to the dashboard's
 * callback with the exact same query string (code, next, ...). The PKCE
 * verifier lives on the shared .levelup-ecosystem.com cookie, so the dashboard
 * can complete the exchange.
 *
 * Only a `code` that looks like an auth code is forwarded; every other URL and
 * every other query parameter is left untouched. The destination host is fixed,
 * so this can not be used as an open redirect.
 */
const DASHBOARD_CALLBACK = "https://dashboard.levelup-ecosystem.com/auth/callback";
const AUTH_CODE = /^[A-Za-z0-9._~-]{16,512}$/;

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  if (code && AUTH_CODE.test(code) && searchParams.getAll("code").length === 1) {
    const target = new URL(DASHBOARD_CALLBACK);
    // Same query string, byte for byte.
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 307);
  }
  return NextResponse.next();
}

export const config = {
  // Pages only: not the Next.js internals, API routes, the SDK or static files.
  matcher: ["/((?!_next/|api/|sdk/|.*\\..*).*)"]
};
