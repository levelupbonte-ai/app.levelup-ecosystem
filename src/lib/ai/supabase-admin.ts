import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only client used solely to share Gemini key health (ai_key_state) with the
// other LevelUp apps. Optional: without a secret key the key pool still rotates,
// it just keeps its health in memory. Never import this from client components.
let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase secret key not configured");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
