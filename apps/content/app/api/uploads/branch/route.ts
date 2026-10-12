import { NextResponse } from "next/server";
import {
  MAX_BRANCH_IMAGE_BYTES,
  branchImageObjectKey,
  isBranchId,
  isBranchImageCategory,
  isBranchImageContentType,
} from "@/lib/branch-image-paths";
import { ensureBranchImageFolder, storeBranchImage } from "@/lib/r2";
import { studioUserFromRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

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
  };
  const branchId = typeof input.branchId === "string" ? input.branchId : "";
  if (input.ensureFolder !== true) {
    return NextResponse.json({ error: "The upload request was not valid." }, { status: 400 });
  }
  if (!isBranchId(branchId)) {
    return NextResponse.json({ error: "Save the branch before creating its image folder." }, { status: 400 });
  }

  const branch = await studio.supabase.from("branches").select("id").eq("id", branchId).maybeSingle();
  if (branch.error) {
    return NextResponse.json({ error: "The branch could not be checked." }, { status: 500 });
  }
  if (!branch.data) {
    return NextResponse.json({ error: "That branch could not be found." }, { status: 404 });
  }

  try {
    const key = await ensureBranchImageFolder(branchId);
    if (!key) {
      return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
    }
    return NextResponse.json({ key });
  } catch {
    return NextResponse.json({ error: "The Cloudflare folder could not be created. Try again." }, { status: 502 });
  }
}

async function storeUploadedBranchImage(
  request: Request,
  studio: NonNullable<Awaited<ReturnType<typeof studioUserFromRequest>>>,
) {
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
    return NextResponse.json({ error: "Save the branch before uploading images." }, { status: 400 });
  }
  if (typeof category !== "string" || !isBranchImageCategory(category)) {
    return NextResponse.json({ error: "That image category is not supported." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }
  if (!isBranchImageContentType(file.type)) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF, or AVIF image." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BRANCH_IMAGE_BYTES) {
    return NextResponse.json({ error: "Images need to be 8MB or smaller." }, { status: 400 });
  }

  const branch = await studio.supabase.from("branches").select("id").eq("id", branchId).maybeSingle();
  if (branch.error) {
    return NextResponse.json({ error: "The branch could not be checked." }, { status: 500 });
  }
  if (!branch.data) {
    return NextResponse.json({ error: "That branch could not be found." }, { status: 404 });
  }

  const key = branchImageObjectKey(branchId, category, file.type);
  try {
    const stored = await storeBranchImage(key, new Uint8Array(await file.arrayBuffer()), file.type);
    if (!stored) {
      return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
    }
    const publicUrl = stored.publicUrl ?? `${new URL(request.url).origin}/api/media/${stored.key}`;
    return NextResponse.json({ key: stored.key, publicUrl, contentType: file.type });
  } catch {
    return NextResponse.json({ error: "Image storage could not be reached. Try again." }, { status: 502 });
  }
}
