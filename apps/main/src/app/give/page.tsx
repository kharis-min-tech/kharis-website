import type { Metadata } from "next";
import { GiveExperience } from "@/components/GiveExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getGivingBranches } from "@/lib/giving-links";

export const metadata: Metadata = {
  title: "Give | Kharis Church",
  description:
    "Give your tithes and offerings to Kharis Church online through your branch, by bank transfer, by text in the UK, or from Ghana by CalBank and Mobile Money.",
};

export default async function GivePage() {
  const branches = await getGivingBranches();

  return (
    <main className="bg-bg text-fg">
      <SiteHeader />
      <GiveExperience branches={branches} />
      <SiteFooter />
    </main>
  );
}
