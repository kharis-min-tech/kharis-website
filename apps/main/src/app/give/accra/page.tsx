import type { Metadata } from "next";
import { GiveAccra } from "@/components/GiveAccra";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Giving from Ghana | Kharis Church Accra",
  description:
    "Give your tithes and offerings to Kharis Church Accra by CalBank transfer or Mobile Money.",
};

export default function GiveAccraPage() {
  return (
    <main className="bg-bg text-fg">
      {/* A page surface rather than a photograph, so the header follows the theme. */}
      <SiteHeader tone="light" />
      <GiveAccra />
      <SiteFooter />
    </main>
  );
}
