import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BranchPage from "@/components/pages/branch";
import { getBranch, listBranchSlugs, listBranches } from "@/lib/branches";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await listBranchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranch(slug);
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
  const [branch, all] = await Promise.all([getBranch(slug), listBranches()]);
  if (!branch) notFound();
  const others = all.filter((b) => b.slug !== branch.slug).slice(0, 3);
  return <BranchPage branch={branch} others={others} />;
}
