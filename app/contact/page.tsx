import type { Metadata } from "next";
import Page from "@/components/pages/contact";
import { listBranches } from "@/lib/branches";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact Us | Kharis Phase 2",
  description: "Get in touch with Kharis Phase 2 — send us a message, find our campus, or connect with the team.",
  openGraph: {
    title: "Contact Us | Kharis Phase 2",
    description: "Get in touch with Kharis Phase 2 — send us a message, find our campus, or connect with the team.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Contact() {
  const branches = await listBranches();
  return <Page mainCampus={branches[0] ?? null} />;
}
