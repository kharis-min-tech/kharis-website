import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MissingPage } from "../../../shared/MissingPage";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <MissingPage phaseTwo />
      </main>
      <SiteFooter />
      <ThemeToggle />
    </>
  );
}
