import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-key";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || PLACEHOLDER_KEY;
export const MEDIA_BUCKET = "content";

export function isSupabaseConfigured() {
  return SUPABASE_URL !== PLACEHOLDER_URL && SUPABASE_PUBLISHABLE_KEY !== PLACEHOLDER_KEY;
}

let client: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}

export function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
