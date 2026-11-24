import Page, { type GovernancePolicy } from "@/components/pages/governance";
import { pageMeta } from "@/lib/seo";
import { fetchSiteDocuments } from "@/lib/site-documents";
import "./policy-pdf-dialog.css";

export const metadata = pageMeta({
  title: "Governance",
  description:
    "Safeguarding, privacy and governance policies for Kharis Ministries and Kharis Phase 2. Charity number 1139291.",
  path: "/governance",
});

const ICONS: Record<string, string> = {
  safeguarding: "shield_person",
  privacy: "lock",
  cookies: "cookie",
  disclaimer: "info",
};

/** Local PDFs only if Content Studio has not uploaded a live file yet. */
const FALLBACK_PDFS: Record<"safeguarding" | "privacy" | "disclaimer", string> = {
  safeguarding: "/kp2/documents/safeguarding-policy.pdf",
  privacy: "/kp2/documents/privacy-policy.pdf",
  disclaimer: "/kp2/documents/website-disclaimer.pdf",
};

export default async function GovernanceRoute() {
  const documents = await fetchSiteDocuments();
  const policies: GovernancePolicy[] = (
    ["safeguarding", "privacy", "cookies", "disclaimer"] as const
  ).map((id) => {
    const slot = documents.policies[id];
    const studioUrl = slot.url.trim();
    const fallbackPdf = id in FALLBACK_PDFS ? FALLBACK_PDFS[id as keyof typeof FALLBACK_PDFS] : "";
    const pdfUrl = studioUrl || fallbackPdf;
    return {
      id,
      icon: ICONS[id] ?? "info",
      title: slot.title,
      description: slot.blurb,
      href: id === "cookies" ? studioUrl || "/cookies" : undefined,
      document:
        id !== "cookies" && pdfUrl
          ? {
              title: slot.title,
              pdfUrl,
            }
          : undefined,
    };
  });

  return <Page policies={policies} />;
}
