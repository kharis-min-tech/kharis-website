import {
  buildGraceSystemPrompt,
  buildKharisChatContext,
  GRACE_MESSAGE_LIMIT,
} from "@/lib/chat-context";
import { extractMessageMarkerIds } from "@/lib/grace-markers";
import { fetchPastorMessages, type MessageVideo } from "@/lib/youtube";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatMessageCard = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
};

const MAX_MESSAGES = 16;
const MAX_CONTENT = 2000;
/** Prefer current Flash; fall back if a model is overloaded or missing. */
const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash",
] as const;
const MAX_RETRIES = 2;
const RETRY_BASE_MS = 450;

const GENERATION_CONFIG = {
  // Friendly helper: short answers, not essay dumps.
  temperature: 0.45,
  maxOutputTokens: 420,
  // Keep replies snappy; thinking models can burn the output budget.
  thinkingConfig: { thinkingBudget: 0 },
};

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const out: ChatMessage[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const role = (raw as { role?: string }).role;
    const content = String((raw as { content?: unknown }).content ?? "").trim();
    if (
      (role === "user" || role === "assistant") &&
      content &&
      content.length <= MAX_CONTENT
    ) {
      out.push({ role, content });
    }
    if (out.length >= MAX_MESSAGES) break;
  }
  return out;
}

function toGeminiContents(messages: ChatMessage[]) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  // Gemini requires the first turn to be "user" — drop the UI welcome bubble.
  while (contents.length && contents[0].role === "model") {
    contents.shift();
  }
  return contents;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractYoutubeIds(text: string): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const re =
    /(?:youtube\.com\/(?:watch\?[^.\s]*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const id = m[1];
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
    if (ids.length >= 6) break;
  }
  return ids;
}

function cardsFromReply(
  reply: string,
  catalog: MessageVideo[],
): ChatMessageCard[] {
  const byId = new Map(catalog.map((m) => [m.id, m]));

  // Primary: [[MESSAGE:video_id]] markers, only for ids in the catalog.
  const markerCards: ChatMessageCard[] = [];
  for (const id of extractMessageMarkerIds(reply)) {
    const hit = byId.get(id);
    if (!hit) continue;
    markerCards.push({
      id,
      title: hit.title,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: hit.thumbnail || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    });
  }
  if (markerCards.length) return markerCards;

  // Fallback: raw YouTube URLs in the reply.
  const cards: ChatMessageCard[] = [];
  for (const id of extractYoutubeIds(reply)) {
    const hit = byId.get(id);
    cards.push({
      id,
      title: hit?.title || "Pastor David message",
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail:
        hit?.thumbnail || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    });
  }
  return cards;
}

type GeminiResult =
  | { ok: true; reply: string }
  | { ok: false; status: number; error: string; retryable: boolean };

function geminiBody(systemText: string, contents: ReturnType<typeof toGeminiContents>) {
  return JSON.stringify({
    systemInstruction: {
      parts: [{ text: systemText }],
    },
    contents,
    generationConfig: GENERATION_CONFIG,
  });
}

function classifyGeminiHttpError(
  model: string,
  status: number,
  data?: { error?: { message?: string; status?: string; code?: number } },
): GeminiResult {
  if (status === 429) {
    return {
      ok: false,
      status: 429,
      error: "I'm a bit busy right now, please try again in a moment.",
      retryable: true,
    };
  }

  if (status === 503 || data?.error?.status === "UNAVAILABLE") {
    return {
      ok: false,
      status: 503,
      error: "I'm a bit busy right now, please try again in a moment.",
      retryable: true,
    };
  }

  console.error("[api/chat] Gemini error", model, status, data?.error);
  return {
    ok: false,
    status,
    error: "Something went wrong. Please try again in a moment.",
    // Retry same model only for transient overload; 404 → next model.
    retryable: status >= 500,
  };
}

async function callGemini(opts: {
  apiKey: string;
  model: string;
  systemText: string;
  contents: ReturnType<typeof toGeminiContents>;
}): Promise<GeminiResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${encodeURIComponent(opts.apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: geminiBody(opts.systemText, opts.contents),
  });

  const data = (await res.json()) as {
    error?: { message?: string; status?: string; code?: number };
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
  };

  if (!res.ok) {
    return classifyGeminiHttpError(opts.model, res.status, data);
  }

  const reply =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("")
      .trim() ||
    "I am here with you. Could you ask that another way?";

  return { ok: true, reply };
}

async function generateWithFallback(opts: {
  apiKey: string;
  systemText: string;
  contents: ReturnType<typeof toGeminiContents>;
  /** Skip models already tried via streaming. */
  skipModels?: ReadonlySet<string>;
}): Promise<GeminiResult> {
  let last: GeminiResult = {
    ok: false,
    status: 502,
    error: "Something went wrong. Please try again in a moment.",
    retryable: false,
  };

  for (const model of GEMINI_MODELS) {
    if (opts.skipModels?.has(model)) continue;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        await sleep(RETRY_BASE_MS * attempt);
      }
      try {
        const result = await callGemini({ ...opts, model });
        if (result.ok) return result;
        last = result;
        // 404 / permanent errors → try next model immediately.
        if (!result.retryable) break;
        // 429/503 → retry same model, then fall through to next.
      } catch (err) {
        console.error("[api/chat] fetch failed", model, err);
        last = {
          ok: false,
          status: 502,
          error: "Something went wrong. Please try again in a moment.",
          retryable: true,
        };
      }
    }
  }

  return last;
}

type StreamChunkResult =
  | { ok: true; reply: string }
  | { ok: false; status: number; error: string; retryable: boolean };

