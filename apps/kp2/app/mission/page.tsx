import Page, { type MissionMedia } from "@/components/pages/mission";
import { KP2_PHOTOS } from "@/lib/photography";
import {
  fetchSiteContents,
  listOrFallback,
  listSlot,
  mediaOrFallback,
  singleSlot,
} from "@/lib/site-contents";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Mission",
  description:
    "The vision, mandate, core values and leadership of Kharis Phase 2. A generation encountering Jesus across the UK.",
  path: "/mission",
});

export default async function Mission() {
  const contents = await fetchSiteContents("kp2");
  const media: MissionMedia = {
    aboutHero: mediaOrFallback(
      singleSlot(contents, "mission", "aboutHero"),
      KP2_PHOTOS.serviceCongregation.src,
    ),
    visionHero: mediaOrFallback(
      singleSlot(contents, "mission", "visionHero"),
      KP2_PHOTOS.serviceHall.src,
    ),
    // One entry per pastor; an empty string keeps the built-in portrait.
    leadershipPortraits: listOrFallback(listSlot(contents, "mission", "leadershipPortraits"), [
      "",
      "",
    ]),
  };
  return <Page media={media} />;
}
