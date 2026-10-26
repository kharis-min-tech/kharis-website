import Page from "@/components/pages/giving";
import { getGivingTestimonials } from "@/lib/testimonies";
import { pageMeta } from "@/lib/seo";
import { listBranches } from "@/lib/branches";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Giving",
  description:
    "Give to Kharis Phase 2 online or by bank transfer. Your generosity powers worship, outreach, media and new branches.",
  path: "/giving",
});

export default async function Giving() {
  const [testimonies, branches] = await Promise.all([getGivingTestimonials(), listBranches()]);
  return (
    <Page
      testimonies={testimonies}
      branches={branches.map(({ slug, name, givingLink }) => ({ slug, name, givingLink }))}
    />
  );
}
