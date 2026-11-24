import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LifeDetail } from "@/components/LifeDetail";
import { LIFE_CATEGORIES, LIFE_SLUGS, lifeBySlug, type LifeSlug } from "@/lib/life-content";
import { fetchSiteContents, listOrFallback, listSlot } from "@/lib/site-contents";

const MODAL_SLUGS = new Set<LifeSlug>(["k-group", "fasting"]);

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LIFE_SLUGS.map((slug) => ({ slug }));
}

// Not `dynamicParams = false`: without an incremental cache on Workers the prerendered pages aren't
// found, and false turned every /life/<slug> into a 404. Unknown slugs still 404 via notFound().

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = lifeBySlug(slug);
  if (!page) return { title: "Kharis Life | Kharis Church" };
  return {
    title: `${page.title} | Kharis Life`,
    description: page.intro,
  };
}

export default async function LifeCategoryPage({ params }: Props) {
  const { slug } = await params;
  const page = lifeBySlug(slug);
  if (!page) notFound();

  if (MODAL_SLUGS.has(page.slug as LifeSlug)) {
    redirect(`/life?open=${page.slug}`);
  }

  const contents = await fetchSiteContents("kharis");
  const categoryIndex = LIFE_CATEGORIES.findIndex((category) => category.slug === page.slug);
  const categoryImages = listOrFallback(
    listSlot(contents, "life", "categoryCards"),
    LIFE_CATEGORIES.map((category) => category.image),
  );
  const imageUrl = categoryIndex >= 0 ? categoryImages[categoryIndex] : undefined;

  if (page.slug === "departments") {
    return <LifeDetail slug="departments" imageUrl={imageUrl} />;
  }

  return <LifeDetail slug={page.slug as LifeSlug} imageUrl={imageUrl} />;
}
