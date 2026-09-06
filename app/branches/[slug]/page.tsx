import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BranchPage from "@/components/pages/branch";
import { JsonLd } from "@/components/JsonLd";
import { getBranch, listBranchSlugs, listBranches } from "@/lib/branches";
import { branchJsonLd, pageMeta } from "@/lib/seo";

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
    return pageMeta({
      title: "Branch not found",
      description: "That Kharis Phase 2 campus could not be found.",
      path: `/branches/${slug}`,
      noIndex: true,
    });
  }
  return pageMeta({
    title: `${branch.city} Branch`,
    description: `${branch.blurb} Service times, location and how to visit the Kharis Phase 2 ${branch.city} campus.`,
    path: `/branches/${branch.slug}`,
    image: branch.image,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [branch, all] = await Promise.all([getBranch(slug), listBranches()]);
  if (!branch) notFound();
  const others = all.filter((b) => b.slug !== branch.slug).slice(0, 3);
  return (
    <>
      <JsonLd data={branchJsonLd(branch)} />
      <BranchPage branch={branch} others={others} />
    </>
  );
}
