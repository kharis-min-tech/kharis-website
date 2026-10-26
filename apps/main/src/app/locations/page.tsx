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
  const cityPhotos: Record<string, string> = {
    accra:
      "https://images.kharis.org/site-images/main/0c0031656910b735/globe/accra-independence-arch.webp",
    freetown:
      "https://images.kharis.org/site-images/main/f7a0b56e18f54965/globe/freetown-harbour.webp",
  };
  // Send map coordinates and a photo, without duplicating full branch records.
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
        photo:
          items.find((item) => item.id === branch.slug)?.photo || cityPhotos[branch.slug] || "",
        city: venue.city,
      },
    ];
  });
  return <LocationsClient items={items} full={pins} />;
}
