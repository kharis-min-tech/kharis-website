import type { MessageVideo } from "@/lib/youtube";

export type MessageTopic = {
  id: string;
  label: string;
  icon: string;
  match: RegExp;
};

/** Matched against sermon titles. YouTube does not give us reliable tags. */
export const MESSAGE_TOPICS: MessageTopic[] = [
  {
    id: "jesus",
    label: "Jesus",
    icon: "church",
    match: /\bjesus\b|\bchrist\b|\bcross\b|\bresurrection\b|virgin birth|\bemmanuel\b/,
  },
  {
    id: "bible",
    label: "Bible",
    icon: "menu_book",
    match: /\bbible\b|\bword\b|\bscripture|\blogos\b|\bgospel\b/,
  },
  { id: "prayer", label: "Prayer", icon: "prayer_times", match: /\bpray|\bfast/ },
  {
    id: "love",
    label: "Love",
    icon: "favorite",
    match: /\blov(e|es|ed|ing)\b|\brelationship|\bheart\b/,
  },
  {
    id: "purpose",
    label: "Purpose",
    icon: "explore",
    match: /\bpurpose\b|\bassignment\b|\bmission|\bcalling\b/,
  },
  { id: "acts", label: "Acts", icon: "local_fire_department", match: /\bacts\b/ },
  { id: "just-men", label: "Just Men", icon: "groups", match: /just men/ },
  { id: "fragrance", label: "Fragrance", icon: "spa", match: /\bfragrance\b/ },
];

export function matchesTopic(message: MessageVideo, topicId: string) {
  const topic = MESSAGE_TOPICS.find((item) => item.id === topicId);
  if (!topic) return true;
  const title = message.title.toLowerCase().replace(/kharis church/g, "");
  return topic.match.test(title);
}

export function matchesQuery(message: MessageVideo, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const title = message.title.toLowerCase();
  return words.every((word) => title.includes(word));
}
