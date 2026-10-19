import { DEPARTMENT_VIDEOS } from "@/data/department-videos";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const isDepartmentVideo = DEPARTMENT_VIDEOS.some((item) =>
    item.src.endsWith(`/api/department-videos/${id}`),
  );

  if (!isDepartmentVideo) {
    return new Response("Poster not found", { status: 404 });
  }

  try {
    const upstream = await fetch(
      `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1280`,
      { redirect: "follow" },
    );
    if (!upstream.ok || !upstream.body) {
      return new Response("Poster unavailable", { status: upstream.status || 502 });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Poster unavailable", { status: 502 });
  }
}
