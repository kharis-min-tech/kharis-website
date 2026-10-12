import { NextResponse } from "next/server";
import {
  MAX_BRANCH_IMAGE_BYTES,
  branchImageObjectKey,
  isBranchId,
  isBranchImageCategory,
  isBranchImageContentType,
} from "@/lib/branch-image-paths";
import { presignBranchUpload } from "@/lib/r2";
import { studioUserFromRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const studio = await studioUserFromRequest(request);
  if (!studio) {
    return NextResponse.json({ error: "Sign in again to upload images." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The upload request was not valid." }, { status: 400 });
  }

  const input = body as { branchId?: unknown; category?: unknown; contentType?: unknown; fileSize?: unknown };
  const branchId = typeof input.branchId === "string" ? input.branchId : "";
  const category = typeof input.category === "string" ? input.category : "";
  const contentType = typeof input.contentType === "string" ? input.contentType : "";
  const fileSize = typeof input.fileSize === "number" ? input.fileSize : Number.NaN;

  if (!isBranchId(branchId)) {
    return NextResponse.json({ error: "Save the branch before uploading images." }, { status: 400 });
  }
  if (!isBranchImageCategory(category)) {
    return NextResponse.json({ error: "That image category is not supported." }, { status: 400 });
  }
  if (!isBranchImageContentType(contentType)) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF, or AVIF image." }, { status: 400 });
  }
  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_BRANCH_IMAGE_BYTES) {
    return NextResponse.json({ error: "Images need to be 8MB or smaller." }, { status: 400 });
  }

  const branch = await studio.supabase.from("branches").select("id").eq("id", branchId).maybeSingle();
  if (branch.error) {
    return NextResponse.json({ error: "The branch could not be checked." }, { status: 500 });
  }
  if (!branch.data) {
    return NextResponse.json({ error: "That branch could not be found." }, { status: 404 });
  }

  const key = branchImageObjectKey(branchId, category, contentType);
  let signed: Awaited<ReturnType<typeof presignBranchUpload>>;
  try {
    signed = await presignBranchUpload(key, contentType, fileSize);
  } catch {
    return NextResponse.json({ error: "Image storage could not be reached. Try again." }, { status: 502 });
  }
  if (!signed) {
    return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
  }

  return NextResponse.json({
    uploadUrl: signed.uploadUrl,
    key: signed.key,
    publicUrl: signed.publicUrl,
    contentType,
  });
}
