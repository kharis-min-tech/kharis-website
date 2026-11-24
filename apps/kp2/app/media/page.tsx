import Page from "@/components/pages/media";
import { KP2_PHOTOS } from "@/lib/photography";
import { fetchSiteContents, mediaOrFallback, singleSlot } from "@/lib/site-contents";
import { pageMeta } from "@/lib/seo";

export const revalidate = 1800;

export const metadata = pageMeta({
  title: "Socials & Media",
  description:
    "Follow Kharis Phase 2 on Instagram, YouTube, TikTok, Spotify and SoundCloud. Latest posts and reels from @kharisphasetwo.",
  path: "/media",
});

export default async function Media() {
  const contents = await fetchSiteContents("kp2");
  const hero = mediaOrFallback(singleSlot(contents, "media", "hero"), KP2_PHOTOS.serviceCamera.src);
  return <Page hero={hero} />;
}
