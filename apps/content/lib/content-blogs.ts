export const CONTENT_BLOGS_KEY = "content_blogs";

export const BLOG_SITES = ["kharis", "kp2"] as const;
export type BlogSite = (typeof BLOG_SITES)[number];

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export type ContentBlog = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  featuredImageUrl: string;
  gallery: string[];
  sites: BlogSite[];
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContentBlogsStore = {
  blogs: ContentBlog[];
};

function newKey() {
  return crypto.randomUUID();
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asSites(value: unknown): BlogSite[] {
  if (!Array.isArray(value)) return [];
  const sites = value.filter((site): site is BlogSite =>
    (BLOG_SITES as readonly string[]).includes(String(site)),
  );
  return [...new Set(sites)];
}

function asGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((url) => asString(url).trim()).filter(Boolean);
}

function asStatus(value: unknown): BlogStatus {
  return value === "published" ? "published" : "draft";
}

/** YYYY-MM-DD for date inputs; empty if missing. */
function asDate(value: unknown) {
  const raw = asString(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  return "";
}

export function emptyContentBlog(sites: BlogSite[] = ["kharis"]): ContentBlog {
  const now = new Date().toISOString();
  return {
    id: newKey(),
    title: "",
    body: "",
    publishedAt: now.slice(0, 10),
    featuredImageUrl: "",
    gallery: [],
    sites: sites.length ? sites : ["kharis"],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export function emptyContentBlogsStore(): ContentBlogsStore {
  return { blogs: [] };
}

export function statusLabel(status: BlogStatus) {
  return status === "published" ? "Published" : "Draft";
}

export function siteLabel(site: BlogSite) {
  return site === "kp2" ? "KP2" : "Kharis";
}

export function normalizeContentBlog(input: unknown, now = new Date().toISOString()): ContentBlog {
  const row = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const createdAt = asString(row.createdAt).trim() || now;
  const updatedAt = asString(row.updatedAt).trim() || now;
  const sites = asSites(row.sites);
  return {
    id: asString(row.id).trim() || newKey(),
    title: asString(row.title).trim(),
    body: asString(row.body),
    publishedAt: asDate(row.publishedAt) || now.slice(0, 10),
    featuredImageUrl: asString(row.featuredImageUrl).trim(),
    gallery: asGallery(row.gallery),
    sites: sites.length ? sites : ["kharis"],
    status: asStatus(row.status),
    createdAt,
    updatedAt,
  };
}

/** Normalize for write; always bumps updatedAt. */
export function prepareContentBlogForSave(blog: ContentBlog, now = new Date().toISOString()) {
  return {
    ...normalizeContentBlog(blog, now),
    createdAt: blog.createdAt.trim() || now,
    updatedAt: now,
  };
}

export function parseContentBlogsStore(value: unknown): ContentBlogsStore {
  if (!value || typeof value !== "object") return emptyContentBlogsStore();
  const row = value as Record<string, unknown>;
  const list = Array.isArray(row.blogs) ? row.blogs : [];
  return {
    blogs: list.map((item) => normalizeContentBlog(item)),
  };
}
