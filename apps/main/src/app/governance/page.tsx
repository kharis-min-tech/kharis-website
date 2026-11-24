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

/** Local PDFs only if Content Studio has not uploaded a live file yet. */
const FALLBACK_PDFS: Record<"safeguarding" | "privacy" | "disclaimer", string> = {
  safeguarding: "/documents/safeguarding-policy.pdf",
  privacy: "/documents/privacy-policy.pdf",
  disclaimer: "/documents/website-disclaimer.pdf",
};

export default async function GovernancePage() {
  const documents = await fetchSiteDocuments();
  const policies: GovernancePolicyCard[] = GOVERNANCE.policies.map((policy) => {
    const slot = documents.policies[policy.id as keyof typeof documents.policies];
    const studioUrl = slot?.url?.trim() || "";
    const fallbackHref = "href" in policy ? policy.href : undefined;
    const fallbackPdf =
      policy.id in FALLBACK_PDFS ? FALLBACK_PDFS[policy.id as keyof typeof FALLBACK_PDFS] : "";
    const pdfUrl = studioUrl || fallbackPdf;
    return {
      id: policy.id,
      title: slot?.title?.trim() || policy.title,
      blurb: slot?.blurb?.trim() || policy.blurb,
      icon: policy.icon,
      href: policy.id === "cookies" ? studioUrl || fallbackHref : undefined,
      document:
        policy.id !== "cookies" && pdfUrl
          ? {
              title: slot?.title?.trim() || policy.title,
              pdfUrl,
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
