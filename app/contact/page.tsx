import Page from "@/components/pages/contact";
import { listBranches } from "@/lib/branches";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Get in touch with Kharis Phase 2 — send a message, find a campus, or connect with the team.",
  path: "/contact",
});

export default async function Contact() {
  const branches = await listBranches();
  return <Page mainCampus={branches[0] ?? null} />;
}
