import type { Metadata } from "next";
import { Suspense } from "react";
import { QuizExperience } from "@/components/QuizExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Department Discovery Quiz | Kharis Church",
  description:
    "Discover where your gifting, passions, and talents best align across Kharis Church ministries and departments.",
};

export default function QuizPage() {
  return (
    <main className="quiz-page min-h-screen">
      <SiteHeader tone="light" />
      <Suspense fallback={null}>
        <QuizExperience />
      </Suspense>
      <SiteFooter />
    </main>
  );
}

