import { serverFetch } from "@/lib/server-fetch";

/** The Kharis backend origin, without a trailing slash. All site content comes from it. */
export const KHARIS_API_URL = (process.env.NEXT_PUBLIC_KHARIS_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

/** False in local development and CI without the API address; readers fall back to fixtures. */
export const kharisApiConfigured = Boolean(KHARIS_API_URL);

type ApiResult<T> = { data: T | null; error: string | null; status: number };

function messageOf(body: unknown, status: number) {
  const message =
    body && typeof body === "object" && "message" in body
      ? (body as { message: unknown }).message
      : null;
  return typeof message === "string" && message ? message : `The Kharis API returned ${status}.`;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  if (!kharisApiConfigured) {
    return { data: null, error: "NEXT_PUBLIC_KHARIS_API_URL is not set.", status: 0 };
  }
  try {
    const response = await serverFetch(`${KHARIS_API_URL}${path}`, init);
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok)
      return { data: null, error: messageOf(body, response.status), status: response.status };
    const data =
      body && typeof body === "object" && "data" in body ? (body as { data: T }).data : null;
    return { data, error: null, status: response.status };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "The Kharis API could not be reached.",
      status: 0,
    };
  }
}

/** Reads a public /v1/site route. Returns { data, error } like the Supabase client did. */
export function siteGet<T>(path: string) {
  return request<T>(`/v1/site${path}`);
}

/** Sends a website form to the API (/api/contact, /api/visitors, /api/quiz). */
export function postForm(path: "/api/contact" | "/api/visitors" | "/api/quiz", payload: unknown) {
  return request<{ id: string | null }>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}
