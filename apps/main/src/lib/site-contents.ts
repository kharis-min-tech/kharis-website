import { siteGet } from "@/lib/kharis-api";
import { localImage } from "@/lib/local-image";
import type { HeroSlide } from "@/lib/hero-media";

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

/** Public fetch. Empty / failed API → empty config so callers keep hardcoded fallbacks. */
export async function fetchSiteContents(
  workspace: "kharis" | "kp2" = "kharis",
): Promise<SiteContents> {
  const { data } = await siteGet<unknown>(`/contents?workspace=${workspace}`);
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

/** Studio URL when present, otherwise the hardcoded CDN fallback. */
export function mediaOrFallback(slot: SingleSlot | null | undefined, fallback: string) {
  return localImage(slot?.url, fallback);
}

/** Map studio list items onto hardcoded fallbacks by index; empty studio URLs keep fallbacks. */
export function listOrFallback(
  items: MediaItem[] | null | undefined,
  fallbacks: string[],
): string[] {
  return fallbacks.map((fallback, index) => localImage(items?.[index]?.url, fallback));
}

export function mediaItemsOrFallback(
  items: MediaItem[] | null | undefined,
  fallbacks: Array<{ url: string; alt?: string; posterUrl?: string; kind?: "image" | "video" }>,
): MediaItem[] {
  return fallbacks.map((fallback, index) => {
    const item = items?.[index];
    const url = localImage(item?.url, fallback.url);
    const kind = item?.url
      ? item.kind
      : fallback.kind === "video" || Boolean(fallback.posterUrl)
        ? "video"
        : "image";
    return {
      kind,
      url,
      posterUrl: kind === "video" ? localImage(item?.posterUrl, fallback.posterUrl ?? "") : "",
      alt: (item?.alt || fallback.alt || "").trim(),
    };
  });
}

/** Prefer a full studio-ordered hero list when any item has a URL; else keep defaults. */
export function heroSlidesOrFallback(
  items: MediaItem[] | null | undefined,
  fallbacks: HeroSlide[],
): HeroSlide[] {
  const filled = (items ?? []).filter((item) => item.url.trim());
  if (!filled.length) return fallbacks;
  return filled
    .map((item): HeroSlide | null => {
      if (item.kind === "video") {
        if (!item.url) return null;
        return {
          type: "video",
          src: item.url,
          poster: item.posterUrl || undefined,
          alt: item.alt || undefined,
        };
      }
      if (!item.url) return null;
      return { type: "image", src: item.url, alt: item.alt || undefined };
    })
    .filter((slide): slide is HeroSlide => Boolean(slide));
}
