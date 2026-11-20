import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PolicyDocumentReader } from "../../../../../shared/PolicyDocumentReader";
import type { PolicyTextPage, PolicyQuickLink } from "../../../../../shared/PolicyDocumentReader";
import privacy from "@/data/policy-documents/privacy.json";
import safeguarding from "@/data/policy-documents/safeguarding.json";
import disclaimer from "@/data/policy-documents/disclaimer.json";
import "../policy-document-reader.css";

type PolicySlug = "privacy" | "safeguarding" | "disclaimer";
type PolicyEntry = {
  title: string;
  description: string;
  updatedAt?: string;
  pages: PolicyTextPage[];
  pdfUrl: string;
  quickLinks?: PolicyQuickLink[];
};

const POLICIES: Record<PolicySlug, PolicyEntry> = {
  privacy: {
    title: "Privacy Policy",
    description: "The complete text of the privacy policy supplied by Kharis Ministries.",
    updatedAt: "September 2022",
    pages: privacy.pages,
    pdfUrl: "/kp2/documents/privacy-policy.pdf",
    quickLinks: [{ label: "Data protection contact", page: 5 }],
  },
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

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug as PolicySlug];
  return policy
    ? { title: `${policy.title} | Kharis Phase 2`, description: policy.description }
    : { title: "Policy | Kharis Phase 2" };
}

export default async function GovernancePolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = POLICIES[slug as PolicySlug];
  if (!policy) notFound();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <SiteHeader />
      <main className="px-margin-mobile pb-20 pt-28 md:px-margin-desktop md:pt-32">
        <div className="mx-auto mb-5 w-full max-w-[68rem]">
          <Link
            className="font-label-md text-primary underline underline-offset-4"
            href="/governance"
          >
            ← Back to Governance
          </Link>
        </div>
        <PolicyDocumentReader {...policy} theme="kp2" />
      </main>
      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}
