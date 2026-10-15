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
      poster:
        "https://images.kharis.org/site-images/main/72df91d4341c5b55/events/sunday-pastor-open-bible.jpg",
      alt: "Pastor David holding an open Bible during a Sunday service",
      position: "50% 28%",
    },
    headline: "Sunday Service",
    subtext: "Worship, the Word and a church family to belong to. Everyone is welcome.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/fd4b6a19fbb8f4d3/events/sunday-worship-hands.jpg",
        alt: "Woman worshipping with both hands raised during a Sunday service",
        position: "82% center",
      },
      {
        src: "https://images.kharis.org/site-images/main/0698b74918b21fe0/hero/sunday-bible-raised.jpg",
        alt: "Church member smiling and holding up her Bible during the service",
      },
      {
        src: "https://images.kharis.org/site-images/main/72df91d4341c5b55/events/sunday-pastor-open-bible.jpg",
        alt: "Pastor David holding up an open Bible on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/ecbd1d3145041d85/events/sunday-pastor-bible-raised.jpg",
        alt: "Pastor David lifting a red Bible during the service",
      },
      {
        src: "https://images.kharis.org/site-images/main/571e499ea60fdffc/branch-slide-1.jpg",
        alt: "Congregation standing in worship",
      },
      {
        src: "https://images.kharis.org/site-images/main/074fce9dca42072a/branch-slide-4.jpg",
        alt: "Wide view of the congregation in the main hall",
      },
      {
        src: "https://images.kharis.org/site-images/main/e9df39abff1c7e6d/hero/sunday-service-stage.jpg",
        alt: "Hands raised under blue stage lights",
      },
      {
        src: "https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg",
        alt: "Congregation holding their Bibles up",
      },
      {
        src: "https://images.kharis.org/site-images/main/850b7f32a7f6712c/joyful-worship.jpg",
        alt: "Congregation worshipping with joy",
      },
      {
        src: "https://images.kharis.org/site-images/main/79f53822455f01b0/branch-slide-2.jpg",
        alt: "Pastor celebrating on stage with the congregation",
      },
      {
        src: "https://images.kharis.org/site-images/main/4cdb8d19355fced2/branch-slide-5.jpg",
        alt: "Sunday service in the main hall",
      },
      {
        src: "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
        alt: "Congregation gathered at the front in worship",
      },
    ],
  },
  {
    id: "midweek-service",
    label: "Midweek Service",
    status: "upcoming",
    service: "midweek",
    layout: "half",
    media: {
      poster:
        "https://images.kharis.org/site-images/main/b8180db67daeb332/hero/preaching-open-bible.jpg",
      alt: "Pastor preaching from an open Bible with scripture on the screen behind him",
    },
    headline: "Midweek Service",
    subtext: "The Word and prayer, right in the middle of your week.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/81043753566f149e/hero-b-poster.jpg",
        alt: "Pastor preaching on stage in front of a blue screen",
      },
      {
        src: "https://images.kharis.org/site-images/main/16b531253b8a325e/grace-filled-prayer.jpg",
        alt: "Church members praying together",
      },
      {
        src: "https://images.kharis.org/site-images/main/cc4f9c67e2c899e3/testimony-stage-1.jpg",
        alt: "Members sharing on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/bb1a12396469052d/testimony-stage-2.jpg",
        alt: "Pastor praying with members on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/79c0eac25d6bc370/testimony-sharing.jpg",
        alt: "Member sharing a testimony",
      },
      {
        src: "https://images.kharis.org/site-images/main/6cecd6b024bd301a/love-greeting.jpg",
        alt: "Two members greeting each other warmly",
      },
      {
        src: "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
        alt: "Pastor celebrating with the congregation",
      },
      {
        src: "https://images.kharis.org/site-images/main/aee6ab0aae266c72/hero/easter-pastor-david.jpg",
        alt: "Pastor teaching from the stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/3f1f49569aefd282/branch-slide-3.jpg",
        alt: "Members taking notes during teaching",
      },
      {
        src: "https://images.kharis.org/site-images/main/234c625e119f9e2a/young-adults.jpg",
        alt: "Young adults seated together in a session",
      },
    ],
  },
  {
    id: "family-fun-day",
    label: "Family Fun Day",
    status: "past",
    layout: "half",
    media: {
      poster:
        "https://images.kharis.org/site-images/main/3423ef762f6c2481/events/family-fun-day-race.jpg",
      alt: "Church members, some in black and gold 316 jerseys, racing across an outdoor court as families watch",
      position: "48% 50%",
    },
    headline: "Family Fun Day",
    subtext: "A day out for the whole church family, from the youngest to the oldest.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/3423ef762f6c2481/events/family-fun-day-race.jpg",
        alt: "Members in 316 jerseys racing across the court on Family Fun Day",
      },
      {
        src: "https://images.kharis.org/site-images/main/ca959585decb8ff4/hero/outreach-community.jpg",
        alt: "Church members gathered outdoors in a park",
      },
      {
        src: "https://images.kharis.org/site-images/main/79f53822455f01b0/branch-slide-2.jpg",
        alt: "Pastor celebrating on stage with the congregation",
      },
      {
        src: "https://images.kharis.org/site-images/main/b722ebe4e6374dcd/about-hero-bench-3200.jpg",
        alt: "Members on a bench outdoors",
      },
      {
        src: "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
        alt: "Pastor celebrating with members",
      },
      {
        src: "https://images.kharis.org/site-images/main/6cecd6b024bd301a/love-greeting.jpg",
        alt: "Members greeting each other",
      },
      {
        src: "https://images.kharis.org/site-images/main/234c625e119f9e2a/young-adults.jpg",
        alt: "Young adults together",
      },
    ],
  },
  {
    id: "praise-night",
    label: "Praise Night",
    status: "past",
    layout: "half",
    media: {
      poster:
        "https://images.kharis.org/site-images/main/c92b67201f985207/events/praise-night-stage.jpg",
      alt: "Singers leading praise on stage beside a large screen, with a packed hall of worshippers in front of them",
      position: "30% 50%",
    },
    headline: "Praise Night",
    subtext: "A whole night set apart for praise and worship.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/c92b67201f985207/events/praise-night-stage.jpg",
        alt: "Singers on stage leading a packed hall in praise",
      },
      {
        src: "https://images.kharis.org/site-images/main/2fd55a6761cfb656/locations-worship-team.jpg",
        alt: "Worship team singing on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/de005ef42ce5304e/get-involved-sax.jpg",
        alt: "Saxophonist playing during worship",
        position: "50% 30%",
      },
      {
        src: "https://images.kharis.org/site-images/main/850b7f32a7f6712c/joyful-worship.jpg",
        alt: "Congregation worshipping with joy",
      },
      {
        src: "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
        alt: "Worship at the front of the hall",
      },
      {
        src: "https://images.kharis.org/site-images/main/e9df39abff1c7e6d/hero/sunday-service-stage.jpg",
        alt: "Hands raised under stage lights",
      },
      {
        src: "https://images.kharis.org/site-images/main/79f53822455f01b0/branch-slide-2.jpg",
        alt: "Celebration on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/9b547f88f3b4d297/worship.jpg",
        alt: "Worshippers with hands raised",
      },
    ],
  },
  {
    id: "jesus-campaign",
    label: "Jesus Campaign",
    status: "past",
    layout: "half",
    media: {
      poster:
        "https://images.kharis.org/site-images/main/d717c95a5811ee19/about-mission-outreach-3200.jpg",
      alt: "Two members in yellow campaign T-shirts talking with a woman at Stratford station",
    },
    headline: "Jesus Campaign",
    subtext: "Taking the good news of Jesus to the streets of our cities.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/5bbfb2fff5c0fc8c/hero/outreach-street.jpg",
        alt: "Outreach team in yellow shirts on a city street",
      },
      {
        src: "https://images.kharis.org/site-images/main/c7e0b460a01f93eb/about-vision-team-2048.jpg",
        alt: "Outreach team posing together in yellow shirts",
      },
      {
        src: "https://images.kharis.org/site-images/main/d717c95a5811ee19/about-mission-outreach-3200.jpg",
        alt: "Talking with people on the street",
      },
      {
        src: "https://images.kharis.org/site-images/main/91479ba234a71277/vision-campaign.jpg",
        alt: "Crowd in yellow campaign shirts",
      },
      {
        src: "https://images.kharis.org/site-images/main/b722ebe4e6374dcd/about-hero-bench-3200.jpg",
        alt: "Team members outdoors",
      },
      {
        src: "https://images.kharis.org/site-images/main/ca959585decb8ff4/hero/outreach-community.jpg",
        alt: "Team gathered in a park",
      },
    ],
  },
  {
    id: "let-the-bible-speak",
    label: "Let the Bible Speak Conference",
    status: "past",
    layout: "full",
    media: {
      poster:
        "https://images.kharis.org/site-images/main/69361724ac3b9413/events/ltbs-team-caps.jpg",
      alt: "Three smiling team members in Let the Bible Speak caps and T-shirts, one wearing LTBS 2026 sunglasses",
      position: "50% 0%",
    },
    headline: "Let the Bible Speak",
    subtext: "A conference of teaching that roots us in Scripture.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/69361724ac3b9413/events/ltbs-team-caps.jpg",
        alt: "Let the Bible Speak team in matching caps and T-shirts",
        position: "50% 25%",
      },
      {
        src: "https://images.kharis.org/site-images/main/b65991e38ead9ab1/biblical-open-bible.jpg",
        alt: "Pastor holding an open Bible up high",
        position: "50% 30%",
      },
      {
        src: "https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg",
        alt: "Congregation holding their Bibles up high",
      },
      {
        src: "https://images.kharis.org/site-images/main/b8180db67daeb332/hero/preaching-open-bible.jpg",
        alt: "Pastor preaching from an open Bible",
      },
      {
        src: "https://images.kharis.org/site-images/main/aee6ab0aae266c72/hero/easter-pastor-david.jpg",
        alt: "Pastor teaching",
      },
      {
        src: "https://images.kharis.org/site-images/main/0698b74918b21fe0/hero/sunday-bible-raised.jpg",
        alt: "Member holding up her Bible",
      },
      {
        src: "https://images.kharis.org/site-images/main/ffbe5aca25d25b8c/pastor-stage.jpg",
        alt: "Pastor on stage",
      },
    ],
  },
  {
    id: "singles-ball",
    label: "Singles Ball",
    status: "past",
    layout: "split",
    split: {
      left: {
        src: "https://images.kharis.org/site-images/main/29d8fc55043c33f2/events/singles-ball/pastor-david.jpg",
        alt: "Pastor David Antwi in a black tuxedo in front of the KM Singles Ball backdrop",
        position: "50% 18%",
      },
      right: {
        src: "https://images.kharis.org/site-images/main/8daac0c4ad9423bc/events/singles-ball/pastor-awo.jpg",
        alt: "Pastor Awo Antwi in a teal and pink gown in front of the KM Singles Ball backdrop",
        position: "50% 18%",
      },
      eyebrow: "Hosted by Pastor David & Pastor Awo",
    },
    headline: "Kharis Singles Ball",
    subtext: "An evening of elegance, good food and great company.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/e06e47b90f538fed/events/singles-ball/ballroom-overview.jpg",
        alt: "Ballroom with crystal chandeliers, round dinner tables and a pink-lit stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/ace4bc7525f9512d/events/singles-ball/couples-dancing.jpg",
        alt: "Couples in formal wear dancing on the ballroom floor",
      },
      {
        src: "https://images.kharis.org/site-images/main/0c37ed7609e47454/events/singles-ball/stage-panel.jpg",
        alt: "Three hosts seated on stage with microphones in front of a pink backdrop",
      },
      {
        src: "https://images.kharis.org/site-images/main/8261677362bbb86f/events/singles-ball/gentlemen-stairs.jpg",
        alt: "Gentlemen in black tuxedos and bow ties walking down a grand staircase",
      },
      {
        src: "https://images.kharis.org/site-images/main/7471e3487b516218/events/singles-ball/ladies-selfie.jpg",
        alt: "Ladies in evening gowns smiling and posing together for a selfie",
      },
      {
        src: "https://images.kharis.org/site-images/main/29d8fc55043c33f2/events/singles-ball/pastor-david.jpg",
        alt: "Pastor David Antwi at the KM Singles Ball backdrop",
        position: "50% 20%",
      },
      {
        src: "https://images.kharis.org/site-images/main/8daac0c4ad9423bc/events/singles-ball/pastor-awo.jpg",
        alt: "Pastor Awo Antwi at the KM Singles Ball backdrop",
        position: "50% 20%",
      },
      {
        src: "https://images.kharis.org/site-images/main/4ad6b94f8e2d8cf0/events-hero-banquet.jpg",
        alt: "Banquet tables set with red roses and candles",
      },
    ],
  },
];
