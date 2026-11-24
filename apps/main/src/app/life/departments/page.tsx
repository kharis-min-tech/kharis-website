import type { Metadata } from "next";
import { LifeDepartmentsPage } from "@/components/LifeDepartmentsPage";
import { fetchSiteContents, mediaOrFallback, singleSlot } from "@/lib/site-contents";

export const metadata: Metadata = {
  title: "Departments | Kharis Life",
  description: "Explore ways to serve and find your place in the Kharis family.",
};

const DEPTS_BAND_FALLBACK =
  "https://images.kharis.org/site-images/main/c7e0b460a01f93eb/about-vision-team-2048.jpg";

export default async function DepartmentsPage() {
  const contents = await fetchSiteContents("kharis");
  return (
    <LifeDepartmentsPage
      departmentsBandUrl={mediaOrFallback(
        singleSlot(contents, "life", "departmentsBand"),
        DEPTS_BAND_FALLBACK,
      )}
    />
  );
}
