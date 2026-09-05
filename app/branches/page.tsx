import type { Metadata } from "next";
import Page from "@/components/pages/branches";
import { listBranches } from "@/lib/branches";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Find a Branch | Kharis Phase 2",
  openGraph: {
    title: "Find a Branch | Kharis Phase 2",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Branches() {
  const branches = await listBranches();
  return <Page branches={branches} />;
}
