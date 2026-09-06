import type { Metadata } from "next";
import Page from "@/components/pages/home";
import { getHomeTestimonials } from "@/lib/testimonies";
import { fetchLatestMessages } from "@/lib/youtube";

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
  const [testimonials, messages] = await Promise.all([
    getHomeTestimonials(),
    fetchLatestMessages(5),
  ]);
  return <Page testimonials={testimonials} messages={messages} />;
}
