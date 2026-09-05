import type { Metadata } from "next";
import Page from "@/components/pages/giving";
import { getGivingTestimonials } from "@/lib/testimonies";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Giving | Kharis Phase 2",
  description: "Your generosity powers the mission. Give online, set up a transfer, and track the Phase 2 building milestone.",
  openGraph: {
    title: "Giving | Kharis Phase 2",
    description: "Your generosity powers the mission. Give online, set up a transfer, and track the Phase 2 building milestone.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Giving() {
  const testimonies = await getGivingTestimonials();
  return <Page testimonies={testimonies} />;
}
