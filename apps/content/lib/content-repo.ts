import { describeReadingReference } from "@/lib/bible-reference";
import { studioData, type StudioResource, type Where } from "@/lib/studio-data";
import type {
  ContactMessage,
  ContactStatus,
  DailyEntryRow,
  DailyKind,
  DailyMessageRow,
  EventCategory,
  EventRow,
  EventSite,
  FeaturedVideoRow,
  LiveSettings,
  NewsRow,
  SermonRow,
  TestimonyRow,
  VisitorRow,
  NewsletterSubscriber,
} from "@/lib/types";
import type { WorkspaceId } from "@/lib/workspaces";
import { visitorPayload, type VisitorDraft } from "@/lib/visitors";

const EVENT_SITES = new Set<EventSite>(["kharis", "kp2", "app", "general"]);

function asSites(value: string[]): EventSite[] {
  return value.filter((site): site is EventSite => EVENT_SITES.has(site as EventSite));
}

export async function listEvents(workspace: WorkspaceId) {
  const rows = await studioData.list<EventRow>("events", { order: "-start_time" });
  return rows.filter((row) => {
    if (row.workspace === workspace) return true;
    if (!row.workspace && row.sites?.includes(workspace as EventSite)) return true;
    return false;
  });
}

export type EventInput = {
  id?: string;
  title: string;
  description: string;
  location: string;
  branchId: string;
  branchName: string;
  startTime: string;
  endTime: string | null;
  category: EventCategory;
  recurrence: "none" | "weekly";
  recurrenceDays: number[];
  recurrenceUntil: string;
  sites: string[];
  featured: boolean;
  imageUrl: string;
  workspace: WorkspaceId;
};

export async function saveEvent(input: EventInput) {
  if (!input.title.trim()) throw new Error("An event needs a title.");
  if (!input.startTime) throw new Error("Choose a date and time.");
  const payload = {
    title: input.title.trim(),
    description: input.description.trim() || null,
    location: input.location.trim() || null,
    branch_id: input.branchId || null,
    branch_name: input.branchName.trim() || null,
    start_time: input.startTime,
    end_time: input.endTime,
    category: input.category,
    recurrence: input.recurrence,
    recurrence_days: input.recurrence === "weekly" ? input.recurrenceDays : [],
    recurrence_until:
      input.recurrence === "weekly" && input.recurrenceUntil ? input.recurrenceUntil : null,
    sites: asSites(input.sites),
    is_featured: input.featured,
    image_url: input.imageUrl.trim() || null,
    workspace: input.workspace,
    ...(input.id ? { id: input.id } : {}),
  };
  await studioData.upsert("events", payload);
}

export async function deleteEvent(id: string) {
  await studioData.remove("events", id);
}

export async function listSermons() {
  return studioData.list<SermonRow>("sermons", { order: "-date" });
}

export async function saveSermon(row: Omit<SermonRow, "id"> & { id?: string }) {
  if (!row.title.trim()) throw new Error("A sermon needs a title.");
  const payload = {
    title: row.title.trim(),
    speaker: row.speaker?.trim() || null,
    date: row.date || null,
    series: row.series?.trim() || null,
    description: row.description?.trim() || null,
    video_url: row.video_url?.trim() || null,
    audio_url: row.audio_url?.trim() || null,
    thumbnail: row.thumbnail?.trim() || null,
    published: Boolean(row.published),
    ...(row.id ? { id: row.id } : {}),
  };
  await studioData.upsert("sermons", payload);
}

export async function deleteSermon(id: string) {
  await studioData.remove("sermons", id);
}

export async function listNews(workspace: WorkspaceId) {
  return studioData.list<NewsRow>("news", { where: { workspace }, order: "-created_at" });
}

export async function saveNews(row: Omit<NewsRow, "id"> & { id?: string }) {
  if (!row.title.trim()) throw new Error("An announcement needs a title.");
  const payload = {
    workspace: row.workspace,
    title: row.title.trim(),
    body: row.body?.trim() || null,
    image: row.image?.trim() || null,
    published: Boolean(row.published),
    ...(row.id ? { id: row.id } : {}),
  };
  await studioData.upsert("news", payload);
}

export async function deleteNews(id: string) {
  await studioData.remove("news", id);
}

export async function listTestimonies(workspace: WorkspaceId) {
  return studioData.list<TestimonyRow>("testimonies", { where: { workspace }, order: "name" });
}

export async function saveTestimony(row: Omit<TestimonyRow, "id"> & { id?: string }) {
  if (!row.name.trim()) throw new Error("A testimony needs a name.");
  const payload = {
    name: row.name.trim(),
    branch_name: row.branch_name?.trim() || null,
    category: row.category?.trim() || null,
    short_description: row.short_description?.trim() || null,
    description: row.description?.trim() || null,
    image_url: row.image_url?.trim() || null,
    is_anonymous: Boolean(row.is_anonymous),
    workspace: row.workspace,
    is_featured: Boolean(row.is_featured),
    is_featured_giving: Boolean(row.is_featured_giving),
    is_published: Boolean(row.is_published),
    ...(row.id ? { id: row.id } : {}),
  };
  await studioData.upsert("testimonies", payload);
}

export async function deleteTestimony(id: string) {
  await studioData.remove("testimonies", id);
}

export async function listVisitors() {
  return studioData.list<VisitorRow>("visitors", { order: "-created_at" });
}

export async function saveVisitor(draft: VisitorDraft, id?: string) {
  await studioData.upsert("visitors", visitorPayload(draft, id));
}

