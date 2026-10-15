import type { Metadata } from "next";
import { listBranches, listBranchData } from "@/lib/branches";
import { branchDisplayName, sundayVenue } from "@/lib/branch-display";
import { LocationsClient } from "./LocationsClient";

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
  // Send only map coordinates to the browser, not a second copy of every branch's
  // galleries, service records, descriptions and pastor biographies.
  const pins = full.flatMap((branch) => {
    const venue = sundayVenue(branch);
    if (venue?.latitude == null || venue.longitude == null) return [];
    return [
      {
        slug: branch.slug,
        name: branchDisplayName(branch.name),
        lat: venue.latitude,
        lng: venue.longitude,
        country: venue.country,
      },
    ];
  });
  return <LocationsClient items={items} full={pins} />;
}
