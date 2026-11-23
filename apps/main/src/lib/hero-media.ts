import siteImageUrls from "@/lib/site-image-urls.json";

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
    type: "image",
    src: siteImageUrls["/images/locations/london-sunday-smiles.jpg"],
    alt: "Members of Kharis London smiling during a service",
  },
  {
    type: "image",
    src: siteImageUrls["/images/events/sunday-pastor-open-bible.jpg"],
    alt: "Pastor David preaching with an open Bible at a Kharis service",
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
    type: "video",
    src: "https://images.kharis.org/site-images/main/bccc7c3a84bff0b1/Glory%20to%20the%20lamb%20-%20Trim-960w.mp4",
    poster: "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
    alt: "Worship to Glory to the Lamb at a Kharis service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/b8180db67daeb332/hero/preaching-open-bible.jpg",
    alt: "Preaching with arms outstretched and an open Bible in hand",
  },
  {
    type: "image",
    src: siteImageUrls["/images/contact/easter-welcome-wave.jpg"],
    alt: "People waving as they arrive for a Kharis Easter service",
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
    type: "video",
    src: "https://images.kharis.org/site-images/main/ca64a6f0dd627bfe/Glory%20to%20the%20lamb%20-%20Trim%202-960w.mp4",
    poster: "https://images.kharis.org/site-images/main/850b7f32a7f6712c/joyful-worship.jpg",
    alt: "Worship to Glory to the Lamb at a Kharis service",
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
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/850b7f32a7f6712c/joyful-worship.jpg",
    alt: "Joyful worship at a Kharis service",
  },
  /* The five photographs that used to carry the "This is Kharis" character
     section. That section has gone; the pictures were too good to lose, so
     they ride the hero band instead. */
  {
    type: "video",
    src: "https://images.kharis.org/site-images/main/909c123ea907fe99/Glory%20to%20the%20lamb%20-%20Trim%203-960w.mp4",
    poster:
      "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
    alt: "Worship to Glory to the Lamb at a Kharis service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/79f53822455f01b0/branch-slide-2.jpg",
    alt: "The congregation lifting Christ in worship",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/b65991e38ead9ab1/biblical-open-bible.jpg",
    alt: "An open Bible held during a Kharis service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/6cecd6b024bd301a/love-greeting.jpg",
    alt: "Members greeting one another at a Kharis gathering",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/16b531253b8a325e/grace-filled-prayer.jpg",
    alt: "Praying together at a Kharis service",
  },
];
