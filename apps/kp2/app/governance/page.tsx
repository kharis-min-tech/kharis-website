import Page, { type GovernancePolicy } from "@/components/pages/governance";
import { pageMeta } from "@/lib/seo";
import { fetchSiteDocuments } from "@/lib/site-documents";

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

export default async function GovernanceRoute() {
  const documents = await fetchSiteDocuments();
  const policies: GovernancePolicy[] = (
    ["safeguarding", "privacy", "cookies", "disclaimer"] as const
  ).map((id) => {
    const slot = documents.policies[id];
    const pdfUrl = slot.url.trim();
    return {
      id,
      icon: ICONS[id] ?? "info",
      title: slot.title,
      description: slot.blurb,
      href: pdfUrl || (id === "cookies" ? "/cookies" : undefined),
    };
  });

  return <Page policies={policies} />;
}
