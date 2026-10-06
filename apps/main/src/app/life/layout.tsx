import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LifeShell } from "@/components/LifeShell";

export const metadata: Metadata = {
  title: "Kharis Life | Kharis Church",
  description:
    "The Christian life is a one-another life. Baptism, fasting, children’s ministry, and serving in departments at Kharis.",
};

export default function LifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-bg text-fg">
      <SiteHeader />
      <LifeShell>{children}</LifeShell>
      <SiteFooter />
    </main>
  );
}
