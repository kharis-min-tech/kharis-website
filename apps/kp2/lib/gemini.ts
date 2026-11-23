import {
  recentGraceTurns,
  graceModelContents,
  type GraceTurn,
} from "../../../shared/grace-history";

const MODELS = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.5-flash"] as const;

export function chatTurns(input: unknown): GraceTurn[] {
  return recentGraceTurns(input, 12, 1500);
}

export async function askGemini(apiKey: string, system: string, turns: GraceTurn[]) {
  const contents = graceModelContents(turns);

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
