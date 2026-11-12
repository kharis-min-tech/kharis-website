/**
 * The homepage hero media.
 *
 * Add, remove or reorder hero media here. The hero deals from the list in
 * order onto its curved band.
 *
 * A video tile plays inline, muted and looping, and pauses once the hero has
 * scrolled out of view. A poster is still required on every video: it is what
 * shows until the first frame decodes.
 */

export type HeroSlide = {
  type: "video" | "image";
  src: string;
  /** Required for videos: the frame shown until the clip starts playing. */
  poster?: string;
  alt?: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    type: "video",
    src: "/videos/hero-a.mp4?v=2",
    poster: "https://images.kharis.org/site-images/main/59beb230d62d3613/hero-a-poster.jpg",
    alt: "The congregation gathered at a Kharis service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/e9df39abff1c7e6d/hero/sunday-service-stage.jpg",
    alt: "Pastor raising his Bible on stage at Kharis Sunday Service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
    alt: "The congregation worshipping at the altar during a Kharis service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg",
    alt: "The congregation raising their Bibles at the Easter service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/b8180db67daeb332/hero/preaching-open-bible.jpg",
    alt: "Preaching with arms outstretched and an open Bible in hand",
  },
  {
    type: "video",
    src: "/videos/hero-b.mp4?v=2",
    poster: "https://images.kharis.org/site-images/main/81043753566f149e/hero-b-poster.jpg",
    alt: "Worship at a Kharis gathering",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
    alt: "Pastor David celebrating with the congregation at the Impartation Service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/5bbfb2fff5c0fc8c/hero/outreach-street.jpg",
    alt: "Kharis outreach team sharing the gospel on the street",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/aee6ab0aae266c72/hero/easter-pastor-david.jpg",
    alt: "Pastor David preaching at the Easter Saturday service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/0698b74918b21fe0/hero/sunday-bible-raised.jpg",
    alt: "A worshipper raising her Bible at a Sunday service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/ca959585decb8ff4/hero/outreach-community.jpg",
    alt: "Kharis community outreach day in a local playground",
  },
];
