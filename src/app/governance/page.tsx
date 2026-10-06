import type { Metadata } from "next";
import { GovernanceExperience } from "@/components/GovernanceExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Governance | Kharis Church",
  description:
    "Safeguarding, privacy and website policies for Kharis Ministries. Report an incident securely.",
};

export default function GovernancePage() {
  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />
      <GovernanceExperience />
      <SiteFooter />
    </main>
  );
}
