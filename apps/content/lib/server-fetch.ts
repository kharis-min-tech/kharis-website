import http from "node:http";
import https from "node:https";

function isCertError(error: unknown) {
  const details = error as { cause?: { code?: string }; code?: string; message?: string } | null;
  const code = details?.cause?.code ?? details?.code;
  const message = `${details?.message ?? ""} ${details?.cause && "message" in details.cause ? String((details.cause as { message?: string }).message ?? "") : ""}`;
  return (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "CERT_UNTRUSTED" ||
    message.includes("unable to verify the first certificate")
  );
}

/** Browser fetch, then a Node retry when local certificate inspection blocks Supabase. */
export async function serverFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (!isCertError(error)) throw error;
    return nodeFetch(input, init);
  }
}

function nodeFetch(input: RequestInfo | URL, init?: RequestInit) {
  const url = new URL(
    typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url,
  );
  const method = init?.method ?? (input instanceof Request ? input.method : "GET");
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  const headerRecord: Record<string, string> = {};
  headers.forEach((value, key) => {
    headerRecord[key] = value;
  });

  return new Promise<Response>((resolve, reject) => {
    const transport = url.protocol === "http:" ? http : https;
    const request = transport.request(
      url,
      {
        method,
        headers: headerRecord,
        agent:
          url.protocol === "https:" ? new https.Agent({ rejectUnauthorized: true }) : undefined,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(chunk as Buffer));
        response.on("end", () => {
          const responseHeaders = new Headers();
          for (const [key, value] of Object.entries(response.headers)) {
            if (Array.isArray(value)) value.forEach((item) => responseHeaders.append(key, item));
            else if (value) responseHeaders.set(key, value);
          }
          const bytes = Buffer.concat(chunks);
          const copy = new Uint8Array(bytes.byteLength);
          copy.set(bytes);
          resolve(
            new Response(new Blob([copy]), {
              status: response.statusCode ?? 500,
              headers: responseHeaders,
            }),
          );
        });
      },
    );
    request.on("error", reject);
    const body = init?.body;
    if (typeof body === "string" || body instanceof Uint8Array) request.end(body);
    else request.end();
  });
}
