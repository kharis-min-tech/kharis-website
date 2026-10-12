import https from "node:https";
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

function isCertError(error: unknown) {
  const code =
    (error as { cause?: { code?: string }; code?: string } | null)?.cause?.code ??
    (error as { code?: string } | null)?.code;
  return (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "CERT_UNTRUSTED" ||
    code === "UNABLE_TO_GET_ISSUER_CERT_LOCALLY"
  );
}

function headerRecord(headers: HeadersInit | undefined) {
  if (!headers) return {};
  if (headers instanceof Headers) return Object.fromEntries(headers.entries());
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return headers;
}

/** Retry once when this machine's Node CA bundle cannot verify Supabase. */
async function supabaseFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (!isCertError(error)) throw error;
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    return new Promise<Response>((resolve, reject) => {
      const req = https.request(
        url,
        {
          method: init?.method ?? "GET",
          headers: headerRecord(init?.headers),
          agent: new https.Agent({ rejectUnauthorized: false }),
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk as Buffer));
          res.on("end", () => {
            const headers = new Headers();
            for (const [name, value] of Object.entries(res.headers)) {
              if (typeof value === "string") headers.set(name, value);
              else if (Array.isArray(value)) headers.set(name, value.join(", "));
            }
            resolve(new Response(Buffer.concat(chunks), { status: res.statusCode ?? 500, headers }));
          });
        },
      );
      req.on("error", reject);
      if (typeof init?.body === "string" || init?.body instanceof Uint8Array) req.write(init.body);
      req.end();
    });
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch: supabaseFetch },
});
