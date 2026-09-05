import type { Metadata } from "next";
import Page from "@/components/pages/life";
import { getUpcomingEvents } from "@/lib/events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kharis Life | Community & Lifestyle",
  description: "Kharis Life: small groups, New Breeds fellowships, testimonies and the everyday culture of our community.",
  openGraph: {
    title: "Kharis Life | Community & Lifestyle",
    description: "Kharis Life: small groups, New Breeds fellowships, testimonies and the everyday culture of our community.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Life() {
  const upcoming = (await getUpcomingEvents()).slice(0, 3);
  return <Page upcoming={upcoming} />;
}
