import Page from "@/components/pages/branches";
import { listBranches } from "@/lib/branches";
import { pageMeta } from "@/lib/seo";

export const revalidate = 0;

export const metadata = pageMeta({
  title: "Find a Branch",
  description:
    "Find a Kharis Phase 2 branch near you. Service times, locations and how to plan your first visit.",
  path: "/branches",
});

export default async function Branches() {
  const branches = await listBranches();
  return <Page branches={branches} />;
}
