import https from "https";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type TlsWithSystemStore = {
  getCACertificates?: (type: "default" | "system") => string[];
};

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

async function restGet(
  url: string,
  headers: Record<string, string>,
): Promise<{ ok: boolean; status: number; body: string }> {
  const agent = await tlsAgent();
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers, agent }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk as Buffer));
      res.on("end", () => {
        resolve({
          ok: (res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300,
          status: res.statusCode ?? 500,
          body: Buffer.concat(chunks).toString("utf8"),
        });
      });
    });
    req.on("error", reject);
  });
}

async function restPost(
  url: string,
  headers: Record<string, string>,
  payload: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  const agent = await tlsAgent();
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "POST",
        headers: { ...headers, "Content-Length": String(Buffer.byteLength(payload)) },
        agent,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk as Buffer));
        res.on("end", () => {
          resolve({
            ok: (res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300,
            status: res.statusCode ?? 500,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/** Inserts one row with a server-only key. Returns false when the key or URL is missing. */
export async function supabaseInsert(
  table: string,
  row: Record<string, unknown>,
  serverKey: string | undefined,
): Promise<{ ok: boolean; configured: boolean; status?: number }> {
  if (!supabaseUrl || !serverKey) return { ok: false, configured: false };

  const headers = {
    apikey: serverKey,
    Authorization: `Bearer ${serverKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  const url = `${supabaseUrl}/rest/v1/${table}`;
  const payload = JSON.stringify(row);

  try {
    let result: { ok: boolean; status: number; body: string };
    try {
      const res = await fetch(url, { method: "POST", headers, body: payload, cache: "no-store" });
      result = { ok: res.ok, status: res.status, body: await res.text() };
    } catch (error) {
      if (!isCertError(error)) throw error;
      result = await restPost(url, headers, payload);
    }
    if (!result.ok) console.error(`Supabase ${table} insert failed:`, result.status, result.body);
    return { ok: result.ok, configured: true, status: result.status };
  } catch (error) {
    console.error(`Supabase ${table} insert request failed:`, error);
    return { ok: false, configured: true };
  }
}

export async function supabaseSelect<T>(
  table: string,
  query: string,
  revalidate: number | false = 60,
): Promise<T[]> {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase env vars are missing.");
    return [];
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    Accept: "application/json",
  };
  const url = `${supabaseUrl}/rest/v1/${table}?${query}`;

  try {
    let body: string;
    let ok: boolean;
    let status: number;

    try {
      const res = await fetch(
        url,
        revalidate === false ? { headers, cache: "no-store" } : { headers, next: { revalidate } },
      );
      ok = res.ok;
      status = res.status;
      body = await res.text();
    } catch (error) {
      if (!isCertError(error)) throw error;
      // Local SSL inspection (antivirus/proxy) can break Node's CA bundle.
      const res = await restGet(url, headers);
      ok = res.ok;
      status = res.status;
      body = res.body;
    }

    if (!ok) {
      console.error(`Supabase ${table} query failed:`, status, body);
      return [];
    }

    return JSON.parse(body) as T[];
  } catch (error) {
    console.error(`Supabase ${table} request failed:`, error);
    return [];
  }
}
