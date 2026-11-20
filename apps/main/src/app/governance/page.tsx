import type { Metadata } from "next";
import { GovernanceExperience, type GovernancePolicyCard } from "@/components/GovernanceExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { GOVERNANCE } from "@/lib/about-content";
import { fetchSiteDocuments } from "@/lib/site-documents";
import privacy from "@/data/policy-documents/privacy.json";
import safeguarding from "@/data/policy-documents/safeguarding.json";
import disclaimer from "@/data/policy-documents/disclaimer.json";
import "./policy-document-reader.css";
import type { PolicyDocumentReaderProps } from "../../../../../shared/PolicyDocumentReader";

export const metadata: Metadata = {
  title: "Governance | Kharis Church",
  description:
    "Safeguarding, privacy and website policies for Kharis Ministries. Report an incident securely.",
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
    pdfUrl: "/documents/safeguarding-policy.pdf",
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
    pdfUrl: "/documents/privacy-policy.pdf",
    quickLinks: [{ label: "Data protection contact", page: 5 }],
  },
  disclaimer: {
    title: "Website Disclaimer",
    description: "The complete website disclaimer supplied by Kharis Ministries.",
    pages: disclaimer.pages,
    pdfUrl: "/documents/website-disclaimer.pdf",
    quickLinks: [
      { label: "Limitations and exceptions", page: 1 },
      { label: "Other parties and unenforceable provisions", page: 2 },
    ],
  },
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
      document: policy.id in DOCUMENTS ? DOCUMENTS[policy.id as keyof typeof DOCUMENTS] : undefined,
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
