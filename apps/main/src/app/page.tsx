import { BuildHouseSection } from "@/components/BuildHouseSection";
import { Hero } from "@/components/Hero";
import { HomeSiteSkeleton } from "@/components/HomeSiteSkeleton";
import { KnowUsStack } from "@/components/KnowUsStack";
import { LatestMessages } from "@/components/LatestMessages";
import { MissionSection } from "@/components/MissionSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TestimoniesSection } from "@/components/TestimoniesSection";
import { getTestimonies } from "@/lib/testimonies";
import { UnsureBranchCta } from "@/components/UnsureBranchCta";
import { VisionSection } from "@/components/VisionSection";
import { VisitSection } from "@/components/VisitSection";
import { CHARACTER_SLIDES } from "@/lib/branch-slides";
import { fetchLatestMessages, type MessageVideo } from "@/lib/youtube";

export default async function Home() {
  let messages: MessageVideo[] = [];

  try {
    messages = (await fetchLatestMessages(5)) ?? [];
  } catch {
    messages = await fetchLatestMessages(5).catch(() => []);
  }

  const featured = messages[0];
  const others = messages.slice(1, 5);
  const testimonies = await getTestimonies("kharis", "featured");

  return (
    <main className="home-page bg-bg text-fg">
      <HomeSiteSkeleton />
      <div className="home-page-shell">
        <SiteHeader />
        <Hero />
        <div className="home-below-hero">
          <MissionSection />
          <KnowUsStack />
          {featured ? (
            <LatestMessages featured={featured} others={others} />
          ) : null}
          <VisitSection slides={CHARACTER_SLIDES} />
          <BuildHouseSection />
          <TestimoniesSection testimonies={testimonies} />
          <VisionSection />
          <UnsureBranchCta />
          <SiteFooter />
        </div>
      </div>
    </main>
  );
}
