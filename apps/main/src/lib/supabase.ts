import { createClient } from "@supabase/supabase-js";
import { serverFetch } from "@/lib/server-fetch";

// createClient throws if the URL is empty, and because this module is imported
// at the top level of server components it threw during `next build`'s
// "Collecting page data" step whenever the env vars were absent — which is the
// case in CI and in any build without secrets.
//
// Falling back to a placeholder keeps the module importable. Behaviour is
// identical when the real values are set; without them, queries fail and the
// existing `if (error) return []` handlers in lib/branches.ts degrade the page
// rather than breaking the build.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key";

// Without credentials, answer straight away with an error the client won't retry. Left to hit the
// placeholder host, each query retried for ~8s before giving up, on every page that reads from here.
const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
const notConfiguredFetch: typeof fetch = async () =>
  new Response(JSON.stringify({ message: "Supabase is not configured", code: "not_configured" }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch: configured ? serverFetch : notConfiguredFetch },
});
