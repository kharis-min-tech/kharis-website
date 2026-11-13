import { NextResponse } from "next/server";
import {
  MAX_BRANCH_IMAGE_BYTES,
  branchImageObjectKey,
  isBranchId,
  isBranchImageCategory,
  isBranchImageContentType,
} from "@/lib/branch-image-paths";
import {
  branchImagePublicUrl,
  ensureBranchImageFolder,
  deleteUnusedBranchImages,
  storeBranchImage,
} from "@/lib/r2";
import { branchImageKeyFromUrl } from "@/lib/branch-image-paths";
import {
  studioBranch,
  studioBranchMedia,
  studioCanEditBranch,
  studioUserFromRequest,
  type StudioSession,
} from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

async function forbiddenUnlessEditable(studio: StudioSession, branchId: string) {
  if (await studioCanEditBranch(studio, branchId)) return null;
  return NextResponse.json({ error: "You can't edit this branch." }, { status: 403 });
}

export async function POST(request: Request) {
  const studio = await studioUserFromRequest(request);
  if (!studio) {
    return NextResponse.json({ error: "Sign in again to upload images." }, { status: 401 });
  }

  const requestType = request.headers.get("content-type") || "";
  if (requestType.includes("multipart/form-data")) {
    return storeUploadedBranchImage(request, studio);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The upload request was not valid." }, { status: 400 });
  }

  const input = body as {
    branchId?: unknown;
    ensureFolder?: unknown;
    prune?: unknown;
    deleteFolder?: unknown;
  };
  const branchId = typeof input.branchId === "string" ? input.branchId : "";
  if (input.prune === true || input.deleteFolder === true) {
    return pruneBranchFolder(branchId, studio, input.deleteFolder === true);
  }
  if (input.ensureFolder !== true) {
    return NextResponse.json({ error: "The upload request was not valid." }, { status: 400 });
  }
  if (!isBranchId(branchId)) {
    return NextResponse.json(
      { error: "Save the branch before creating its image folder." },
      { status: 400 },
    );
  }
  const forbidden = await forbiddenUnlessEditable(studio, branchId);
  if (forbidden) return forbidden;

  const missing = await missingBranch(studio, branchId);
  if (missing) return missing;

  try {
    const key = await ensureBranchImageFolder(branchId);
    if (!key) {
      return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
    }
    return NextResponse.json({ key });
  } catch {
    return NextResponse.json(
      { error: "The Cloudflare folder could not be created. Try again." },
      { status: 502 },
    );
  }
}

async function missingBranch(studio: StudioSession, branchId: string) {
  const branch = await studioBranch(studio, branchId).catch(() => undefined);
  if (branch === undefined) {
    return NextResponse.json({ error: "The branch could not be checked." }, { status: 500 });
  }
  if (!branch) {
    return NextResponse.json({ error: "That branch could not be found." }, { status: 404 });
  }
  return null;
}

async function pruneBranchFolder(branchId: string, studio: StudioSession, deleteFolder: boolean) {
  if (!isBranchId(branchId)) {
    return NextResponse.json({ error: "That branch could not be found." }, { status: 400 });
  }
  const forbidden = await forbiddenUnlessEditable(studio, branchId);
  if (forbidden) return forbidden;
  const branch = await studioBranch(studio, branchId).catch(() => undefined);
  if (branch === undefined) {
    return NextResponse.json({ error: "The branch could not be checked." }, { status: 500 });
  }
  if (!branch) {
    return NextResponse.json({ error: "That branch could not be found." }, { status: 404 });
  }

  const keep = new Set<string>();
  if (!deleteFolder) {
    rememberImageKey(branch.hero_image_url, keep);
    rememberImageKey(branch.pastor_image_url, keep);
    const media = await studioBranchMedia(studio, branchId).catch(() => null);
    if (!media) {
      return NextResponse.json(
        { error: "The branch images could not be checked." },
        { status: 500 },
      );
    }
    for (const row of media) {
      rememberImageKey(row.url, keep);
      rememberImageKey(row.storage_path, keep);
    }
  }

  try {
    const removed = await deleteUnusedBranchImages(branchId, keep, deleteFolder);
    return NextResponse.json({ removed });
  } catch {
    return NextResponse.json(
      { error: "Unused images could not be removed from storage." },
      { status: 502 },
    );
  }
}

function rememberImageKey(value: string | null | undefined, keep: Set<string>) {
  const key = branchImageKeyFromUrl(value);
  if (key) keep.add(key);
}

async function storeUploadedBranchImage(request: Request, studio: StudioSession) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "The upload request was not valid." }, { status: 400 });
  }

  const branchId = form.get("branchId");
  const category = form.get("category");
  const file = form.get("file");
  if (typeof branchId !== "string" || !isBranchId(branchId)) {
    return NextResponse.json(
      { error: "Save the branch before uploading images." },
      { status: 400 },
    );
  }
  if (typeof category !== "string" || !isBranchImageCategory(category)) {
    return NextResponse.json({ error: "That image category is not supported." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }
  if (!isBranchImageContentType(file.type)) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP, GIF, or AVIF image." },
      { status: 400 },
    );
  }
  if (file.size <= 0 || file.size > MAX_BRANCH_IMAGE_BYTES) {
    return NextResponse.json({ error: "Images need to be 8MB or smaller." }, { status: 400 });
  }
  const forbidden = await forbiddenUnlessEditable(studio, branchId);
  if (forbidden) return forbidden;

  const missing = await missingBranch(studio, branchId);
  if (missing) return missing;

  const key = branchImageObjectKey(branchId, category, file.type);
  try {
    const stored = await storeBranchImage(key, new Uint8Array(await file.arrayBuffer()), file.type);
    if (!stored) {
      return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
    }
    const publicUrl = branchImagePublicUrl(stored.key, new URL(request.url).origin);
    return NextResponse.json({ key: stored.key, publicUrl, contentType: file.type });
  } catch {
    return NextResponse.json(
      { error: "Image storage could not be reached. Try again." },
      { status: 502 },
    );
  }
}
