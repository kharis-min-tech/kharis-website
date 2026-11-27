import { describe, expect, it } from "vitest";
import { graceModelContents, recentGraceTurns } from "./grace-history";

describe.each([
  [12, 1500],
  [16, 2000],
])("Grace conversation window of %i turns", (limit, maxLength) => {
  it("keeps the latest question and its preceding replies in long conversations", () => {
    const messages = Array.from({ length: 25 }, (_, i) => ({
      role: i % 2 ? "assistant" : "user",
      content: String(i),
    }));
    const turns = recentGraceTurns(messages, limit, maxLength);
    expect(turns.length).toBeLessThanOrEqual(limit);
    expect(turns[0].role).toBe("user");
    expect(turns.slice(-2)).toEqual(messages.slice(-2));
  });

  it("keeps concurrent questions and completed responses in their original order", () => {
    const turns = recentGraceTurns(
      [
        { role: "assistant", content: "Welcome" },
        { role: "user", content: "I'm in London" },
        { role: "user", content: "Which branch is closest?" },
        { role: "assistant", content: "London" },
        { role: "user", content: "When is the service?" },
      ],
      limit,
      maxLength,
    );
    expect(graceModelContents(turns)).toEqual([
      { role: "user", parts: [{ text: "I'm in London" }, { text: "Which branch is closest?" }] },
      { role: "model", parts: [{ text: "London" }] },
      { role: "user", parts: [{ text: "When is the service?" }] },
    ]);
  });

  it("rejects an invalid latest question instead of answering a previous one", () => {
    expect(
      recentGraceTurns(
        [
          { role: "user", content: "Previous" },
          { role: "user", content: " ".repeat(5) },
        ],
        limit,
        maxLength,
      ),
    ).toEqual([]);
  });
});
