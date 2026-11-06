import type { Metadata } from "next";
import { ChildrenPage } from "@/components/children/ChildrenPage";
import { lifeBySlug } from "@/lib/life-content";

const page = lifeBySlug("children");

export const metadata: Metadata = {
  title: `${page?.title ?? "Children’s department"} | Kharis Life`,
  description: page?.card,
};

export default function ChildrenRoute() {
  return <ChildrenPage />;
}
