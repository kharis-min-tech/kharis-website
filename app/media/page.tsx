import type { Metadata } from "next";
import Page from "@/components/pages/media";
import { fetchLatestMessages } from "@/lib/youtube";
import { fetchInstagramPosts } from "@/lib/instagram-feed";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Media & Socials | Kharis Phase 2",
  openGraph: {
    title: "Media & Socials | Kharis Phase 2",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Media() {
  const [messages, posts] = await Promise.all([
    fetchLatestMessages(4),
    fetchInstagramPosts(6),
  ]);
  return <Page messages={messages} posts={posts} />;
}
