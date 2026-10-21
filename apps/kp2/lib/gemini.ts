type Turn = { role: "user" | "assistant"; content: string };

const MODELS = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.5-flash"] as const;

export function chatTurns(input: unknown): Turn[] {
  if (!Array.isArray(input)) return [];
  const turns: Turn[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const role = (raw as { role?: string }).role;
    const content = String((raw as { content?: unknown }).content ?? "").trim();
    if ((role === "user" || role === "assistant") && content && content.length <= 1500) {
      turns.push({ role, content });
    }
    if (turns.length >= 12) break;
  }
  while (turns.length && turns[0].role === "assistant") turns.shift();
  return turns;
}

export async function askGemini(apiKey: string, system: string, turns: Turn[]) {
  const contents = turns.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }],
  }));

  for (const model of MODELS) {
    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 400,
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        },
      );
    } catch {
      continue;
    }

    if (response.status === 404) continue;
    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) continue;
      return { ok: false as const, error: "Something went wrong. Please try again in a moment." };
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim() || "";
    if (reply) return { ok: true as const, reply };
  }

  return {
    ok: false as const,
    error: "I'm a bit busy right now, please try again in a moment.",
  };
}
