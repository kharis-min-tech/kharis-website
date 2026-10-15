/**
 * Events on /events. Each event is ONE picture (or video) with its words and an
 * "Explore" button that opens `gallery`. They appear in this order, laid out by `layout`:
 *
 *  full   Edge-to-edge banner (Sunday Service, Let the Bible Speak).
 *  half   Square tile; two halves in a row sit side by side (Midweek | Family Fun Day,
 *         Praise Night | Jesus Campaign). Keep halves in pairs.
 *  split  Two photos joined edge to edge to look like one wide image (Singles Ball,
 *         always last). Uses `split` instead of `media`.
 *
 * Photos live in /public/images, videos in /public/videos. `media.video` is optional;
 * `media.poster` is the photo (and the still shown while a video loads).
 * `gallery` takes any number of photos (6–12 works well).
 *
 * Keep every `alt` describing what is actually in the photo. Upcoming events take their
 * day, time and venue from the branch data, so never put those here, and never invent
 * dates for past events.
 */

export type EventCategoryStatus = "upcoming" | "past";

export type EventPhoto = {
  src: string;
  alt: string;
  /** CSS object-position, for photos whose subject is off-centre. */
  position?: string;
  /** Optional object-position for phones, where split halves are tall and narrow. */
  mobilePosition?: string;
};

export type EventMedia = {
  video?: string;
  poster: string;
  alt: string;
  position?: string;
};

export type EventSplit = {
  left: EventPhoto;
  right: EventPhoto;
  /** Replaces the usual "Past event" line above the headline. */
  eyebrow: string;
};

type EventBase = {
  id: string;
  label: string;
  status: EventCategoryStatus;
  /** Which branch service an upcoming event maps to. */
  service?: "sunday" | "midweek";
  headline: string;
  subtext: string;
  gallery: EventPhoto[];
};

export type EventCategory = EventBase &
  (
    | { layout: "full" | "half"; media: EventMedia; split?: never }
    | { layout: "split"; split: EventSplit; media?: never }
  );

export type EventFilter = "all" | "sunday" | "midweek" | "events";

export const EVENT_FILTERS: { id: EventFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sunday", label: "Sunday Service" },
  { id: "midweek", label: "Midweek" },
  { id: "events", label: "Events" },
];

