import type { Metadata } from "next";
import { LifeDepartmentsPage } from "@/components/LifeDepartmentsPage";

export const metadata: Metadata = {
  title: "Departments | Kharis Life",
  description: "Explore ways to serve and find your place in the Kharis family.",
};

export default function DepartmentsPage() {
  return <LifeDepartmentsPage />;
}
