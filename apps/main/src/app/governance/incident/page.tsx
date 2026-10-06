import type { Metadata } from "next";
import { IncidentFormExperience } from "@/components/IncidentFormExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Report an Incident | Kharis Ministries",
  description:
    "Report a safeguarding or governance concern to Kharis Ministries securely.",
};

export default function IncidentPage() {
  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />
      <IncidentFormExperience />
      <SiteFooter />
    </main>
  );
}
