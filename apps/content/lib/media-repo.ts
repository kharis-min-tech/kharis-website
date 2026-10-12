import { fail, getSupabase, MEDIA_BUCKET } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/branch-types";

const PUBLIC_MARKER = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

export function pathFromPublicUrl(url: string) {
  const index = url.indexOf(PUBLIC_MARKER);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + PUBLIC_MARKER.length).split("?")[0] ?? "");
}

function safeName(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "image";
}

export async function uploadImage(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images need to be 8MB or smaller.");

  const path = `${folder}/${crypto.randomUUID()}-${safeName(file.name)}`;
  const supabase = getSupabase();
  const uploaded = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  fail(uploaded.error);
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function removeStored(path: string | null | undefined) {
  if (!path || path.startsWith("external/")) return;
  const { error } = await getSupabase().storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}

type MediaInsert = {
  ownerType: string;
  ownerId: string;
  branchId?: string | null;
  path?: string | null;
  url: string;
  folder: string;
  sortOrder?: number;
};

export async function insertMedia(input: MediaInsert) {
  const { data, error } = await getSupabase()
    .from("media")
    .insert({
      owner_type: input.ownerType,
      owner_id: input.ownerId,
      branch_id: input.branchId ?? null,
      storage_path: input.path || `external/${crypto.randomUUID()}`,
      url: input.url,
      folder: input.folder,
      sort_order: input.sortOrder ?? 0,
    })
    .select("id, url, storage_path")
    .single();
  fail(error);
  return data as { id: string; url: string; storage_path: string };
}

export async function listGallery(branchId: string): Promise<GalleryItem[]> {
  const { data, error } = await getSupabase()
    .from("media")
    .select("id, url, storage_path, sort_order")
    .eq("owner_type", "branch-gallery")
    .eq("owner_id", branchId)
    .order("sort_order", { ascending: true });
  if (error) {
    if (error.code === "PGRST205") return [];
    throw new Error(error.message);
  }
  return (data ?? []).map((row) => ({
    key: row.id as string,
    id: row.id as string,
    url: (row.url as string) ?? "",
    path: (row.storage_path as string) ?? undefined,
  }));
}

export async function syncGallery(branchId: string, items: GalleryItem[], pendingOwnerId: string) {
  const supabase = getSupabase();
  const pending = await supabase
    .from("media")
    .update({ owner_id: branchId, branch_id: branchId })
    .eq("owner_id", pendingOwnerId);
  if (pending.error && pending.error.code !== "PGRST205") throw new Error(pending.error.message);

  const existing = await listGallery(branchId);
  const kept = new Set(items.map((item) => item.id).filter(Boolean) as string[]);

  for (const row of existing) {
    if (!row.id || kept.has(row.id)) continue;
    await removeStored(row.path).catch(() => undefined);
    const removed = await supabase.from("media").delete().eq("id", row.id);
    fail(removed.error);
  }

  for (const [index, item] of items.entries()) {
    if (!item.url) continue;
    if (!item.id) {
      await insertMedia({
        ownerType: "branch-gallery",
        ownerId: branchId,
        branchId,
        path: item.path,
        url: item.url,
        folder: "branches",
        sortOrder: index,
      });
      continue;
    }
    const updated = await supabase.from("media").update({ sort_order: index, branch_id: branchId }).eq("id", item.id);
    fail(updated.error);
  }
}
