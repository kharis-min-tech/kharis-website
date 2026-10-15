import { Suspense } from "react";
import { BuildHouseSection } from "@/components/BuildHouseSection";
import { Hero } from "@/components/Hero";
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
import { fetchLatestMessages } from "@/lib/youtube";

async function HomeMessages() {
  const messages = await fetchLatestMessages(5).catch(() => []);
  const featured = messages[0];
  return featured ? <LatestMessages featured={featured} others={messages.slice(1, 5)} /> : null;
}

async function HomeTestimonies() {
  const testimonies = await getTestimonies("kharis", "featured");
  return <TestimoniesSection testimonies={testimonies} />;
}

export default function Home() {
  return (
    <main className="home-page bg-bg text-fg">
      <div className="home-page-shell">
        <SiteHeader />
        <Hero />
        <div className="home-below-hero">
          <MissionSection />
          <KnowUsStack />
          <Suspense
            fallback={
              <section
                className="px-5 py-8 md:px-8 md:py-10"
                aria-busy="true"
                aria-label="Loading latest messages"
              >
                <h2 className="section-title">Latest Messages</h2>
              </section>
            }
          >
            <HomeMessages />
          </Suspense>
          <VisitSection slides={CHARACTER_SLIDES} />
          <BuildHouseSection />
          <Suspense
            fallback={
              <section
                id="testimonies"
                className="testimony-band px-5 py-8 md:px-8 md:py-10"
                aria-busy="true"
                aria-label="Loading testimonies"
              >
                <h2 className="section-title">Testimonies</h2>
              </section>
            }
          >
            <HomeTestimonies />
          </Suspense>
          <VisionSection />
          <UnsureBranchCta />
          <SiteFooter />
        </div>
      </div>
    </main>
  );
}
