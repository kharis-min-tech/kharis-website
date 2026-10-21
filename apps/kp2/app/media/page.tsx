import Page from "@/components/pages/media";
import { pageMeta } from "@/lib/seo";

export const revalidate = 1800;

export const metadata = pageMeta({
  title: "Socials & Media",
  description:
    "Follow Kharis Phase 2 on Instagram, YouTube, TikTok, Spotify and SoundCloud. Latest posts and reels from @kharisphasetwo.",
  path: "/media",
});

export default function Media() {
  return <Page />;
}
