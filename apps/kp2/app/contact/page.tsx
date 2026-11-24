import Page from "@/components/pages/contact";
import { listBranches } from "@/lib/branches";
import { KP2_PHOTOS } from "@/lib/photography";
import { fetchSiteContents, mediaOrFallback, singleSlot } from "@/lib/site-contents";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Get in touch with Kharis Phase 2. Send a message, find a branch, or connect with the team.",
  path: "/contact",
});

export default async function Contact() {
  const [branches, contents] = await Promise.all([listBranches(), fetchSiteContents("kp2")]);
  const letterSlot = singleSlot(contents, "contact", "letterPhoto");
  const letterPhoto = {
    src: mediaOrFallback(letterSlot, KP2_PHOTOS.serviceTogether.src),
    alt: letterSlot?.alt || KP2_PHOTOS.serviceTogether.alt,
  };
  return <Page mainCampus={branches[0] ?? null} branches={branches} letterPhoto={letterPhoto} />;
}
