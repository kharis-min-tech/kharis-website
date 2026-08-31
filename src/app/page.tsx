import { BuildHouseSection } from "@/components/BuildHouseSection";
import { Hero } from "@/components/Hero";
import { KnowUsStack } from "@/components/KnowUsStack";
import { LatestMessages } from "@/components/LatestMessages";
import { MissionSection } from "@/components/MissionSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TestimoniesSection } from "@/components/TestimoniesSection";
import { UnsureBranchCta } from "@/components/UnsureBranchCta";
import { VisionSection } from "@/components/VisionSection";
import { VisitSection } from "@/components/VisitSection";
import { fetchBranchSlides } from "@/lib/branch-slides";
import { fetchLatestMessages, type MessageVideo } from "@/lib/youtube";
import type { BranchSlide } from "@/lib/branch-slides";

export default async function Home() {
  let messages: MessageVideo[] = [];
  let branchSlides: BranchSlide[] = [];

  try {
    const result = await Promise.all([
      fetchLatestMessages(5),
      fetchBranchSlides(),
    ]);
    messages = result[0] ?? [];
    branchSlides = result[1] ?? [];
  } catch {
    messages = await fetchLatestMessages(5).catch(() => []);
    branchSlides = await fetchBranchSlides().catch(() => []);
  }

  const featured = messages[0];
  const others = messages.slice(1, 5);

  return (
    <main className="bg-bg text-fg">
      <SiteHeader />
      <Hero />
      <MissionSection />
      <KnowUsStack />
      {featured ? <LatestMessages featured={featured} others={others} /> : null}
      <VisitSection slides={branchSlides} />
      <BuildHouseSection />
      <TestimoniesSection />
      <VisionSection />
      <UnsureBranchCta />
      <SiteFooter />
    </main>
  );
}
