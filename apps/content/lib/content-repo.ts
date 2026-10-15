import { fail, getSupabase } from "@/lib/supabase";
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
} from "@/lib/types";
import type { WorkspaceId } from "@/lib/workspaces";
import { visitorPayload, type VisitorDraft } from "@/lib/visitors";

const EVENT_SITES = new Set<EventSite>(["kharis", "kp2", "app", "general"]);

function asSites(value: string[]): EventSite[] {
  return value.filter((site): site is EventSite => EVENT_SITES.has(site as EventSite));
}

export async function listEvents(workspace: WorkspaceId) {
  const { data, error } = await getSupabase()
    .from("events")
    .select("*")
    .order("start_time", { ascending: false });
  fail(error);
  return ((data ?? []) as EventRow[]).filter((row) => {
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
  const { error } = await getSupabase().from("events").upsert(payload);
  fail(error);
}

export async function deleteEvent(id: string) {
  const { error } = await getSupabase().from("events").delete().eq("id", id);
  fail(error);
}

export async function listSermons() {
  const { data, error } = await getSupabase()
    .from("sermons")
    .select("*")
    .order("date", { ascending: false });
  fail(error);
  return (data ?? []) as SermonRow[];
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
  const { error } = await getSupabase().from("sermons").upsert(payload);
  fail(error);
}

export async function deleteSermon(id: string) {
  const { error } = await getSupabase().from("sermons").delete().eq("id", id);
  fail(error);
}

export async function listNews(workspace: WorkspaceId) {
  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .eq("workspace", workspace)
    .order("created_at", { ascending: false });
  fail(error);
  return (data ?? []) as NewsRow[];
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
  const { error } = await getSupabase().from("news").upsert(payload);
  fail(error);
}

export async function deleteNews(id: string) {
  const { error } = await getSupabase().from("news").delete().eq("id", id);
  fail(error);
}

export async function listTestimonies(workspace: WorkspaceId) {
  const { data, error } = await getSupabase()
    .from("testimonies")
    .select("*")
    .eq("workspace", workspace)
    .order("name", { ascending: true });
  fail(error);
  return (data ?? []) as TestimonyRow[];
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
  const { error } = await getSupabase().from("testimonies").upsert(payload);
  fail(error);
}

export async function deleteTestimony(id: string) {
  const { error } = await getSupabase().from("testimonies").delete().eq("id", id);
  fail(error);
}

export async function listVisitors() {
  const { data, error } = await getSupabase()
    .from("visitors")
    .select("*")
    .order("created_at", { ascending: false });
  fail(error);
  return (data ?? []) as VisitorRow[];
}

export async function saveVisitor(draft: VisitorDraft, id?: string) {
  const { error } = await getSupabase().from("visitors").upsert(visitorPayload(draft, id));
  fail(error);
}

export async function deleteVisitor(id: string) {
  const { error } = await getSupabase().from("visitors").delete().eq("id", id);
  fail(error);
}

export async function listDaily(workspace: WorkspaceId, kind: DailyKind) {
  const { data, error } = await getSupabase()
    .from("daily_entries")
    .select("*")
    .eq("workspace", workspace)
    .eq("kind", kind)
    .order("date", { ascending: false });
  fail(error);
  return (data ?? []) as DailyEntryRow[];
}

export async function saveDaily(row: Omit<DailyEntryRow, "id"> & { id?: string }) {
  if (!row.title?.trim()) throw new Error("Add a title.");
  const payload = {
    workspace: row.workspace,
    kind: row.kind,
    date: row.date || null,
    title: row.title.trim(),
    body: row.body?.trim() || null,
    reference: row.reference?.trim() || null,
    ...(row.id ? { id: row.id } : {}),
  };
  const { error } = await getSupabase().from("daily_entries").upsert(payload);
  fail(error);
}

export async function deleteDaily(id: string) {
  const { error } = await getSupabase().from("daily_entries").delete().eq("id", id);
  fail(error);
}

export async function listDailyMessages() {
  const { data, error } = await getSupabase()
    .from("daily_messages")
    .select("*")
    .order("date", { ascending: true });
  fail(error);
  return (data ?? []) as DailyMessageRow[];
}

export async function saveDailyMessage(row: {
  id?: string;
  date: string;
  sermonId: string;
  note: string;
}) {
  if (!row.date) throw new Error("Choose a date.");
  if (!row.sermonId) throw new Error("Choose a sermon.");
  const payload = {
    date: row.date,
    sermon_id: row.sermonId,
    note: row.note.trim() || null,
    ...(row.id ? { id: row.id } : {}),
  };
  const query = row.id
    ? getSupabase().from("daily_messages").update(payload).eq("id", row.id)
    : getSupabase().from("daily_messages").upsert(payload, { onConflict: "date" });
  const { error } = await query;
  fail(error);
}

export async function deleteDailyMessage(id: string) {
  const { error } = await getSupabase().from("daily_messages").delete().eq("id", id);
  fail(error);
}

const LIVE_KEY = "live_stream";

export async function getLiveSettings(): Promise<LiveSettings> {
  const { data, error } = await getSupabase()
    .from("app_config")
    .select("value")
    .eq("key", LIVE_KEY)
    .maybeSingle();
  fail(error);
  const value = (data?.value ?? {}) as Record<string, unknown>;
  return {
    url: typeof value.url === "string" ? value.url : "",
    isLive: Boolean(value.is_live ?? value.isLive),
    title: typeof value.title === "string" ? value.title : "",
  };
}

export async function saveLiveSettings(settings: LiveSettings) {
  const { error } = await getSupabase()
    .from("app_config")
    .upsert({
      key: LIVE_KEY,
      value: { url: settings.url.trim(), is_live: settings.isLive, title: settings.title.trim() },
    });
  fail(error);
}

export async function listFeatured(workspace: WorkspaceId) {
  const { data, error } = await getSupabase()
    .from("featured_videos")
    .select("*")
    .eq("workspace", workspace);
  fail(error);
  return (data ?? []) as FeaturedVideoRow[];
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
  const { error } = await getSupabase().from("featured_videos").upsert(payload);
  fail(error);
}

export async function deleteFeatured(id: string) {
  const { error } = await getSupabase().from("featured_videos").delete().eq("id", id);
  fail(error);
}

export async function listMessages(filters: {
  workspace?: string;
  status?: string;
  search?: string;
}) {
  let query = getSupabase()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (filters.workspace && filters.workspace !== "all")
    query = query.eq("workspace", filters.workspace);
  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
  const { data, error } = await query;
  fail(error);
  const rows = (data ?? []) as ContactMessage[];
  const search = filters.search?.trim().toLowerCase();
  if (!search) return rows;
  return rows.filter((row) =>
    `${row.first_name} ${row.last_name} ${row.email} ${row.topic} ${row.branch_name ?? ""} ${row.message}`
      .toLowerCase()
      .includes(search),
  );
}

export async function setMessageStatus(id: string, status: ContactStatus) {
  const { error } = await getSupabase().from("contact_messages").update({ status }).eq("id", id);
  fail(error);
}

export async function deleteMessage(id: string) {
  const { error } = await getSupabase().from("contact_messages").delete().eq("id", id);
  fail(error);
}

export async function countNewMessages(workspace: WorkspaceId) {
  const { count, error } = await getSupabase()
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("workspace", workspace)
    .eq("status", "new");
  if (error) return null;
  return count ?? 0;
}

export async function countRows(table: string, filters: Record<string, string>) {
  let query = getSupabase().from(table).select("*", { count: "exact", head: true });
  for (const [key, value] of Object.entries(filters)) query = query.eq(key, value);
  const { count, error } = await query;
  if (error) return null;
  return count ?? 0;
}
