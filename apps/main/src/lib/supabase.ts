import { createClient } from "@supabase/supabase-js";

// createClient throws if the URL is empty, and because this module is imported
// at the top level of server components it threw during `next build`'s
// "Collecting page data" step whenever the env vars were absent — which is the
// case in CI and in any build without secrets.
//
// Falling back to a placeholder keeps the module importable. Behaviour is
// identical when the real values are set; without them, queries fail and the
// existing `if (error) return []` handlers in lib/branches.ts degrade the page
// rather than breaking the build.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "placeholder-key";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
