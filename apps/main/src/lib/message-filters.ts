import type { MessageVideo } from "@/lib/youtube";

export type MessageTopic = {
  id: string;
  label: string;
  match: RegExp;
};

/**
 * Topics are matched against message titles (YouTube gives no tags we can rely on).
 * Kept to the topics and series with the most messages so the filter fits on one row.
 */
export const MESSAGE_TOPICS: MessageTopic[] = [
  {
    id: "jesus",
    label: "Jesus",
    match: /\bjesus\b|\bchrist\b|\bcross\b|\bresurrection\b|virgin birth|\bemmanuel\b/,
  },
  { id: "bible", label: "Bible", match: /\bbible\b|\bword\b|\bscripture|\blogos\b|\bgospel\b/ },
  { id: "prayer", label: "Prayer", match: /\bpray|\bfast/ },
  { id: "love", label: "Love", match: /\blov(e|es|ed|ing)\b|\brelationship|\bheart\b/ },
  { id: "purpose", label: "Purpose", match: /\bpurpose\b|\bassignment\b|\bmission|\bcalling\b/ },
  { id: "acts", label: "Acts", match: /\bacts\b/ },
  { id: "just-men", label: "Just Men", match: /just men/ },
  { id: "fragrance", label: "Fragrance", match: /\bfragrance\b/ },
];

export function matchesTopic(message: MessageVideo, topicId: string) {
  const topic = MESSAGE_TOPICS.find((t) => t.id === topicId);
  if (!topic) return true;
  // Most titles end in "| Kharis Church", which would put everything under Church.
  const title = message.title.toLowerCase().replace(/kharis church/g, "");
  return topic.match.test(title);
}

/** Every word of the search has to appear somewhere in the title, in any order. */
export function matchesQuery(message: MessageVideo, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const title = message.title.toLowerCase();
  return words.every((w) => title.includes(w));
}

export function messageYear(message: MessageVideo): number | null {
  return message.publishedAt ? new Date(message.publishedAt).getFullYear() : null;
}

/** Years that have messages, newest first. */
export function messageYears(messages: MessageVideo[]): number[] {
  const years = new Set<number>();
  for (const m of messages) {
    const year = messageYear(m);
    if (year) years.add(year);
  }
  return [...years].sort((a, b) => b - a);
}
