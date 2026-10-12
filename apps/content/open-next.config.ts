import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache is configured yet, so ISR / unstable_cache entries are
// per-isolate rather than persisted. Add an R2 or KV cache before this takes
// real traffic: https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig();
