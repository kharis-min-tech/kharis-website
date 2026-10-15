import type { MessageVideo } from "@/lib/youtube";

export type MessageTopic = {
  id: string;
  label: string;
  match: RegExp;
};

/**
 * Teaching themes matched against message titles (YouTube gives no tags we can rely on).
 * Series (Just Men, Fragrance, Let the Bible Speak…) already have their own shelves,
 * so none of these labels repeat a shelf heading. Themes with no messages are hidden.
 */
export const MESSAGE_TOPICS: MessageTopic[] = [
  {
    id: "jesus",
    label: "Jesus",
    match: /\bjesus\b|\bchrist\b|\bcross\b|\blogos\b|\bresurrection\b|virgin birth|\bemmanuel\b/,
  },
  {
    id: "faith",
    label: "Faith",
    match: /\bfaith|\bbeliev|\btrust\b|\bstorm\b|\bfear\b|\bforsaken\b|\bovercom|\bsatisfied\b/,
  },
  {
    id: "doctrine",
    label: "Doctrine",
    match:
      /\bdoctrine|\blogos\b|\bsin\b|\bbaptism\b|\brepentance\b|\bapologetics\b|\beternally\b|virgin birth|\btrinity\b|\bscripture|bible live/,
  },
  {
    id: "salvation",
    label: "Salvation",
    match:
      /\bsav(e|ed|es|ing|iou?r)\b|\bsalvation\b|\bgrace\b|\bmercy\b|\brepent|\bbaptism\b|\bcross\b|\bredeem|\bforgiv/,
  },
  {
    id: "purpose",
    label: "Purpose",
    match:
      /\bpurpose\b|\bassignment\b|\bmission|\bcalling\b|\bministry\b|\bmentorship\b|\bevangeli|church planting/,
  },
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
