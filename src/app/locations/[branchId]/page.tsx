import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBranchDetail, listBranchIds } from "@/lib/branches";
import { LocationBranchView } from "./LocationBranchView";

interface PageProps {
  params: Promise<{ branchId: string }>;
}

export async function generateStaticParams() {
  const ids = await listBranchIds();
  return ids.map((branchId) => ({ branchId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branchId } = await params;
  const detail = await getBranchDetail(branchId);
  if (!detail) {
    return { title: "Branch unavailable | Kharis Church", robots: { index: false } };
  }
  const { branch } = detail;
  const title = `${branch.name} | Kharis Church ${branch.city}`;
  const description = branch.tagline || branch.description;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { branchId } = await params;
  const detail = await getBranchDetail(branchId);
  if (!detail) notFound();

  return <LocationBranchView detail={detail} />;
}
