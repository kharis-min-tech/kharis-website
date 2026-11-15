import { studioRequest } from "./studio-api";

/** Tables the Kharis API lets the studio use (/v1/studio/data/:resource). */
export type StudioResource =
  | "events"
  | "sermons"
  | "news"
  | "testimonies"
  | "visitors"
  | "daily_entries"
  | "daily_messages"
  | "app_config"
  | "featured_videos"
  | "contact_messages"
  | "newsletter_subscribers"
  | "branches"
  | "venues"
  | "services"
  | "media";

type Scalar = string | number | boolean;

/** { column: value }. An array means any of the values; null means empty. */
export type Where = Record<string, Scalar | null | Scalar[]>;

export type ListQuery = {
  where?: Where;
  /** Column name; prefix with "-" for descending. */
  order?: string;
  limit?: number;
  view?: "full" | "options";
};

/** Server routes pass the caller's token; the browser uses its own session. */
type Auth = { token?: string };

const dataPath = (resource: StudioResource, suffix = "") => `/v1/studio/data/${resource}${suffix}`;

/**
 * Content Studio reads and writes. Every call goes to the Kharis API, which runs it as the
 * signed-in user so the database's row level security still decides what they can change.
 */
export const studioData = {
  async list<T>(resource: StudioResource, query: ListQuery = {}, auth: Auth = {}) {
    const data = await studioRequest(dataPath(resource, "/query"), {
      method: "POST",
      body: query,
      token: auth.token,
    });
    return (Array.isArray(data) ? data : []) as T[];
  },

  async count(resource: StudioResource, where: Where = {}) {
    const data = (await studioRequest(dataPath(resource, "/count"), {
      method: "POST",
      body: { where },
    })) as { count?: unknown } | null;
    return typeof data?.count === "number" ? data.count : 0;
  },

  async insert<T>(resource: StudioResource, row: Record<string, unknown>) {
    return (await studioRequest(dataPath(resource), { method: "POST", body: { row } })) as T;
  },

  async upsert<T = null>(
    resource: StudioResource,
    row: Record<string, unknown>,
    options: { onConflict?: string; returning?: boolean } = {},
  ) {
    return (await studioRequest(dataPath(resource), {
      method: "PUT",
      body: { row, ...options },
    })) as T;
  },

  async update(resource: StudioResource, key: string, patch: Record<string, unknown>) {
    await studioRequest(dataPath(resource, `/${encodeURIComponent(key)}`), {
      method: "PATCH",
      body: { patch },
    });
  },

  async updateWhere(resource: StudioResource, where: Where, patch: Record<string, unknown>) {
    await studioRequest(dataPath(resource), { method: "PATCH", body: { where, patch } });
  },

  async remove(resource: StudioResource, key: string) {
    await studioRequest(dataPath(resource, `/${encodeURIComponent(key)}`), { method: "DELETE" });
  },

  async removeWhere(resource: StudioResource, where: Where) {
    await studioRequest(dataPath(resource, "/delete"), { method: "POST", body: { where } });
  },

  /** Hides a branch from the websites and app. Its venues, services and media are kept. */
  async deactivateBranch(id: string) {
    await studioRequest(`/v1/studio/branches/${encodeURIComponent(id)}/deactivate`, {
      method: "POST",
    });
  },

  /** Older uploads that still live in Supabase Storage. */
  async removeStoredFiles(paths: string[]) {
    await studioRequest("/v1/studio/storage/remove", { method: "POST", body: { paths } });
  },
};
