import { siteGet } from "@/lib/kharis-api";
import { localImage } from "@/lib/local-image";

export type MediaItem = {
  kind: "image" | "video";
  url: string;
  posterUrl: string;
  alt: string;
};

export type SingleSlot = {
  url: string;
  alt: string;
};

export type ListSlot = {
  items: MediaItem[];
};

export type PageContents = Record<string, SingleSlot | ListSlot>;

export type SiteContents = {
  pages: Record<string, PageContents>;
  updatedAt: string;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readMediaItem(value: unknown): MediaItem {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const kind = readString(row.kind) === "video" ? "video" : "image";
  return {
    kind,
    url: readString(row.url),
    posterUrl: readString(row.posterUrl),
    alt: readString(row.alt),
  };
}

function readSingle(value: unknown): SingleSlot {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return { url: readString(row.url), alt: readString(row.alt) };
}

function readList(value: unknown): ListSlot {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const rawItems = Array.isArray(row.items) ? row.items : [];
  return { items: rawItems.map(readMediaItem) };
}

function isListSlot(value: unknown): value is ListSlot {
  return Boolean(value && typeof value === "object" && Array.isArray((value as ListSlot).items));
}

export function parseSiteContents(value: unknown): SiteContents {
  const root = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const pagesRaw =
    root.pages && typeof root.pages === "object" ? (root.pages as Record<string, unknown>) : {};
  const pages: Record<string, PageContents> = {};

  for (const [pageId, pageValue] of Object.entries(pagesRaw)) {
    if (!pageValue || typeof pageValue !== "object") continue;
    const page: PageContents = {};
    for (const [sectionId, sectionValue] of Object.entries(pageValue as Record<string, unknown>)) {
      if (!sectionValue || typeof sectionValue !== "object") continue;
      if (isListSlot(sectionValue) || Array.isArray((sectionValue as { items?: unknown }).items)) {
        page[sectionId] = readList(sectionValue);
      } else {
        page[sectionId] = readSingle(sectionValue);
      }
    }
    pages[pageId] = page;
  }

  return { pages, updatedAt: readString(root.updatedAt) };
}

export function emptySiteContents(): SiteContents {
  return { pages: {}, updatedAt: "" };
}

export async function fetchSiteContents(
  workspace: "kharis" | "kp2" = "kp2",
): Promise<SiteContents> {
  const data = await siteGet<unknown>(`/contents?workspace=${workspace}`);
  if (!data) return emptySiteContents();
  return parseSiteContents(data);
}

export function singleSlot(
  contents: SiteContents,
  pageId: string,
  sectionId: string,
): SingleSlot | null {
  const value = contents.pages[pageId]?.[sectionId];
  if (!value || isListSlot(value)) return null;
  return value;
}

export function listSlot(contents: SiteContents, pageId: string, sectionId: string): MediaItem[] {
  const value = contents.pages[pageId]?.[sectionId];
  if (!value || !isListSlot(value)) return [];
  return value.items;
}

export function mediaOrFallback(slot: SingleSlot | null | undefined, fallback: string) {
  return localImage(slot?.url, fallback);
}

export function listOrFallback(
  items: MediaItem[] | null | undefined,
  fallbacks: string[],
): string[] {
  return fallbacks.map((fallback, index) => localImage(items?.[index]?.url, fallback));
}

export type MosaicPanel = {
  src: string;
  poster: string;
  kind: "image" | "video";
};

export function mosaicOrFallback(
  items: MediaItem[] | null | undefined,
  fallbacks: MosaicPanel[],
): MosaicPanel[] {
  return fallbacks.map((fallback, index) => {
    const item = items?.[index];
    if (!item?.url) return fallback;
    const kind = item.kind === "video" ? "video" : "image";
    return {
      kind,
      src: item.url,
      poster: kind === "video" ? localImage(item.posterUrl, fallback.poster) : item.url,
    };
  });
}
