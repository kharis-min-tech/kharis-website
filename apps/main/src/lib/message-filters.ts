import type { MessageVideo } from "@/lib/youtube";

export type MessageTopic = {
  id: string;
  label: string;
  match: RegExp;
};

/** Topics are matched against message titles (YouTube gives no tags we can rely on). */
export const MESSAGE_TOPICS: MessageTopic[] = [
  { id: "faith", label: "Faith", match: /\bfaith\b|\bbeliev/ },
  { id: "bible", label: "Bible", match: /\bbible\b|\bword\b|\bscripture|\blogos\b|\bgospel\b/ },
  { id: "love", label: "Love", match: /\blov(e|es|ed|ing)\b|\brelationship|\bheart\b/ },
  {
    id: "jesus",
    label: "Jesus",
    match: /\bjesus\b|\bchrist\b|\bcross\b|\bresurrection\b|virgin birth|\bemmanuel\b/,
  },
  {
    id: "holy-spirit",
    label: "Holy Spirit",
    match: /holy spirit|\bspirit\b|\brevival\b|\bsupernatural\b|\bimpartation\b|\bawakening\b/,
  },
  { id: "prayer-fasting", label: "Prayer & Fasting", match: /\bpray|\bfast/ },
  {
    id: "hope",
    label: "Hope",
    match: /\bhope\b|\bpromise|\bstorm\b|\bsuffer|\banxiety\b|\bforsaken\b|\bcrisis\b/,
  },
  { id: "purpose", label: "Purpose", match: /\bpurpose\b|\bassignment\b|\bmission|\bcalling\b/ },
  { id: "church", label: "Church", match: /\bchurch\b|\bleaders\b|\bserv(e|ing)\b/ },
  { id: "just-men", label: "Just Men", match: /just men/ },
  { id: "fragrance", label: "The Fragrance", match: /\bfragrance\b/ },
  { id: "acts", label: "Book of Acts", match: /\bacts\b/ },
];

export function matchesTopic(message: MessageVideo, topicId: string) {
  const topic = MESSAGE_TOPICS.find((t) => t.id === topicId);
  if (!topic) return true;
  // Most titles end in "| Kharis Church", which would put everything under Church.
  const title = message.title.toLowerCase().replace(/kharis church/g, "");
  return topic.match.test(title);
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
