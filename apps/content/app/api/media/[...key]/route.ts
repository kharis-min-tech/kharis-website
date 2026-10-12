import { NextResponse } from "next/server";
import { readBranchImage } from "@/lib/r2";

export const dynamic = "force-dynamic";

/** Serves a branch photo from Cloudflare R2 when the bucket has no public domain yet. */
export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key: parts } = await context.params;
  const key = parts.map((part) => decodeURIComponent(part)).join("/");
  if (!key.startsWith("branch-images/") || key.includes("..")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const image = await readBranchImage(key);
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const copy = new Uint8Array(image.bytes.byteLength);
    copy.set(image.bytes);
    return new NextResponse(new Blob([copy]), {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "The image could not be loaded." }, { status: 502 });
  }
}
