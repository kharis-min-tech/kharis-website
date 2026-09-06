import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationBranchView } from "./LocationBranchView";
import {
  listBranchData,
  getBranchBySlug,
} from "@/lib/branches";
import { withBranchImage } from "@/lib/branch-images";

interface PageProps {
  params: Promise<{
    branchId: string;
  }>;
}

// ======================================================
// GENERATE STATIC BRANCH ROUTES
// ======================================================

export async function generateStaticParams() {
  const branches = await listBranchData();

  return branches.map((branch) => ({
    branchId: branch.slug,
  }));
}

// ======================================================
// PAGE METADATA
// ======================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { branchId } = await params;

  const branch = await getBranchBySlug(branchId);

  if (!branch) {
    return {
      title: "Branch unavailable | Kharis Church",
      robots: {
        index: false,
      },
    };
  }

  const mainVenue = branch.venues?.[0];

  const branchLocation =
    mainVenue?.city ??
    branch.name.replace(/ Branch$/i, "");

  const title = `${branch.name} | Kharis Church ${branchLocation}`;

  const description =
    branch.short_description ??
    branch.description ??
    `Visit Kharis Church ${location}.`;

  const ogImage = withBranchImage(branch.hero_image_url, branch.slug);

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImage,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ======================================================
// BRANCH PAGE
// ======================================================

export default async function BranchPage({
  params,
}: PageProps) {
  const { branchId } = await params;

  const branch = await getBranchBySlug(branchId);

  if (!branch) {
    notFound();
  }

  return (
    <LocationBranchView
      branch={branch}
    />
  );
}