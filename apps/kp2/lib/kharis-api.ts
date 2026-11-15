import https from "https";
import { unstable_rethrow } from "next/navigation";

/** The Kharis backend origin, without a trailing slash. All site content comes from it. */
export const KHARIS_API_URL = (process.env.NEXT_PUBLIC_KHARIS_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

export const kharisApiConfigured = Boolean(KHARIS_API_URL);

type TlsWithSystemStore = {
  getCACertificates?: (type: "default" | "system") => string[];
};

type RawResponse = { ok: boolean; status: number; body: string };

/** Validates certificates, including authorities installed in the OS trust store. */
async function tlsAgent() {
  try {
    const store = (await import(/* webpackIgnore: true */ "tls")) as TlsWithSystemStore;
    const load = store.getCACertificates?.bind(store);
    const ca = load ? load("default").concat(load("system")) : [];
    if (ca.length > 0) return new https.Agent({ ca, rejectUnauthorized: true });
  } catch {
    // Keep certificate checks on with Node's bundled authorities.
  }
  return new https.Agent({ rejectUnauthorized: true });
}

function isCertError(error: unknown) {
  const code =
    (error as { cause?: { code?: string }; code?: string } | null)?.cause?.code ??
    (error as { code?: string } | null)?.code;
  return code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "CERT_UNTRUSTED";
}

async function nodeRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  payload?: string,
): Promise<RawResponse> {
  const agent = await tlsAgent();
  const sized = payload
    ? { ...headers, "Content-Length": String(Buffer.byteLength(payload)) }
    : headers;
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers: sized, agent }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk as Buffer));
      res.on("end", () => {
        const status = res.statusCode ?? 500;
        resolve({
          ok: status >= 200 && status < 300,
          status,
          body: Buffer.concat(chunks).toString("utf8"),
        });
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function send(
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string },
  cache: RequestInit,
): Promise<RawResponse> {
  try {
    const res = await fetch(url, { ...init, ...cache });
    return { ok: res.ok, status: res.status, body: await res.text() };
  } catch (error) {
    if (!isCertError(error)) throw error;
    // Local SSL inspection (antivirus/proxy) can break Node's CA bundle.
    return nodeRequest(url, init.method, init.headers, init.body);
  }
}

function parse(body: string): { data?: unknown; message?: unknown } | null {
  try {
    return JSON.parse(body) as { data?: unknown; message?: unknown };
  } catch {
    return null;
  }
}

/** Reads a public /v1/site route. Returns null when the API is unset or the request fails. */
export async function siteGet<T>(path: string, revalidate: number | false = 60): Promise<T | null> {
  if (!kharisApiConfigured) {
    console.error("NEXT_PUBLIC_KHARIS_API_URL is not set.");
    return null;
  }
  const url = `${KHARIS_API_URL}/v1/site${path}`;
  try {
    const result = await send(
      url,
      { method: "GET", headers: { Accept: "application/json" } },
      revalidate === false ? { cache: "no-store" } : { next: { revalidate } },
    );
    if (!result.ok) {
      if (result.status !== 404)
        console.error(`Kharis API ${path} failed:`, result.status, result.body);
      return null;
    }
    return (parse(result.body)?.data ?? null) as T | null;
  } catch (error) {
    // Next signals "render this page per request" by throwing; it must reach Next.
    unstable_rethrow(error);
    console.error(`Kharis API ${path} request failed:`, error);
    return null;
  }
}

/** Sends a website form to the API. `configured` is false when the API address is missing. */
export async function postForm(
  path: "/api/contact" | "/api/visitors" | "/api/quiz",
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; configured: boolean; status?: number; error?: string }> {
  if (!kharisApiConfigured) return { ok: false, configured: false };
  try {
    const result = await send(
      `${KHARIS_API_URL}${path}`,
      {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      { cache: "no-store" },
    );
    if (!result.ok) {
      const message = parse(result.body)?.message;
      console.error(`Kharis API ${path} failed:`, result.status, result.body);
      return {
        ok: false,
        configured: true,
        status: result.status,
        error: typeof message === "string" ? message : undefined,
      };
    }
    return { ok: true, configured: true, status: result.status };
  } catch (error) {
    console.error(`Kharis API ${path} request failed:`, error);
    return { ok: false, configured: true };
  }
}
