import type { Metadata } from "next";
import { listBranches, listBranchData } from "@/lib/branches";
import { LocationsClient } from "./LocationsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kharis Church Locations | Find a Branch Near You",
  description:
    "Every Kharis Church location with service times, addresses and contact details. Search by city or postcode and plan your visit this Sunday.",
  openGraph: {
    title: "Kharis Church Locations | Find a Branch Near You",
    description:
      "Every Kharis Church location with service times, addresses and contact details. Plan your visit this Sunday.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function LocationsPage() {
  const [items, full] = await Promise.all([listBranches(), listBranchData()]);
  return <LocationsClient items={items} full={full} />;
}
