import { createHash, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Called by the LevelUp database (pg_net trigger) whenever this site's content
// changes, so dashboard and database edits show up within seconds instead of
// waiting for the 5-minute cache. It only drops the cached site bundle; the
// shared secret (REVALIDATE_SECRET, also kept in Supabase Vault) stops anyone
// else from flushing the cache in a loop.

const SECRET = process.env.REVALIDATE_SECRET;

const digest = (value: string) => createHash("sha256").update(value).digest();

export async function POST(request: NextRequest) {
  const given = request.headers.get("x-revalidate-secret") ?? "";
  if (!SECRET || SECRET.length < 32 || !timingSafeEqual(digest(given), digest(SECRET))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  revalidateTag("levelup-site");
  return NextResponse.json({ revalidated: true });
}
