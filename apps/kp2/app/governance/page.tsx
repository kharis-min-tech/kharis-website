import Page, { type GovernancePolicy } from "@/components/pages/governance";
import { pageMeta } from "@/lib/seo";
import { fetchSiteDocuments } from "@/lib/site-documents";
import privacy from "@/data/policy-documents/privacy.json";
import safeguarding from "@/data/policy-documents/safeguarding.json";
import disclaimer from "@/data/policy-documents/disclaimer.json";
import "./policy-document-reader.css";
import type { PolicyDocumentReaderProps } from "../../../../shared/PolicyDocumentReader";

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

const DOCUMENTS: Record<
  "safeguarding" | "privacy" | "disclaimer",
  Omit<PolicyDocumentReaderProps, "theme">
> = {
  safeguarding: {
    title: "Safeguarding Policy",
    description: "The complete safeguarding policy, organized by its original PDF pages.",
    updatedAt: "16 February 2019",
    pages: safeguarding.pages,
    pdfUrl: "/kp2/documents/safeguarding-policy.pdf",
    quickLinks: [
      { label: "Reporting concerns and urgent danger", page: 55 },
      { label: "Useful support contacts", page: 61 },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "The complete text of the privacy policy supplied by Kharis Ministries.",
    updatedAt: "September 2022",
    pages: privacy.pages,
    pdfUrl: "/kp2/documents/privacy-policy.pdf",
    quickLinks: [{ label: "Data protection contact", page: 5 }],
  },
  disclaimer: {
    title: "Website Disclaimer",
    description: "The complete website disclaimer supplied by Kharis Ministries.",
    pages: disclaimer.pages,
    pdfUrl: "/kp2/documents/website-disclaimer.pdf",
    quickLinks: [
      { label: "Limitations and exceptions", page: 1 },
      { label: "Other parties and unenforceable provisions", page: 2 },
    ],
  },
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
      href: id === "cookies" ? pdfUrl || "/cookies" : undefined,
      document: id in DOCUMENTS ? DOCUMENTS[id as keyof typeof DOCUMENTS] : undefined,
    };
  });

  return <Page policies={policies} />;
}
