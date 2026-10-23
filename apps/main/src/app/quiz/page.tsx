import type { Metadata } from "next";
import { QuizExperience } from "@/components/QuizExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Department Discovery Quiz | Kharis Church",
  description:
    "Take the quiz and discover which ministry department fits your unique gifts, passions, and availability.",
};

export default function QuizPage() {
  return (
    <main className="site-page text-fg">
      <SiteHeader />
      <QuizExperience />
      <SiteFooter />
    </main>
  );
}
