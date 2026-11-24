import { studioData } from "@/lib/studio-data";
import {
  emptyListSlot,
  emptyMediaItem,
  emptySingleSlot,
  pageDef,
  pagesForWorkspace,
  siteContentsConfigKey,
  type ListSlot,
  type MediaItem,
  type MediaKind,
  type PageDef,
  type SectionDef,
  type SingleSlot,
  type SiteContentsWorkspace,
} from "@/lib/site-contents-schema";

export type {
  ListSlot,
  MediaItem,
  MediaKind,
  PageDef,
  SectionDef,
  SingleSlot,
  SiteContentsWorkspace,
} from "@/lib/site-contents-schema";

export type PageContents = Record<string, SingleSlot | ListSlot>;

/** Studio-only preview screenshots: pageId → sectionId → CDN url. */
export type SiteContentsGuides = Record<string, Record<string, string>>;

export type SiteContents = {
  pages: Record<string, PageContents>;
  /** Content Studio guide stills only — ignored by the live sites. */
  guides?: SiteContentsGuides;
  updatedAt: string;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readMediaItem(value: unknown, allowVideo: boolean): MediaItem {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const kindRaw = readString(row.kind);
  const kind: MediaKind = allowVideo && kindRaw === "video" ? "video" : "image";
  return {
    kind,
    url: readString(row.url),
    posterUrl: readString(row.posterUrl),
    alt: readString(row.alt),
  };
}

function readSingle(value: unknown): SingleSlot {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    url: readString(row.url),
    alt: readString(row.alt),
  };
}

function readList(value: unknown, section: SectionDef): ListSlot {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const rawItems = Array.isArray(row.items) ? row.items : [];
  const allowVideo = Boolean(section.allowVideo);
  const items = rawItems.map((item) => readMediaItem(item, allowVideo));

  if (section.kind === "fixedList") {
    const count = section.itemCount ?? 0;
    const next = items.slice(0, count);
    while (next.length < count) next.push(emptyMediaItem());
    return { items: next };
  }

  const max = section.maxItems ?? 24;
  return { items: items.slice(0, max) };
}

function emptySection(section: SectionDef): SingleSlot | ListSlot {
  if (section.kind === "single") return emptySingleSlot();
  if (section.kind === "fixedList") {
    return emptyListSlot(section.itemCount ?? 0, Boolean(section.allowVideo));
  }
  if (section.kind === "orderedList") return emptyListSlot(0, Boolean(section.allowVideo));
  return emptySingleSlot();
}

function emptyPage(page: PageDef): PageContents {
  return Object.fromEntries(page.sections.map((section) => [section.id, emptySection(section)]));
}

export function emptySiteContents(workspace: SiteContentsWorkspace): SiteContents {
  return {
    pages: Object.fromEntries(
      pagesForWorkspace(workspace).map((page) => [page.id, emptyPage(page)]),
    ),
    guides: {},
    updatedAt: "",
  };
}

function readGuides(value: unknown): SiteContentsGuides {
  if (!value || typeof value !== "object") return {};
  const root = value as Record<string, unknown>;
  const guides: SiteContentsGuides = {};
  for (const [pageId, pageValue] of Object.entries(root)) {
    if (!pageValue || typeof pageValue !== "object") continue;
    const pageGuides: Record<string, string> = {};
    for (const [sectionId, url] of Object.entries(pageValue as Record<string, unknown>)) {
      const trimmed = readString(url);
      if (trimmed) pageGuides[sectionId] = trimmed;
    }
    if (Object.keys(pageGuides).length) guides[pageId] = pageGuides;
  }
  return guides;
}

function cleanGuides(guides: SiteContentsGuides | undefined): SiteContentsGuides {
  return readGuides(guides ?? {});
}

