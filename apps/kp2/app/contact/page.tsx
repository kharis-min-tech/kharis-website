import Page from "@/components/pages/contact";
import { listBranches } from "@/lib/branches";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Get in touch with Kharis Phase 2. Send a message, find a branch, or connect with the team.",
  path: "/contact",
});

export default async function Contact() {
  const branches = await listBranches();
  return <Page mainCampus={branches[0] ?? null} />;
}
