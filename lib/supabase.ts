import https from "https";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isCertError(error: unknown) {
  const code = (error as { cause?: { code?: string }; code?: string } | null)?.cause?.code
    ?? (error as { code?: string } | null)?.code;
  return code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "CERT_UNTRUSTED";
}

async function restGet(url: string, headers: Record<string, string>): Promise<{ ok: boolean; status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers, agent: new https.Agent({ rejectUnauthorized: false }) },
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
  });
}

export async function supabaseSelect<T>(table: string, query: string): Promise<T[]> {
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
      const res = await fetch(url, {
        headers,
        next: { revalidate: 60 },
      });
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