export function parseSiteContents(workspace: SiteContentsWorkspace, value: unknown): SiteContents {
  const root = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const pagesRaw =
    root.pages && typeof root.pages === "object" ? (root.pages as Record<string, unknown>) : {};
  const pages: Record<string, PageContents> = {};

  for (const page of pagesForWorkspace(workspace)) {
    const pageRaw =
      pagesRaw[page.id] && typeof pagesRaw[page.id] === "object"
        ? (pagesRaw[page.id] as Record<string, unknown>)
        : {};
    const contents: PageContents = {};
    for (const section of page.sections) {
      if (section.kind === "deferred") {
        contents[section.id] = emptySingleSlot();
        continue;
      }
      if (section.kind === "single") {
        contents[section.id] = readSingle(pageRaw[section.id]);
      } else {
        contents[section.id] = readList(pageRaw[section.id], section);
      }
    }
    pages[page.id] = contents;
  }

  return {
    pages,
    guides: readGuides(root.guides),
    updatedAt: readString(root.updatedAt),
  };
}

export async function getSiteContents(workspace: SiteContentsWorkspace): Promise<SiteContents> {
  const key = siteContentsConfigKey(workspace);
  const [row] = await studioData.list<{ value: unknown }>("app_config", {
    where: { key },
    limit: 1,
  });
  return parseSiteContents(workspace, row?.value);
}

function cleanMediaItem(item: MediaItem, allowVideo: boolean): MediaItem {
  const kind: MediaKind = allowVideo && item.kind === "video" ? "video" : "image";
  const url = item.url.trim();
  return {
    kind,
    url,
    posterUrl: kind === "video" ? item.posterUrl.trim() : "",
    alt: item.alt.trim(),
  };
}

export async function saveSiteContents(workspace: SiteContentsWorkspace, contents: SiteContents) {
  const now = new Date().toISOString();
  const pages: Record<string, PageContents> = {};

  for (const page of pagesForWorkspace(workspace)) {
    const incoming = contents.pages[page.id] ?? emptyPage(page);
    const nextPage: PageContents = {};
    for (const section of page.sections) {
      if (section.kind === "deferred") {
        nextPage[section.id] = emptySingleSlot();
        continue;
      }
      if (section.kind === "single") {
        const slot = (incoming[section.id] as SingleSlot | undefined) ?? emptySingleSlot();
        nextPage[section.id] = { url: slot.url.trim(), alt: slot.alt.trim() };
        continue;
      }
      const list = (incoming[section.id] as ListSlot | undefined) ?? emptyListSlot();
      const allowVideo = Boolean(section.allowVideo);
      let items = list.items.map((item) => cleanMediaItem(item, allowVideo));
      if (section.kind === "fixedList") {
        const count = section.itemCount ?? 0;
        items = items.slice(0, count);
        while (items.length < count) items.push(emptyMediaItem());
      } else {
        items = items.filter((item) => item.url || item.alt || item.posterUrl);
        const max = section.maxItems ?? 24;
        items = items.slice(0, max);
      }
      nextPage[section.id] = { items };
    }
    pages[page.id] = nextPage;
  }

  const next: SiteContents = {
    pages,
    guides: cleanGuides(contents.guides),
    updatedAt: now,
  };
  await studioData.upsert("app_config", {
    key: siteContentsConfigKey(workspace),
    value: next,
  });
  return next;
}

export function guideOverride(
  contents: SiteContents | null | undefined,
  pageId: string,
  sectionId: string,
): string | null {
  const url = contents?.guides?.[pageId]?.[sectionId]?.trim();
  return url || null;
}

export function withGuideOverride(
  contents: SiteContents,
  pageId: string,
  sectionId: string,
  url: string | null,
): SiteContents {
  const pageGuides = { ...(contents.guides?.[pageId] ?? {}) };
  const trimmed = url?.trim() ?? "";
  if (trimmed) pageGuides[sectionId] = trimmed;
  else delete pageGuides[sectionId];

  const guides = { ...(contents.guides ?? {}) };
  if (Object.keys(pageGuides).length) guides[pageId] = pageGuides;
  else delete guides[pageId];

  return { ...contents, guides };
}

export function sectionValue(
  contents: SiteContents,
  pageId: string,
  sectionId: string,
): SingleSlot | ListSlot | null {
  return contents.pages[pageId]?.[sectionId] ?? null;
}

export function ensurePage(
  contents: SiteContents,
  workspace: SiteContentsWorkspace,
  pageId: string,
) {
  const def = pageDef(workspace, pageId);
  if (!def) return contents;
  if (contents.pages[pageId]) return contents;
  return {
    ...contents,
    pages: { ...contents.pages, [pageId]: emptyPage(def) },
    guides: contents.guides ?? {},
  };
}