export function matchesEvent(category: EventCategory, filter: EventFilter, query: string) {
  const inFilter =
    filter === "all" ||
    (filter === "events" ? category.status === "past" : category.service === filter);
  const q = query.trim().toLowerCase();
  if (!inFilter || !q) return inFilter;
  return [category.label, category.headline, category.subtext].some((text) =>
    text.toLowerCase().includes(q),
  );
}

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: "sunday-service",
    label: "Sunday Service",
    status: "upcoming",
    service: "sunday",
    layout: "full",
    media: {
      video: "/videos/hero-a.mp4?v=2",
      poster: "/videos/hero-a-poster.jpg",
      alt: "Congregation in worship during a Sunday service",
    },
    headline: "Sunday Service",
    subtext: "Worship, the Word and a church family to belong to. Everyone is welcome.",
    gallery: [
      {
        src: "/images/events/sunday-worship-hands.jpg",
        alt: "Woman worshipping with both hands raised during a Sunday service",
        position: "82% center",
      },
      {
        src: "/images/hero/sunday-bible-raised.jpg",
        alt: "Church member smiling and holding up her Bible during the service",
      },
      { src: "/images/events/sunday-pastor-open-bible.jpg", alt: "Pastor David holding up an open Bible on stage" },
      {
        src: "/images/events/sunday-pastor-bible-raised.jpg",
        alt: "Pastor David lifting a red Bible during the service",
      },
      { src: "/images/branch-slide-1.jpg", alt: "Congregation standing in worship" },
      { src: "/images/branch-slide-4.jpg", alt: "Wide view of the congregation in the main hall" },
      { src: "/images/hero/sunday-service-stage.jpg", alt: "Hands raised under blue stage lights" },
      { src: "/images/hero/easter-bibles-raised.jpg", alt: "Congregation holding their Bibles up" },
      { src: "/images/joyful-worship.jpg", alt: "Congregation worshipping with joy" },
      { src: "/images/branch-slide-2.jpg", alt: "Pastor celebrating on stage with the congregation" },
      { src: "/images/branch-slide-5.jpg", alt: "Sunday service in the main hall" },
      { src: "/images/hero/worship-altar.jpg", alt: "Congregation gathered at the front in worship" },
    ],
  },
  {
    id: "midweek-service",
    label: "Midweek Service",
    status: "upcoming",
    service: "midweek",
    layout: "half",
    media: {
      poster: "/images/hero/preaching-open-bible.jpg",
      alt: "Pastor preaching from an open Bible with scripture on the screen behind him",
    },
    headline: "Midweek Service",
    subtext: "The Word and prayer, right in the middle of your week.",
    gallery: [
      { src: "/videos/hero-b-poster.jpg", alt: "Pastor preaching on stage in front of a blue screen" },
      { src: "/images/grace-filled-prayer.jpg", alt: "Church members praying together" },
      { src: "/images/testimony-stage-1.jpg", alt: "Members sharing on stage" },
      { src: "/images/testimony-stage-2.jpg", alt: "Pastor praying with members on stage" },
      { src: "/images/testimony-sharing.jpg", alt: "Member sharing a testimony" },
      { src: "/images/love-greeting.jpg", alt: "Two members greeting each other warmly" },
      { src: "/images/hero/impartation-celebration.jpg", alt: "Pastor celebrating with the congregation" },
      { src: "/images/hero/easter-pastor-david.jpg", alt: "Pastor teaching from the stage" },
      { src: "/images/branch-slide-3.jpg", alt: "Members taking notes during teaching" },
      { src: "/images/young-adults.jpg", alt: "Young adults seated together in a session" },
    ],
  },
  {
    id: "family-fun-day",
    label: "Family Fun Day",
    status: "past",
    layout: "half",
    media: {
      poster: "/images/events/family-fun-day-race.jpg",
      alt: "Church members, some in black and gold 316 jerseys, racing across an outdoor court as families watch",
      position: "48% 50%",
    },
    headline: "Family Fun Day",
    subtext: "A day out for the whole church family, from the youngest to the oldest.",
    gallery: [
      {
        src: "/images/events/family-fun-day-race.jpg",
        alt: "Members in 316 jerseys racing across the court on Family Fun Day",
      },
      { src: "/images/hero/outreach-community.jpg", alt: "Church members gathered outdoors in a park" },
      { src: "/images/branch-slide-2.jpg", alt: "Pastor celebrating on stage with the congregation" },
      { src: "/images/about-hero-bench-3200.jpg", alt: "Members on a bench outdoors" },
      { src: "/images/hero/impartation-celebration.jpg", alt: "Pastor celebrating with members" },
      { src: "/images/love-greeting.jpg", alt: "Members greeting each other" },
      { src: "/images/young-adults.jpg", alt: "Young adults together" },
    ],
  },
  {
    id: "praise-night",
    label: "Praise Night",
    status: "past",
    layout: "half",
    media: {
      poster: "/images/events/praise-night-stage.jpg",
      alt: "Singers leading praise on stage beside a large screen, with a packed hall of worshippers in front of them",
      position: "30% 50%",
    },
    headline: "Praise Night",
    subtext: "A whole night set apart for praise and worship.",
    gallery: [
      {
        src: "/images/events/praise-night-stage.jpg",
        alt: "Singers on stage leading a packed hall in praise",
      },
      { src: "/images/locations-worship-team.jpg", alt: "Worship team singing on stage" },
      { src: "/images/get-involved-sax.jpg", alt: "Saxophonist playing during worship", position: "50% 30%" },
      { src: "/images/joyful-worship.jpg", alt: "Congregation worshipping with joy" },
      { src: "/images/hero/worship-altar.jpg", alt: "Worship at the front of the hall" },
      { src: "/images/hero/sunday-service-stage.jpg", alt: "Hands raised under stage lights" },
      { src: "/images/branch-slide-2.jpg", alt: "Celebration on stage" },
      { src: "/images/worship.jpg", alt: "Worshippers with hands raised" },
    ],
  },
  {
    id: "jesus-campaign",
    label: "Jesus Campaign",
    status: "past",
    layout: "half",
    media: {
      poster: "/images/about-mission-outreach-3200.jpg",
      alt: "Two members in yellow campaign T-shirts talking with a woman at Stratford station",
    },
    headline: "Jesus Campaign",
    subtext: "Taking the good news of Jesus to the streets of our cities.",
    gallery: [
      { src: "/images/hero/outreach-street.jpg", alt: "Outreach team in yellow shirts on a city street" },
      { src: "/images/about-vision-team-2048.jpg", alt: "Outreach team posing together in yellow shirts" },
      { src: "/images/about-mission-outreach-3200.jpg", alt: "Talking with people on the street" },
      { src: "/images/vision-campaign.jpg", alt: "Crowd in yellow campaign shirts" },
      { src: "/images/about-hero-bench-3200.jpg", alt: "Team members outdoors" },
      { src: "/images/hero/outreach-community.jpg", alt: "Team gathered in a park" },
    ],
  },
  {
    id: "let-the-bible-speak",
    label: "Let the Bible Speak Conference",
    status: "past",
    layout: "full",
    media: {
      poster: "/images/events/ltbs-team-caps.jpg",
      alt: "Three smiling team members in Let the Bible Speak caps and T-shirts, one wearing LTBS 2026 sunglasses",
      position: "50% 0%",
    },
    headline: "Let the Bible Speak",
    subtext: "A conference of teaching that roots us in Scripture.",
    gallery: [
      {
        src: "/images/events/ltbs-team-caps.jpg",
        alt: "Let the Bible Speak team in matching caps and T-shirts",
        position: "50% 25%",
      },
      { src: "/images/biblical-open-bible.jpg", alt: "Pastor holding an open Bible up high", position: "50% 30%" },
      { src: "/images/hero/easter-bibles-raised.jpg", alt: "Congregation holding their Bibles up high" },
      { src: "/images/hero/preaching-open-bible.jpg", alt: "Pastor preaching from an open Bible" },
      { src: "/images/hero/easter-pastor-david.jpg", alt: "Pastor teaching" },
      { src: "/images/hero/sunday-bible-raised.jpg", alt: "Member holding up her Bible" },
      { src: "/images/pastor-stage.jpg", alt: "Pastor on stage" },
    ],
  },
  {
    id: "singles-ball",
    label: "Singles Ball",
    status: "past",
    layout: "split",
    split: {
      left: {
        src: "/images/events/singles-ball/pastor-david.jpg",
        alt: "Pastor David Antwi in a black tuxedo in front of the KM Singles Ball backdrop",
        position: "50% 18%",
      },
      right: {
        src: "/images/events/singles-ball/pastor-awo.jpg",
        alt: "Pastor Awo Antwi in a teal and pink gown in front of the KM Singles Ball backdrop",
        position: "50% 18%",
      },
      eyebrow: "Hosted by Pastor David & Pastor Awo",
    },
    headline: "Kharis Singles Ball",
    subtext: "An evening of elegance, good food and great company.",
    gallery: [
      {
        src: "/images/events/singles-ball/ballroom-overview.jpg",
        alt: "Ballroom with crystal chandeliers, round dinner tables and a pink-lit stage",
      },
      {
        src: "/images/events/singles-ball/couples-dancing.jpg",
        alt: "Couples in formal wear dancing on the ballroom floor",
      },
      {
        src: "/images/events/singles-ball/stage-panel.jpg",
        alt: "Three hosts seated on stage with microphones in front of a pink backdrop",
      },
      {
        src: "/images/events/singles-ball/gentlemen-stairs.jpg",
        alt: "Gentlemen in black tuxedos and bow ties walking down a grand staircase",
      },
      {
        src: "/images/events/singles-ball/ladies-selfie.jpg",
        alt: "Ladies in evening gowns smiling and posing together for a selfie",
      },
      {
        src: "/images/events/singles-ball/pastor-david.jpg",
        alt: "Pastor David Antwi at the KM Singles Ball backdrop",
        position: "50% 20%",
      },
      {
        src: "/images/events/singles-ball/pastor-awo.jpg",
        alt: "Pastor Awo Antwi at the KM Singles Ball backdrop",
        position: "50% 20%",
      },
      { src: "/images/events-hero-banquet.jpg", alt: "Banquet tables set with red roses and candles" },
    ],
  },
];
