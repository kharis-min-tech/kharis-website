import Page, { type HomeMedia } from "@/components/pages/home";
import { listBranches } from "@/lib/branches";
import { KP2_PHOTOS } from "@/lib/photography";
import {
  fetchSiteContents,
  listOrFallback,
  listSlot,
  mediaOrFallback,
  mosaicOrFallback,
  singleSlot,
} from "@/lib/site-contents";
import { getHomeTestimonials } from "@/lib/testimonies";
import { pageMeta, SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Home",
  description: SITE_DESCRIPTION,
  path: "/",
});

const MOSAIC_FALLBACK = [
  {
    kind: "video" as const,
    src: "https://images.kharis.org/site-images/kp2/d7e2929cd285968f/Choir-video.mp4",
    poster: "https://images.kharis.org/site-images/kp2/88a52cf2f36e4dba/choir-video-poster.jpg",
  },
  {
    kind: "video" as const,
    src: "https://images.kharis.org/site-images/kp2/06c4e252e26bc25f/crowd.mp4",
    poster: "https://images.kharis.org/site-images/kp2/6a42a25165e3e08a/crowd-poster.jpg",
  },
  {
    kind: "video" as const,
    src: "https://images.kharis.org/site-images/kp2/ba4f09f054519d29/choir2.mp4",
    poster: "https://images.kharis.org/site-images/kp2/a20adefe3b0f9d7a/choir2-poster.jpg",
  },
  {
    kind: "video" as const,
    src: "https://images.kharis.org/site-images/kp2/785c2b4d533ea835/dancing.mp4",
    poster: "https://images.kharis.org/site-images/kp2/2777b7351167f611/dancing-poster.jpg",
  },
];

const TESTIMONY_FALLBACKS = [
  {
    src: "https://images.kharis.org/site-images/kp2/fb9675c9cc674137/testimony-1.jpg",
    alt: "Sharing a testimony at Kharis Phase 2",
    position: "center top",
  },
  {
    src: "https://images.kharis.org/site-images/kp2/2c9fe8d53a5b1d11/testimony-3.jpg",
    alt: "Giving glory to God in testimony at Kharis Phase 2",
    position: "center 20%",
  },
  {
    src: "https://images.kharis.org/site-images/kp2/f1508812f09a9ccd/testimony-2.jpg",
    alt: "Praising God and giving thanks at Kharis Phase 2",
    position: "center 25%",
  },
];

const APP_SCREEN_FALLBACKS = [
  "https://images.kharis.org/site-images/main/4275eecdf5e5a12c/app-steps/kharis-app-current-home.png",
  "https://images.kharis.org/site-images/main/f7dfca4f99bbe8a3/app-steps/kharis-app-current-player.png",
  "https://images.kharis.org/site-images/main/0706ed3bc435673c/app-steps/kharis-app-current-chapter.png",
];

export default async function Home() {
  const [testimonials, branches, contents] = await Promise.all([
    getHomeTestimonials(),
    listBranches(),
    fetchSiteContents("kp2"),
  ]);
  const branchPins = branches.map(({ slug, name, lat, lng }) => ({ slug, name, lat, lng }));

  const mosaic = mosaicOrFallback(listSlot(contents, "home", "heroMosaic"), MOSAIC_FALLBACK);
  const introSlot = singleSlot(contents, "home", "introPhoto");
  const pastorSlot = singleSlot(contents, "home", "pastorPhoto");
  const testimonyItems = listSlot(contents, "home", "testimonyPhotos");
  const testimonyPhotos = TESTIMONY_FALLBACKS.map((photo, index) => ({
    ...photo,
    src: listOrFallback(
      testimonyItems,
      TESTIMONY_FALLBACKS.map((item) => item.src),
    )[index]!,
    alt: testimonyItems[index]?.alt || photo.alt,
  }));
  const appScreens = listOrFallback(listSlot(contents, "home", "appScreens"), APP_SCREEN_FALLBACKS);

  const media: HomeMedia = {
    mosaic,
    stillPoster: mosaic[1]?.poster ?? MOSAIC_FALLBACK[1]!.poster,
    introPhoto: mediaOrFallback(introSlot, KP2_PHOTOS.midweekJoy.src),
    introAlt: introSlot?.alt || KP2_PHOTOS.midweekJoy.alt,
    pastorPhoto: mediaOrFallback(
      pastorSlot,
      "https://images.kharis.org/site-images/kp2/51390c9807aba7b8/pastor-david-smiling.jpg",
    ),
    testimonyPhotos,
    appScreens,
  };

  return <Page testimonials={testimonials} branchPins={branchPins} media={media} />;
}
