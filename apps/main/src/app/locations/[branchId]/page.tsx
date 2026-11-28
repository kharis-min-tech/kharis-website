import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationBranchView } from "./LocationBranchView";
import { listBranchData, getBranchBySlug } from "@/lib/branches";
import { isKp2Branch } from "@/lib/contact-branches";

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

  /* KP2 congregations have their own site and are no longer listed in the
   * directory, so main must not build pages for them either - otherwise they
   * stay reachable by URL, and indexable, with nothing linking to them. */
  return branches
    .filter((branch) => !isKp2Branch(branch))
    .map((branch) => ({
      branchId: branch.slug,
    }));
}

// ======================================================
// PAGE METADATA
// ======================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branchId } = await params;

  const branch = await getBranchBySlug(branchId);

  /* Same test as the page itself, so a KP2 slug is never described as a real
   * branch in the head of a document that is about to 404. */
  if (!branch || isKp2Branch(branch)) {
    return {
      title: "Branch unavailable | Kharis Church",
      robots: {
        index: false,
      },
    };
  }

  const title = `${branch.name} | Kharis Church`;

  const description =
    branch.short_description ?? branch.description ?? `Visit Kharis Church ${branch.name}.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",

      ...(branch.hero_image_url
        ? {
            images: [
              {
                url: branch.hero_image_url,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,

      ...(branch.hero_image_url
        ? {
            images: [branch.hero_image_url],
          }
        : {}),
    },
  };
}

// ======================================================
// BRANCH PAGE
// ======================================================

export default async function BranchPage({ params }: PageProps) {
  const { branchId } = await params;

  const branch = await getBranchBySlug(branchId);

  /* Leaving it out of generateStaticParams is not enough on its own:
   * dynamicParams defaults to true, so an unlisted slug is still rendered on
   * demand. A KP2 branch has to 404 here to actually be gone from main. */
  if (!branch || isKp2Branch(branch)) {
    notFound();
  }

  return <LocationBranchView branch={branch} />;
}
