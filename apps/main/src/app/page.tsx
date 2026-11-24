import { Suspense } from "react";
import { BuildHouseSection } from "@/components/BuildHouseSection";
import { BandHero } from "@/components/BandHero";
import { KnowUsStack } from "@/components/KnowUsStack";
import { LatestMessages } from "@/components/LatestMessages";
import { MissionSection } from "@/components/MissionSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TestimoniesSection } from "@/components/TestimoniesSection";
import { getTestimonies } from "@/lib/testimonies";
import { VisionSection } from "@/components/VisionSection";
import { fetchLatestMessages } from "@/lib/youtube";
import { HERO_SLIDES } from "@/lib/hero-media";
import siteImageUrls from "@/lib/site-image-urls.json";
import {
  fetchSiteContents,
  heroSlidesOrFallback,
  listOrFallback,
  listSlot,
  mediaOrFallback,
  singleSlot,
} from "@/lib/site-contents";

const KNOW_US_FALLBACKS = [
  "https://images.kharis.org/site-images/main/529646bbc41f3bc3/community.jpg",
  "https://images.kharis.org/site-images/main/012b86affad979dd/home/kp2-community.webp",
  "https://images.kharis.org/site-images/main/de005ef42ce5304e/get-involved-sax.jpg",
  "https://images.kharis.org/site-images/main/e06e47b90f538fed/events/singles-ball/ballroom-overview.jpg",
];

const BUILD_HOUSE_FALLBACK =
  "https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg";

const TESTIMONY_PHOTO_FALLBACKS = [
  {
    src: siteImageUrls["/images/testimony-sharing.jpg"],
    alt: "A brother sharing his testimony on stage",
    position: "object-center",
  },
  {
    src: "https://images.kharis.org/site-images/main/cc4f9c67e2c899e3/testimony-stage-1.jpg",
    alt: "A sister sharing her testimony on stage",
    position: "object-[12%_top]",
  },
  {
    src: siteImageUrls["/images/testimony-stage-2.jpg"],
    alt: "Celebrating together after a testimony is shared on stage",
    position: "object-[86%_top]",
  },
];

const APP_STILL_FALLBACKS = [
  {
    label: "Home",
    screenBackground: "#171718",
    src: siteImageUrls["/images/app-steps/kharis-app-current-home.png"],
    alt: "Kharis Church app home screen with branch updates, the daily Bible reading and Moments",
  },
  {
    label: "Media Player",
    screenBackground: "#f5f5f3",
    src: siteImageUrls["/images/app-steps/kharis-app-current-player.png"],
    alt: "Kharis Church app Media Player with audio and video tabs and playback controls",
  },
  {
    label: "Bible",
    screenBackground: "#f5f5f3",
    src: siteImageUrls["/images/app-steps/kharis-app-current-chapter.png"],
    alt: "John 3 open in the Kharis Church app Bible reader",
  },
] as const;

async function HomeMessages() {
  const messages = await fetchLatestMessages(5).catch(() => []);
  const featured = messages[0];
  return featured ? <LatestMessages featured={featured} others={messages.slice(1, 5)} /> : null;
}

async function HomeTestimonies({
  photos,
}: {
  photos: Array<{ src: string; alt: string; position?: string }>;
}) {
  const testimonies = await getTestimonies("kharis", "featured");
  return <TestimoniesSection testimonies={testimonies} photos={photos} />;
}

export default async function Home() {
  const contents = await fetchSiteContents("kharis");
  const heroSlides = heroSlidesOrFallback(listSlot(contents, "home", "hero"), HERO_SLIDES);
  const knowUsImages = listOrFallback(listSlot(contents, "home", "knowUs"), KNOW_US_FALLBACKS);
  const buildHouseImage = mediaOrFallback(
    singleSlot(contents, "home", "buildHouse"),
    BUILD_HOUSE_FALLBACK,
  );
  const testimonyItems = listSlot(contents, "home", "testimonyPhotos");
  const testimonyPhotos = TESTIMONY_PHOTO_FALLBACKS.map((photo, index) => ({
    ...photo,
    src: listOrFallback(
      testimonyItems,
      TESTIMONY_PHOTO_FALLBACKS.map((item) => item.src),
    )[index]!,
    alt: testimonyItems[index]?.alt || photo.alt,
  }));
  const appItems = listSlot(contents, "home", "appScreens");
  const appStills = APP_STILL_FALLBACKS.map((still, index) => ({
    ...still,
    src: listOrFallback(
      appItems,
      APP_STILL_FALLBACKS.map((item) => item.src),
    )[index]!,
    alt: appItems[index]?.alt || still.alt,
  }));

  return (
    <main className="home-page bg-bg text-fg">
      <div className="home-page-shell">
        {/* The hero is inset below the header now, so the header sits on the
            page surface rather than on photographs. In light mode that means
            dark nav on white; `tone="light"` only applies when the site theme
            is light, so dark mode still gets the white treatment. */}
        <SiteHeader tone="light" />
        <BandHero slides={heroSlides} />
        <div className="home-below-hero">
          <MissionSection />
          <KnowUsStack images={knowUsImages} />
          <Suspense
            fallback={
              <section
                className="section band band--0"
                aria-busy="true"
                aria-label="Loading latest messages"
              >
                <div className="section__inner text-center">
                  <h2 className="section-title">Latest Messages</h2>
                </div>
              </section>
            }
          >
            <HomeMessages />
          </Suspense>
          <BuildHouseSection imageUrl={buildHouseImage} />
          <Suspense
            fallback={
              <section
                id="testimonies"
                className="testimony-band section band band--0"
                aria-busy="true"
                aria-label="Loading testimonies"
              >
                <div className="section__inner text-center">
                  <h2 className="section-title">Testimonies</h2>
                </div>
              </section>
            }
          >
            <HomeTestimonies photos={testimonyPhotos} />
          </Suspense>
          <VisionSection stills={appStills} />
          <SiteFooter />
        </div>
      </div>
    </main>
  );
}
