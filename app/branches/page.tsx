import Page from "@/components/pages/branches";
import { listBranches } from "@/lib/branches";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Find a Branch",
  description:
    "Find a Kharis Phase 2 campus near you. Service times, locations and how to plan your first visit.",
  path: "/branches",
});

function parseOrigin(searchParams: { lat?: string; lng?: string }) {
  const lat = Number(searchParams.lat);
  const lng = Number(searchParams.lng);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return null;
  }
  return { lat, lng };
}

export default async function Branches({
  searchParams,
}: {
  searchParams: Promise<{ lat?: string; lng?: string }>;
}) {
  const origin = parseOrigin(await searchParams);
  const branches = await listBranches();
  return <Page branches={branches} origin={origin} />;
}
