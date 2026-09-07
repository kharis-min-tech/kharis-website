import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LifeDetail } from "@/components/LifeDetail";
import {
  LIFE_DEPARTMENTS_URL,
  LIFE_SLUGS,
  lifeBySlug,
  type LifeSlug,
} from "@/lib/life-content";

const MODAL_SLUGS = new Set<LifeSlug>([
  "k-group",
  "baptism",
  "fasting",
  "marriage",
]);

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LIFE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

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

  if (page.slug === "departments") {
    redirect(LIFE_DEPARTMENTS_URL);
  }

  if (MODAL_SLUGS.has(page.slug as LifeSlug)) {
    redirect(`/life?open=${page.slug}`);
  }

  return <LifeDetail slug={page.slug as LifeSlug} />;
}