export async function deleteVisitor(id: string) {
  await studioData.remove("visitors", id);
}

export async function listDaily(workspace: WorkspaceId, kind: DailyKind) {
  return studioData.list<DailyEntryRow>("daily_entries", {
    where: { workspace, kind },
    order: "-date",
  });
}

export async function saveDaily(row: Omit<DailyEntryRow, "id"> & { id?: string }) {
  if (!row.title?.trim()) throw new Error("Add a title.");
  if (row.kind === "reading" && row.reference?.trim()) {
    const check = describeReadingReference(row.reference);
    if (!check.ok) throw new Error(check.message);
  }
  const payload = {
    workspace: row.workspace,
    kind: row.kind,
    date: row.date || null,
    title: row.title.trim(),
    body: row.body?.trim() || null,
    reference: row.reference?.trim() || null,
    ...(row.id ? { id: row.id } : {}),
  };
  await studioData.upsert("daily_entries", payload);
}

export async function deleteDaily(id: string) {
  await studioData.remove("daily_entries", id);
}

export async function listDailyMessages() {
  return studioData.list<DailyMessageRow>("daily_messages", { order: "date" });
}

export async function saveDailyMessage(row: {
  id?: string;
  date: string;
  sermonId: string;
  sermonTitle?: string;
  note: string;
  workspace: WorkspaceId;
}) {
  if (!row.date) throw new Error("Choose a date.");
  if (!row.sermonId) throw new Error("Choose a sermon.");
  const payload = {
    date: row.date,
    day: row.date,
    workspace: row.workspace,
    sermon_id: row.sermonId,
    sermon_title: row.sermonTitle?.trim() || null,
    note: row.note.trim() || null,
    ...(row.id ? { id: row.id } : {}),
  };
  if (row.id) await studioData.update("daily_messages", row.id, payload);
  else await studioData.upsert("daily_messages", payload, { onConflict: "date" });
}

export async function deleteDailyMessage(id: string) {
  await studioData.remove("daily_messages", id);
}

const LIVE_KEY = "live_stream";

export async function getLiveSettings(): Promise<LiveSettings> {
  const [row] = await studioData.list<{ value: unknown }>("app_config", {
    where: { key: LIVE_KEY },
    limit: 1,
  });
  const value = (row?.value ?? {}) as Record<string, unknown>;
  return {
    url: typeof value.url === "string" ? value.url : "",
    isLive: Boolean(value.is_live ?? value.isLive),
    title: typeof value.title === "string" ? value.title : "",
  };
}

export async function saveLiveSettings(settings: LiveSettings) {
  await studioData.upsert("app_config", {
    key: LIVE_KEY,
    value: { url: settings.url.trim(), is_live: settings.isLive, title: settings.title.trim() },
  });
}

export async function listFeatured(workspace: WorkspaceId) {
  return studioData.list<FeaturedVideoRow>("featured_videos", { where: { workspace } });
}

export async function saveFeatured(row: Omit<FeaturedVideoRow, "id"> & { id?: string }) {
  if (!row.video_url?.trim()) throw new Error("Add a video URL.");
  const payload = {
    workspace: row.workspace,
    title: row.title?.trim() || null,
    video_url: row.video_url.trim(),
    published: Boolean(row.published),
    ...(row.id ? { id: row.id } : {}),
  };
  await studioData.upsert("featured_videos", payload);
}

export async function deleteFeatured(id: string) {
  await studioData.remove("featured_videos", id);
}

export async function listMessages(filters: {
  workspace?: string;
  status?: string;
  search?: string;
}) {
  const where: Where = {};
  if (filters.workspace && filters.workspace !== "all") where.workspace = filters.workspace;
  if (filters.status && filters.status !== "all") where.status = filters.status;
  const rows = await studioData.list<ContactMessage>("contact_messages", {
    where,
    order: "-created_at",
    limit: 300,
  });
  const search = filters.search?.trim().toLowerCase();
  if (!search) return rows;
  return rows.filter((row) =>
    `${row.first_name} ${row.last_name} ${row.email} ${row.topic} ${row.branch_name ?? ""} ${row.message}`
      .toLowerCase()
      .includes(search),
  );
}

export async function setMessageStatus(id: string, status: ContactStatus) {
  await studioData.update("contact_messages", id, { status });
}

export async function deleteMessage(id: string) {
  await studioData.remove("contact_messages", id);
}

export async function listNewsletter(source?: string) {
  const where: Where = source && source !== "general" && source !== "all" ? { source } : {};
  return studioData.list<NewsletterSubscriber>("newsletter_subscribers", {
    where,
    order: "-created_at",
    limit: 500,
  });
}

export async function deleteNewsletter(id: string) {
  await studioData.remove("newsletter_subscribers", id);
}

/** Recent events across workspaces, for the overview. Weekly ones can start long ago. */
export async function listEventSchedule(limit = 80) {
  return studioData.list<EventRow>("events", { order: "-start_time", limit });
}

export async function listRecentMessages(limit = 5) {
  return studioData.list<ContactMessage>("contact_messages", { order: "-created_at", limit });
}

export async function countNewMessages(workspace: WorkspaceId) {
  return studioData.count("contact_messages", { workspace, status: "new" }).catch(() => null);
}

export async function countRows(
  table: StudioResource,
  filters: Record<string, string>,
  branchIds?: string[],
) {
  const where: Where = { ...filters, ...(branchIds ? { branch_id: branchIds } : {}) };
  return studioData.count(table, where).catch(() => null);
}
