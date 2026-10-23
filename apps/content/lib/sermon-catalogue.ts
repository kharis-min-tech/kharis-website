export type CatalogueSermon = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  series: string;
};

const MESSAGES_URL = "https://pub-1cfba9da59dd4e03b1f867b35e26a1a4.r2.dev/messages.json";
const FRESH_MS = 5 * 60 * 1000;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function seriesName(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && "name" in value) return text(value.name);
  return "";
}

export function catalogueFromPayload(payload: unknown): CatalogueSermon[] {
  const messages =
    payload && typeof payload === "object" && "messages" in payload
      ? (payload as { messages?: unknown }).messages
      : null;
  if (!Array.isArray(messages)) return [];
  const sermons: CatalogueSermon[] = [];
  for (const item of messages) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const id = text(row.id) || text(row.external_id);
    const title = text(row.title);
    if (!id || !title) continue;
    const refs = Array.isArray(row.scripture_refs)
      ? row.scripture_refs.map((ref) => text(ref)).filter(Boolean)
      : [];
    sermons.push({
      id,
      title,
      speaker: text(row.speaker),
      date: text(row.date_preached),
      scripture: refs.join("; "),
      series: seriesName(row.series),
    });
  }
  return sermons;
}

export function searchCatalogue(sermons: CatalogueSermon[], query: string, limit = 12) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const terms = needle.split(/\s+/).filter(Boolean);
  const ranked = sermons
    .map((sermon) => {
      const haystack = [sermon.title, sermon.speaker, sermon.scripture, sermon.series, sermon.id]
        .join(" ")
        .toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return null;
      const title = sermon.title.toLowerCase();
      const score =
        sermon.id === needle ? 0 : title.startsWith(needle) ? 1 : title.includes(needle) ? 2 : 3;
      return { sermon, score };
    })
    .filter((item): item is { sermon: CatalogueSermon; score: number } => item !== null)
    .sort((a, b) => a.score - b.score || b.sermon.date.localeCompare(a.sermon.date));
  return ranked.slice(0, limit).map((item) => item.sermon);
}

let cached: { at: number; sermons: CatalogueSermon[] } | null = null;

export async function loadSermonCatalogue(fetchImpl: typeof fetch = fetch) {
  if (cached && Date.now() - cached.at < FRESH_MS) return cached.sermons;
  const response = await fetchImpl(MESSAGES_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error("The sermon catalogue could not be loaded.");
  const sermons = catalogueFromPayload(await response.json());
  if (sermons.length === 0) throw new Error("The sermon catalogue was empty.");
  cached = { at: Date.now(), sermons };
  return sermons;
}

export function sermonsByIds(sermons: CatalogueSermon[], ids: string[]) {
  const wanted = new Set(ids.map((id) => id.trim()).filter(Boolean));
  return sermons.filter((sermon) => wanted.has(sermon.id));
}
