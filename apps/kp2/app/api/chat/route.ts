import { getCloudflareContext } from "@opennextjs/cloudflare";
import { recentGraceTurns } from "../../../../../shared/grace-history";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MainChatWorker {
  fetch(request: Request): Promise<Response>;
}

export async function POST(request: Request) {
  let body: { messages?: unknown; page?: unknown } | null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const messages = recentGraceTurns(body?.messages, 12, 1500);
  if (!messages.length) {
    return Response.json({ ok: false, error: "Please send a message." }, { status: 400 });
  }

  try {
    const origin =
      process.env.KHARIS_MAIN_CHAT_ORIGIN ||
      (process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : undefined);
    const upstream = new Request(new URL("/api/chat", origin || "https://kharis-main.internal"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ site: "kp2", page: body?.page, messages }),
      redirect: "error",
      signal: request.signal,
    });
    let response: Response;
    if (origin) {
      response = await fetch(upstream);
    } else {
      const { env } = getCloudflareContext();
      const main = (env as unknown as { KHARIS_MAIN: MainChatWorker }).KHARIS_MAIN;
      response = await main.fetch(upstream);
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      await response.body?.cancel();
      throw new Error("Unexpected Grace response format");
    }
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { ok: false, error: "Grace couldn't connect just now. Please try again." },
      { status: 502 },
    );
  }
}
