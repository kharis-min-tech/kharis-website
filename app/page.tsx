import type { Metadata } from "next";
import Page from "@/components/pages/home";
import { getHomeTestimonials } from "@/lib/testimonies";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kharis Phase 2 | Faith Looks Different Here",
  openGraph: {
    title: "Kharis Phase 2 | Faith Looks Different Here",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Home() {
  const testimonials = await getHomeTestimonials();
  return <Page testimonials={testimonials} />;
}
