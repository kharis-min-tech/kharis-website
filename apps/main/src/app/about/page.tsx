import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutPageSwitch } from "@/components/AboutPageSwitch";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchSiteContents, mediaOrFallback, singleSlot } from "@/lib/site-contents";

export const metadata: Metadata = {
  title: "About | Kharis Church",
  description:
    "Discover the meaning of Kharis, our Statement of Faith, mission, vision, and Pastors David and Awo Antwi.",
};

const SCROLL_HERO_FALLBACK =
  "https://images.kharis.org/site-images/main/e01fad6602636193/about-outreach-hero.jpg";
const MISSION_HERO_FALLBACK =
  "https://images.kharis.org/site-images/main/11577f5e512c33cd/about-mission-outreach.jpg";
const VISION_HERO_FALLBACK =
  "https://images.kharis.org/site-images/main/a080e8123b487573/vision-church-family.jpg";
const LEADERSHIP_HERO_FALLBACK =
  "https://images.kharis.org/site-images/main/61b5f617ef58872c/about-pastors-portrait.jpg";

export default async function AboutPage() {
  const contents = await fetchSiteContents("kharis");

  return (
    <main className="bg-bg text-fg">
      <Suspense fallback={null}>
        <AboutPageSwitch
          scrollHeroUrl={mediaOrFallback(
            singleSlot(contents, "about", "scrollHero"),
            SCROLL_HERO_FALLBACK,
          )}
          chapterHeroes={{
            mission: mediaOrFallback(
              singleSlot(contents, "about", "missionHero"),
              MISSION_HERO_FALLBACK,
            ),
            vision: mediaOrFallback(
              singleSlot(contents, "about", "visionHero"),
              VISION_HERO_FALLBACK,
            ),
            leadership: mediaOrFallback(
              singleSlot(contents, "about", "leadershipHero"),
              LEADERSHIP_HERO_FALLBACK,
            ),
          }}
        />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