/**
 * Stream from Gemini (SSE) and forward text deltas via onChunk.
 * Returns the full assembled reply when the upstream stream completes.
 */
async function streamGemini(opts: {
  apiKey: string;
  model: string;
  systemText: string;
  contents: ReturnType<typeof toGeminiContents>;
  onChunk: (text: string) => void;
}): Promise<StreamChunkResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(opts.apiKey)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: geminiBody(opts.systemText, opts.contents),
    });
  } catch (err) {
    console.error("[api/chat] stream fetch failed", opts.model, err);
    return {
      ok: false,
      status: 502,
      error: "Something went wrong. Please try again in a moment.",
      retryable: true,
    };
  }

  if (!res.ok) {
    let data: { error?: { message?: string; status?: string; code?: number } } =
      {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
      /* ignore */
    }
    return classifyGeminiHttpError(opts.model, res.status, data);
  }

  if (!res.body) {
    return {
      ok: false,
      status: 502,
      error: "Something went wrong. Please try again in a moment.",
      retryable: true,
    };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let reply = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Gemini alt=sse: lines like `data: {...}` separated by blank lines.
      const parts = buffer.split("\n");
      buffer = parts.pop() ?? "";

      for (const line of parts) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;

        let json: {
          error?: { message?: string; status?: string };
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
          }>;
        };
        try {
          json = JSON.parse(payload) as typeof json;
        } catch {
          continue;
        }

        if (json.error) {
          const status =
            json.error.status === "UNAVAILABLE" ||
            /resource.?exhausted|quota/i.test(json.error.message || "")
              ? 503
              : 502;
          return {
            ok: false,
            status,
            error: "I'm a bit busy right now, please try again in a moment.",
            retryable: true,
          };
        }

        const piece =
          json.candidates?.[0]?.content?.parts
            ?.map((p) => p.text || "")
            .join("") || "";
        if (piece) {
          reply += piece;
          opts.onChunk(piece);
        }
      }
    }
  } catch (err) {
    console.error("[api/chat] stream read failed", opts.model, err);
    if (reply.trim()) {
      // Partial reply is better than nothing if we already streamed some text.
      return { ok: true, reply: reply.trim() };
    }
    return {
      ok: false,
      status: 502,
      error: "Something went wrong. Please try again in a moment.",
      retryable: true,
    };
  }

  const trimmed = reply.trim();
  if (!trimmed) {
    return {
      ok: false,
      status: 502,
      error: "Something went wrong. Please try again in a moment.",
      retryable: true,
    };
  }

  return { ok: true, reply: trimmed };
}

function sseEncode(obj: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`);
}

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError("Chat is not configured yet.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request.", 400);
  }

  const messages = sanitizeMessages(
    (body as { messages?: unknown })?.messages,
  );
  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    return jsonError("Please send a message.", 400);
  }

  const contents = toGeminiContents(messages);
  if (!contents.length) {
    return jsonError("Please send a message.", 400);
  }

  let siteContext: string;
  let catalog: MessageVideo[];
  try {
    const catalogSource = fetchPastorMessages(GRACE_MESSAGE_LIMIT).catch(
      () => [] as MessageVideo[],
    );
    [siteContext, catalog] = await Promise.all([
      buildKharisChatContext(catalogSource),
      catalogSource,
    ]);
  } catch (err) {
    console.error("[api/chat] context", err);
    return jsonError(
      "Something went wrong. Please try again in a moment.",
      502,
    );
  }

  const systemText = buildGraceSystemPrompt(siteContext);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => {
        try {
          controller.enqueue(sseEncode(obj));
        } catch {
          /* client gone */
        }
      };

      const primary = GEMINI_MODELS[0];
      let streamedText = "";
      let streamResult: StreamChunkResult | null = null;

      // Stream on primary model with brief retries for transient overload.
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        if (attempt > 0) {
          await sleep(RETRY_BASE_MS * attempt);
        }
        // If a previous attempt already pushed tokens, do not retry streaming
        // (would duplicate text); fall through to non-stream only if empty.
        if (streamedText) break;

        streamResult = await streamGemini({
          apiKey,
          model: primary,
          systemText,
          contents,
          onChunk: (text) => {
            streamedText += text;
            send({ type: "chunk", text });
          },
        });

        if (streamResult.ok) break;
        if (!streamResult.retryable) break;
      }

      if (streamResult?.ok) {
        const cards = cardsFromReply(streamResult.reply, catalog);
        send({
          type: "done",
          reply: streamResult.reply,
          ...(cards.length ? { cards } : {}),
        });
        controller.close();
        return;
      }

      // Partial tokens already shown — finish with what we have + cards.
      if (streamedText.trim()) {
        const reply = streamedText.trim();
        const cards = cardsFromReply(reply, catalog);
        send({
          type: "done",
          reply,
          ...(cards.length ? { cards } : {}),
        });
        controller.close();
        return;
      }

      // Primary streaming failed with no text → non-stream fallback across models.
      const fallback = await generateWithFallback({
        apiKey,
        systemText,
        contents,
        // Skip primary only when it is permanently unavailable (e.g. 404).
        skipModels:
          streamResult && !streamResult.retryable
            ? new Set([primary])
            : undefined,
      });

      if (!fallback.ok) {
        send({
          type: "error",
          error: fallback.error,
        });
        controller.close();
        return;
      }

      send({ type: "chunk", text: fallback.reply });
      const cards = cardsFromReply(fallback.reply, catalog);
      send({
        type: "done",
        reply: fallback.reply,
        ...(cards.length ? { cards } : {}),
      });
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
