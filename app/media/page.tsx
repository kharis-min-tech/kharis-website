import Page from "@/components/pages/media";
import { fetchLatestMessages } from "@/lib/youtube";
import { fetchInstagramPosts } from "@/lib/instagram-feed";
import { pageMeta } from "@/lib/seo";

export const revalidate = 1800;

export const metadata = pageMeta({
  title: "Socials & Media",
  description:
    "Follow Kharis Phase 2 on Instagram, YouTube, Spotify and SoundCloud. Latest posts, reels and messages from @kharisphasetwo.",
  path: "/media",
});

export default async function Media() {
  const [messages, posts] = await Promise.all([
    fetchLatestMessages(4),
    fetchInstagramPosts(6),
  ]);
  return <Page messages={messages} posts={posts} />;
}
