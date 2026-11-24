import type { Metadata } from "next";
import { GiveExperience } from "@/components/GiveExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getGivingBranches } from "@/lib/giving-links";
import {
  fetchSiteContents,
  listOrFallback,
  listSlot,
  mediaOrFallback,
  singleSlot,
} from "@/lib/site-contents";

export const metadata: Metadata = {
  title: "Give | Kharis Church",
  description:
    "Give your tithes and offerings to Kharis Church online through your branch, by bank transfer, by text in the UK, or from Ghana by CalBank and Mobile Money.",
};

const HERO_STACK_FALLBACK = [
  "https://images.kharis.org/site-images/main/8527db06a4968c60/give/thanksgiving-hands-raised.jpg",
  "https://images.kharis.org/site-images/main/e686a4818115ee4e/give/thanksgiving-hall.jpg",
  "https://images.kharis.org/site-images/main/72e8b112e585bed6/give/thanksgiving-heart-hands.jpg",
];

const BUILDING_FALLBACK =
  "https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg";

export default async function GivePage() {
  const [branches, contents] = await Promise.all([
    getGivingBranches(),
    fetchSiteContents("kharis"),
  ]);

  return (
    <main className="bg-bg text-fg">
      {/* Hero is a page surface now, so the header follows the theme. */}
      <SiteHeader tone="light" />
      <GiveExperience
        branches={branches}
        heroStack={listOrFallback(listSlot(contents, "give", "heroStack"), HERO_STACK_FALLBACK)}
        buildingPhoto={mediaOrFallback(
          singleSlot(contents, "give", "buildingPhoto"),
          BUILDING_FALLBACK,
        )}
      />
      <SiteFooter />
    </main>
  );
}
