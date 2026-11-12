export const runtime = "nodejs";

const VALID_DRIVE_ID = /^[a-zA-Z0-9_-]{10,100}$/;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!VALID_DRIVE_ID.test(id)) {
    return new Response("Video not found", { status: 404 });
  }

  const upstreamUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
  const headers = new Headers();
  const range = request.headers.get("range");
  if (range) headers.set("range", range);

  try {
    const upstream = await fetch(upstreamUrl, { headers, redirect: "follow" });
    if (!upstream.ok && upstream.status !== 206) {
      return new Response("Video stream unavailable", { status: upstream.status });
    }

    const upstreamType = upstream.headers.get("content-type") || "";
    const contentType = upstreamType.startsWith("video/") ? upstreamType : "video/mp4";

    const responseHeaders = new Headers({
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    });
    for (const header of ["content-length", "content-range"]) {
      const value = upstream.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return new Response("Video stream unavailable", { status: 502 });
  }
}
