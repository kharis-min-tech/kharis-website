import Page from "@/components/pages/messages";
import { fetchLatestMessages, fetchPastorMessages } from "@/lib/youtube";
import { fetchSiteContents, mediaOrFallback, singleSlot } from "@/lib/site-contents";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Messages",
  description:
    "Search, preview and watch Christ-centred teachings from David Antwi, and listen on every major podcast platform.",
  path: "/messages",
});

export default async function Messages() {
  const [latest, messages, contents] = await Promise.all([
    fetchLatestMessages(4),
    fetchPastorMessages(120),
    fetchSiteContents("kp2"),
  ]);
  const heroBackground = mediaOrFallback(
    singleSlot(contents, "messages", "heroBackground"),
    "https://images.kharis.org/site-images/kp2/a991d1457f200aa6/pastor-david-at-pulpit.jpg",
  );
  return <Page latest={latest} messages={messages} heroBackground={heroBackground} />;
}
