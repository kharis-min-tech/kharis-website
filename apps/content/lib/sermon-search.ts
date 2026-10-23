import { getSupabase } from "@/lib/supabase";
import type { CatalogueSermon } from "@/lib/sermon-catalogue";

async function studioToken() {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again.");
  return token;
}

async function ask(params: URLSearchParams) {
  const token = await studioToken();
  const response = await fetch(`/api/sermons/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = (await response.json().catch(() => null)) as {
    sermons?: CatalogueSermon[];
    error?: string;
  } | null;
  if (!response.ok) throw new Error(body?.error || "The sermon catalogue could not be loaded.");
  return body?.sermons ?? [];
}

export function searchSermons(query: string) {
  const params = new URLSearchParams({ q: query });
  return ask(params);
}

export function lookupSermons(ids: string[]) {
  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  if (unique.length === 0) return Promise.resolve([]);
  return ask(new URLSearchParams({ ids: unique.join(",") }));
}
