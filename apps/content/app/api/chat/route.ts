import { askGemini, chatTurns } from "@/lib/gemini";
import { cleanPage, studioSystemPrompt } from "@/lib/grace";
import { studioUserFromRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const studio = await studioUserFromRequest(request);
  if (!studio) {
    return Response.json({ ok: false, error: "Sign in again to ask Grace." }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: "Chat is not configured yet." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const turns = chatTurns((body as { messages?: unknown })?.messages);
  if (!turns.length || turns[turns.length - 1]?.role !== "user") {
    return Response.json({ ok: false, error: "Please send a message." }, { status: 400 });
  }

  const page = cleanPage((body as { page?: unknown })?.page);
  const result = await askGemini(apiKey, studioSystemPrompt(page), turns);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true, reply: result.reply });
}
