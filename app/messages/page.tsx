import Page from "@/components/pages/messages";
import { fetchPastorMessages } from "@/lib/youtube";
import { pageMeta } from "@/lib/seo";

export const revalidate = 1800;

export const metadata = pageMeta({
  title: "Messages",
  description:
    "Watch the latest teachings from Pastor David Antwi — Sunday messages, Just Men, and the Kharis Phase 2 archive on YouTube.",
  path: "/messages",
});

export default async function Messages() {
  const messages = await fetchPastorMessages(18);
  return <Page messages={messages} />;
}
