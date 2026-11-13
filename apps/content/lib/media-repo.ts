import { isR2ObjectKey } from "@/lib/branch-image-paths";
import {
  MAX_MEDIA_IMAGE_BYTES,
  MAX_MEDIA_VIDEO_BYTES,
  isBranchMediaFolder,
  isMediaFolder,
  mediaKeyFromUrl,
} from "@/lib/media-paths";
import { studioData } from "@/lib/studio-data";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/branch-types";

type MediaRow = {
  id: string;
  url: string | null;
  storage_path: string | null;
  sort_order: number | null;
};

function mediaRows(ownerType: string, ownerId: string) {
  return studioData.list<MediaRow>("media", {
    where: { owner_type: ownerType, owner_id: ownerId },
    order: "sort_order",
  });
}

// Older uploads were saved to Supabase Storage. New uploads go to Cloudflare R2;
// this is kept only so those older files can still be cleaned up.
const PUBLIC_MARKER = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

export function pathFromPublicUrl(url: string) {
  const r2Key = mediaKeyFromUrl(url);
  if (r2Key) return r2Key;
  const index = url.indexOf(PUBLIC_MARKER);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + PUBLIC_MARKER.length).split("?")[0] ?? "");
}

async function studioToken() {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again to upload files.");
  return token;
}

/** Streams a file to /api/uploads/media, which writes it to R2 and returns its public address. */
async function uploadToR2(
  file: File,
  folder: string,
  contentType: string,
  onProgress?: (percent: number) => void,
  branchId?: string | null,
) {
  const target = isMediaFolder(folder) ? folder : "uploads";
  const token = await studioToken();
  return new Promise<{ path: string; url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploads/media");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("X-Media-Folder", target);
    if (branchId && isBranchMediaFolder(target)) xhr.setRequestHeader("X-Branch-Id", branchId);
    xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => {
      let body: { key?: string; publicUrl?: string; error?: string } | null = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = null;
      }
      if (xhr.status >= 200 && xhr.status < 300 && body?.key && body.publicUrl) {
        resolve({ path: body.key, url: body.publicUrl });
        return;
      }
      reject(new Error(body?.error || "The file could not be stored. Try again."));
    };
    xhr.onerror = () => reject(new Error("The file could not be stored. Try again."));
    xhr.send(file);
  });
}

export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void,
  branchId?: string | null,
) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_MEDIA_IMAGE_BYTES) throw new Error("Images need to be 8MB or smaller.");
  return uploadToR2(file, folder, file.type, onProgress, branchId);
}

export async function uploadVideo(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void,
  branchId?: string | null,
) {
  const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|m4v|webm)$/i.test(file.name);
  if (!isVideo) throw new Error("Choose a video file (.mp4, .mov, or .webm).");
  if (file.size > MAX_MEDIA_VIDEO_BYTES) {
    throw new Error("Videos need to be 95MB or smaller. Export a smaller copy and try again.");
  }

  const contentType =
    file.type === "video/quicktime" || /\.mov$/i.test(file.name)
      ? "video/quicktime"
      : file.type === "video/webm" || /\.webm$/i.test(file.name)
        ? "video/webm"
        : "video/mp4";

  return uploadToR2(file, folder, contentType, onProgress, branchId);
}

export async function removeStored(path: string | null | undefined) {
  if (!path || path.startsWith("external/")) return;
  const r2Key = mediaKeyFromUrl(path);
  if (r2Key) {
    const token = await studioToken();
    const response = await fetch("/api/uploads/media", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key: r2Key }),
    });
    if (!response.ok) throw new Error("The old file could not be removed.");
    return;
  }
  await studioData.removeStoredFiles([path]);
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
  return studioData.insert<{ id: string; url: string; storage_path: string }>("media", {
    owner_type: input.ownerType,
    owner_id: input.ownerId,
    branch_id: input.branchId ?? null,
    storage_path: input.path || `external/${crypto.randomUUID()}`,
    url: input.url,
    folder: input.folder,
    sort_order: input.sortOrder ?? 0,
  });
}

export async function listGallery(branchId: string): Promise<GalleryItem[]> {
  const rows = await mediaRows("branch-gallery", branchId);
  return rows.map((row) => ({
    key: row.id,
    id: row.id,
    url: row.url ?? "",
    path: row.storage_path ?? undefined,
  }));
}

export async function syncGallery(branchId: string, items: GalleryItem[], pendingOwnerId: string) {
  await studioData.updateWhere(
    "media",
    { owner_id: pendingOwnerId },
    { owner_id: branchId, branch_id: branchId },
  );

  const existing = await listGallery(branchId);
  const kept = new Set(items.map((item) => item.id).filter(Boolean) as string[]);

  for (const row of existing) {
    if (!row.id || kept.has(row.id)) continue;
    // Unused Cloudflare files are removed when the branch is saved.
    if (!isR2ObjectKey(row.path)) await removeStored(row.path).catch(() => undefined);
    await studioData.remove("media", row.id);
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
    await studioData.update("media", item.id, { sort_order: index, branch_id: branchId });
  }
}

export type VenueImageRecord = {
  id: string;
  url: string;
  path?: string;
  sortOrder: number;
};

export async function listVenueImages(branchId: string): Promise<VenueImageRecord[]> {
  const rows = await mediaRows("branch-venue", branchId);
  return rows.map((row) => ({
    id: row.id,
    url: row.url ?? "",
    path: row.storage_path ?? undefined,
    sortOrder: Number(row.sort_order ?? 0),
  }));
}

export async function syncVenueImages(
  branchId: string,
  venues: { imageUrl: string; imageKey?: string }[],
) {
  const existing = await listVenueImages(branchId);
  const kept = new Set<string>();

  for (const [index, venue] of venues.entries()) {
    const url = venue.imageUrl.trim();
    if (!url) continue;
    const match = existing.find((row) => row.url === url);
    if (match) {
      kept.add(match.id);
      await studioData.update("media", match.id, {
        sort_order: index,
        branch_id: branchId,
        storage_path: venue.imageKey || match.path,
      });
      continue;
    }
    const inserted = await insertMedia({
      ownerType: "branch-venue",
      ownerId: branchId,
      branchId,
      path: venue.imageKey,
      url,
      folder: "venue",
      sortOrder: index,
    });
    kept.add(inserted.id);
  }

  for (const row of existing) {
    if (kept.has(row.id)) continue;
    await studioData.remove("media", row.id);
  }
}

export async function getBranchVideo(branchId: string): Promise<string> {
  const [row] = await mediaRows("branch-video", branchId);
  return row?.url ?? "";
}

export async function syncBranchVideo(branchId: string, videoUrl: string) {
  const trimmed = videoUrl.trim();
  const existing = await mediaRows("branch-video", branchId);

  if (!trimmed) {
    for (const row of existing) await studioData.remove("media", row.id);
    return;
  }

  const [first, ...rest] = existing;
  if (first) {
    await studioData.update("media", first.id, {
      url: trimmed,
      branch_id: branchId,
      sort_order: 0,
    });
    for (const extra of rest) await studioData.remove("media", extra.id);
    return;
  }

  await insertMedia({
    ownerType: "branch-video",
    ownerId: branchId,
    branchId,
    url: trimmed,
    folder: "branches",
    sortOrder: 0,
  });
}
