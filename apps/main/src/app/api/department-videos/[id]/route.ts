import { DEPARTMENT_VIDEOS } from "@/data/department-videos";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const department = DEPARTMENT_VIDEOS.find((item) =>
    item.src.endsWith(`/api/department-videos/${id}`),
  );

  if (!department) {
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

    const responseHeaders = new Headers({
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      "Content-Type": department.mimeType,
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
