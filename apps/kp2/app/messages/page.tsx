import Page from "@/components/pages/messages";
import { fetchPastorMessages } from "@/lib/youtube";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Messages",
  description:
    "Search, preview and watch Christ-centred teachings from David Antwi, and listen on every major podcast platform.",
  path: "/messages",
});

export default async function Messages() {
  const messages = await fetchPastorMessages(120);
  return <Page messages={messages} />;
}
