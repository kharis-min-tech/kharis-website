import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHES, getBranch } from "@/lib/branches";
import BranchPage from "@/components/pages/branch";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BRANCHES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) {
    return { title: "Branch not found | Kharis Phase 2", robots: { index: false } };
  }
  const title = `${branch.city} Branch | Kharis Phase 2`;
  const description = `${branch.blurb} Service times, location and contact details for the Kharis Phase 2 ${branch.city} branch.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const branch = getBranch(slug);
  if (!branch) notFound();
  return <BranchPage branch={branch} />;
}
