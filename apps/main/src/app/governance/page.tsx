import type { Metadata } from "next";
import { GovernanceExperience, type GovernancePolicyCard } from "@/components/GovernanceExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { GOVERNANCE } from "@/lib/about-content";
import { fetchSiteDocuments } from "@/lib/site-documents";
import "./policy-pdf-dialog.css";

export const metadata: Metadata = {
  title: "Governance | Kharis Church",
  description:
    "Safeguarding, privacy and website policies for Kharis Ministries. Report an incident securely.",
};

const DOCUMENTS: Record<"safeguarding" | "privacy" | "disclaimer", string> = {
  safeguarding: "/documents/safeguarding-policy.pdf",
  privacy: "/documents/privacy-policy.pdf",
  disclaimer: "/documents/website-disclaimer.pdf",
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
      href: policy.id === "cookies" ? pdfUrl || fallbackHref : undefined,
      document:
        policy.id in DOCUMENTS
          ? {
              title: slot?.title?.trim() || policy.title,
              pdfUrl: DOCUMENTS[policy.id as keyof typeof DOCUMENTS],
            }
          : undefined,
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
