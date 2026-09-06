import Page from "@/components/pages/giving";
import { getGivingTestimonials } from "@/lib/testimonies";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Giving",
  description:
    "Give to Kharis Phase 2 online or by bank transfer. Your generosity powers worship, outreach, media and new campuses.",
  path: "/giving",
});

export default async function Giving() {
  const testimonies = await getGivingTestimonials();
  return <Page testimonies={testimonies} />;
}
