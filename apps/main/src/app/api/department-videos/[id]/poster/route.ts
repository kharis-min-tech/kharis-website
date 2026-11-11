export const runtime = "nodejs";

const VALID_DRIVE_ID = /^[a-zA-Z0-9_-]{10,100}$/;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!VALID_DRIVE_ID.test(id)) {
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
