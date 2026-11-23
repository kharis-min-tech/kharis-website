export type GraceTurn = { role: "user" | "assistant"; content: string };

export function recentGraceTurns(input: unknown, limit: number, maxLength: number): GraceTurn[] {
  if (!Array.isArray(input)) return [];
  const latest = input.at(-1);
  if (
    latest?.role !== "user" ||
    typeof latest.content !== "string" ||
    !latest.content.trim() ||
    latest.content.trim().length > maxLength
  )
    return [];

  const turns: GraceTurn[] = [];
  for (const item of input.slice(-limit)) {
    if ((item?.role !== "user" && item?.role !== "assistant") || typeof item.content !== "string")
      continue;
    const content = item.content.trim().slice(0, maxLength);
    if (!content || (!turns.length && item.role === "assistant")) continue;
    turns.push({ role: item.role, content });
  }
  return turns;
}

export function graceModelContents(turns: GraceTurn[]) {
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
  for (const turn of turns) {
    const role = turn.role === "assistant" ? "model" : "user";
    const part = { text: turn.content };
    const last = contents.at(-1);
    if (last?.role === role) last.parts.push(part);
    else contents.push({ role, parts: [part] });
  }
  return contents;
}
