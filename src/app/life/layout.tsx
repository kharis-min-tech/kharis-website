import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LifeShell } from "@/components/LifeShell";

export const metadata: Metadata = {
  title: "Kharis Life | Kharis Church",
  description:
    "The Christian life is a one-another life. Find K-Groups, baptism, fasting, marriage, children’s ministry, and departments at Kharis.",
};

export default function LifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />
      <LifeShell>{children}</LifeShell>
      <SiteFooter />
    </main>
  );
}
