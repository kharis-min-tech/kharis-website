import Page from "@/components/pages/giving";
import { pageMeta } from "@/lib/seo";
import { listBranches } from "@/lib/branches";
import { KP2_PHOTOS } from "@/lib/photography";
import { fetchSiteContents, listOrFallback, listSlot } from "@/lib/site-contents";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Giving",
  description:
    "Give to Kharis Phase 2 online or by bank transfer. Your generosity powers worship, outreach, media and new branches.",
  path: "/giving",
});

export default async function Giving() {
  const [branches, contents] = await Promise.all([listBranches(), fetchSiteContents("kp2")]);
  const heroFallbacks = [
    KP2_PHOTOS.serviceWorship,
    KP2_PHOTOS.servicePrayer,
    KP2_PHOTOS.midweekWorship,
  ];
  const heroItems = listSlot(contents, "giving", "heroStack");
  const heroSrcs = listOrFallback(
    heroItems,
    heroFallbacks.map((photo) => photo.src),
  );
  const heroStack = heroFallbacks.map((photo, index) => ({
    ...photo,
    src: heroSrcs[index]!,
    alt: heroItems[index]?.alt || photo.alt,
  }));
  return (
    <Page
      branches={branches.map(({ slug, name, givingLink }) => ({ slug, name, givingLink }))}
      heroStack={heroStack}
    />
  );
}
