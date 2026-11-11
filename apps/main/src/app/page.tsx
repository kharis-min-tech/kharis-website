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
        {/* The hero is inset below the header now, so the header sits on the
            page surface rather than on photographs. In light mode that means
            dark nav on white; `tone="light"` only applies when the site theme
            is light, so dark mode still gets the white treatment. */}
        <SiteHeader tone="light" />
        <BandHero />
        <div className="home-below-hero">
          <MissionSection />
          <KnowUsStack />
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
          <VisitSection slides={CHARACTER_SLIDES} />
          <BuildHouseSection />
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
            <HomeTestimonies />
          </Suspense>
          <VisionSection />
          <SiteFooter />
        </div>
      </div>
    </main>
  );
}
