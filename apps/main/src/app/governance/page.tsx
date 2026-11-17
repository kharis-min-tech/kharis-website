import type { Metadata } from "next";
import { GovernanceExperience, type GovernancePolicyCard } from "@/components/GovernanceExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { GOVERNANCE } from "@/lib/about-content";
import { fetchSiteDocuments } from "@/lib/site-documents";

export const metadata: Metadata = {
  title: "Governance | Kharis Church",
  description:
    "Safeguarding, privacy and website policies for Kharis Ministries. Report an incident securely.",
};

export default async function GovernancePage() {
  const documents = await fetchSiteDocuments();
  const policies: GovernancePolicyCard[] = GOVERNANCE.policies.map((policy) => {
    const slot = documents.policies[policy.id as keyof typeof documents.policies];
    const pdfUrl = slot?.url?.trim() || "";
    const fallbackHref = "href" in policy ? policy.href : undefined;
    return {
      id: policy.id,
      title: slot?.title?.trim() || policy.title,
      blurb: slot?.blurb?.trim() || policy.blurb,
      icon: policy.icon,
      href: pdfUrl || fallbackHref,
    };
  });

  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />
      <GovernanceExperience policies={policies} />
      <SiteFooter />
    </main>
  );
}
