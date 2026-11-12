import { NextResponse } from "next/server";
import {
  MAX_MEDIA_IMAGE_BYTES,
  MAX_MEDIA_VIDEO_BYTES,
  isMediaContentType,
  isMediaFolder,
  isMediaObjectKey,
  isVideoContentType,
  mediaKeyFromUrl,
  mediaObjectKey,
} from "@/lib/media-paths";
import { branchImagePublicUrl, deleteMediaObject, storeMediaObject } from "@/lib/r2";
import { studioUserFromRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

/**
 * Uploads a studio video or picture to Cloudflare R2 (kharis-images, site-media/).
 * The file is sent as the raw request body so it streams straight into R2.
 *   Content-Type: the file's MIME type
 *   X-Media-Folder: one of MEDIA_FOLDERS
 *   X-File-Name: original file name (URI encoded)
 * Responds with { key, publicUrl }. Only publicUrl is stored in Supabase.
 */
export async function POST(request: Request) {
  const studio = await studioUserFromRequest(request);
  if (!studio) {
    return NextResponse.json({ error: "Sign in again to upload files." }, { status: 401 });
  }

  const contentType = (request.headers.get("content-type") || "").split(";")[0]!.trim();
  const folder = request.headers.get("x-media-folder") || "";
  const fileName = decodeURIComponent(request.headers.get("x-file-name") || "file");
  const size = Number(request.headers.get("content-length") || 0);

  if (!isMediaFolder(folder)) {
    return NextResponse.json({ error: "That upload folder is not supported." }, { status: 400 });
  }
  if (!isMediaContentType(contentType)) {
    return NextResponse.json(
      { error: "Use an MP4, MOV or WebM video, or a JPEG, PNG, WebP, GIF or AVIF image." },
      { status: 400 },
    );
  }
  const video = isVideoContentType(contentType);
  const limit = video ? MAX_MEDIA_VIDEO_BYTES : MAX_MEDIA_IMAGE_BYTES;
  if (!size || size > limit) {
    return NextResponse.json(
      { error: video ? "Videos need to be 95MB or smaller." : "Images need to be 8MB or smaller." },
      { status: 413 },
    );
  }
  if (!request.body) {
    return NextResponse.json({ error: "The upload was empty." }, { status: 400 });
  }

  const key = mediaObjectKey(folder, fileName);
  try {
    const stored = await storeMediaObject(key, request.body, contentType);
    if (!stored) {
      return NextResponse.json({ error: "File storage is not configured." }, { status: 503 });
    }
    const publicUrl = branchImagePublicUrl(stored.key, new URL(request.url).origin);
    return NextResponse.json({ key: stored.key, publicUrl });
  } catch {
    return NextResponse.json(
      { error: "File storage could not be reached. Try again." },
      { status: 502 },
    );
  }
}

/** Removes a replaced or cleared upload. Body: { url } or { key }. */
export async function DELETE(request: Request) {
  const studio = await studioUserFromRequest(request);
  if (!studio) {
    return NextResponse.json({ error: "Sign in again to remove files." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { url?: string; key?: string } | null;
  const key = mediaKeyFromUrl(body?.key || body?.url);
  if (!isMediaObjectKey(key)) {
    return NextResponse.json({ error: "That file cannot be removed here." }, { status: 400 });
  }
  try {
    await deleteMediaObject(key);
    return NextResponse.json({ removed: key });
  } catch {
    return NextResponse.json({ error: "The file could not be removed." }, { status: 502 });
  }
}
