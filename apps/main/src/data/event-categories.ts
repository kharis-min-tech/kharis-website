/**
 * Events on /events. Each event is ONE picture (or video) with its words and an
 * "Explore" button that opens `gallery`. They appear in this order, laid out by `layout`:
 *
 *  full   Edge-to-edge banner (Let the Bible Speak).
 *  half   Square tile; two halves in a row sit side by side (Family Fun Day,
 *         Praise Night | Jesus Campaign). Keep halves in pairs.
 *  split  Two photos joined edge to edge to look like one wide image (Singles Ball).
 *
 * Photos live in /public/images, videos in /public/videos. `media.video` is optional;
 * `media.poster` is the photo (and the still shown while a video loads).
 * `gallery` takes any number of photos (6–12 works well).
 *
 * Keep every `alt` describing what is actually in the photo. Branch-specific dates and
 * venues belong in branch event records; never invent dates for past events.
 */

export type EventCategoryStatus = "upcoming" | "spotlight" | "past";

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
  headline: string;
  subtext: string;
  gallery: EventPhoto[];
};

export type EventCategory = EventBase &
  (
    | { layout: "full" | "half"; media: EventMedia; split?: never }
    | { layout: "split"; split: EventSplit; media?: never }
  );

export type EventFilter = "all" | "upcoming" | "past";

export const EVENT_FILTERS: { id: EventFilter; label: string }[] = [
  { id: "all", label: "All events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past events" },
];

export function matchesEvent(category: EventCategory, filter: EventFilter, query: string) {
  const inFilter = filter === "all" || category.status === filter;
  const q = query.trim().toLowerCase();
  if (!inFilter || !q) return inFilter;
  return [category.label, category.headline, category.subtext].some((text) =>
    text.toLowerCase().includes(q),
  );
}

export const EVENT_CATEGORIES: EventCategory[] = [
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
  {
    id: "bring-a-soul-sunday",
    label: "BASS Sunday",
    // Keep this evergreen gathering in the event archive, but don't imply it has a confirmed date.
    status: "spotlight",
    layout: "half",
    media: {
      poster:
        "https://images.kharis.org/site-images/main/d717c95a5811ee19/about-mission-outreach-3200.jpg",
      alt: "Kharis members sharing the gospel with people in their community",
    },
    headline: "Bring a Soul",
    subtext: "A special service where you can bring someone to church to hear the Word.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/d717c95a5811ee19/about-mission-outreach-3200.jpg",
        alt: "Kharis members sharing the gospel with people in their community",
      },
      {
        src: "https://images.kharis.org/site-images/main/5bbfb2fff5c0fc8c/hero/outreach-street.jpg",
        alt: "Outreach team inviting people on a city street",
      },
      {
        src: "https://images.kharis.org/site-images/main/c7e0b460a01f93eb/about-vision-team-2048.jpg",
        alt: "Kharis outreach team gathered together",
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
        src: "https://images.kharis.org/site-images/main/0563d8186b8859bd/events/family-fun-day/_PG_1869.jpg",
        alt: "A family fun day race taking place on an outdoor court",
      },
      {
        src: "https://images.kharis.org/site-images/main/ed302fcb47e8e0c0/events/family-fun-day/_PG_1683.jpg",
        alt: "Family Fun Day guests playing a giant Jenga game outdoors",
      },
      {
        src: "https://images.kharis.org/site-images/main/de2073b31f7fe145/events/family-fun-day/601A7539.jpg",
        alt: "The event production team working beneath a canopy beside the court",
      },
      {
        src: "https://images.kharis.org/site-images/main/4cfe83363cbc1d0a/events/family-fun-day/601A7542-2-Edit.jpg",
        alt: "Church members playing table tennis outdoors",
      },
      {
        src: "https://images.kharis.org/site-images/main/e784ed1c3ce3dc9e/events/family-fun-day/601A7675.jpg",
        alt: "Two guests playing a board game together at Family Fun Day",
      },
      {
        src: "https://images.kharis.org/site-images/main/e5310ebe0c152964/events/family-fun-day/601A8071.jpg",
        alt: "Friends posing together after a football game on the outdoor court",
      },
      {
        src: "https://images.kharis.org/site-images/main/7751eca5e38c49f9/events/family-fun-day/601A8114.jpg",
        alt: "Guests lining up for an outdoor Family Fun Day activity",
      },
      {
        src: "https://images.kharis.org/site-images/main/cf965efc2942cbfd/events/family-fun-day/601A8296.jpg",
        alt: "Guests competing in a tug of war on the outdoor court",
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
        src: "https://images.kharis.org/site-images/main/30f91e40757f6bf2/events/praise-night/0I1A0489.jpg",
        alt: "Church leaders celebrating together on stage during Praise Night",
      },
      {
        src: "https://images.kharis.org/site-images/main/9d96b1cf70475253/events/praise-night/601A8340.jpg",
        alt: "Praise team leading worship with hands raised",
      },
      {
        src: "https://images.kharis.org/site-images/main/eaa93b789c189217/events/praise-night/0I1A0873.jpg",
        alt: "Pastor speaking to a packed Praise Night gathering",
      },
      {
        src: "https://images.kharis.org/site-images/main/74b9d2246e4fa66c/events/praise-night/DSC08530.jpg",
        alt: "Church members celebrating together on the Praise Night stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/ab8cf71a4e5e8b45/events/praise-night/601A8152.jpg",
        alt: "Young church members sharing a joyful moment together",
      },
      {
        src: "https://images.kharis.org/site-images/main/4564419103182d34/events/praise-night/DSC08221.jpg",
        alt: "Church members celebrating together after a gathering",
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
        "https://images.kharis.org/site-images/main/549c4ece43bf85d7/events/jesus-campaign-street.jpg",
      alt: "Kharis Jesus Campaign team sharing the gospel on a London street",
    },
    headline: "Jesus Campaign",
    subtext: "Taking the good news of Jesus to the streets of our cities.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/25713a18061ca58d/events/jesus-campaign/DSC01335.jpg",
        alt: "Kharis women singing together outdoors during a community outreach",
      },
      {
        src: "https://images.kharis.org/site-images/main/f8f92c71c30d3651/events/jesus-campaign/DSC01341.jpg",
        alt: "A group of Kharis members worshipping together beneath the trees",
      },
      {
        src: "https://images.kharis.org/site-images/main/30c014708efbb11f/events/jesus-campaign/DSC01495.jpg",
        alt: "Kharis members speaking with people outside Brixton station",
      },
      {
        src: "https://images.kharis.org/site-images/main/5149267ff4a2d52b/events/jesus-campaign/DSC01558.jpg",
        alt: "Three women praying together on a London street",
      },
      {
        src: "https://images.kharis.org/site-images/main/fc36e361f4a145c1/events/jesus-campaign/DSC01614.jpg",
        alt: "A Kharis member talking with a woman during street outreach",
      },
      {
        src: "https://images.kharis.org/site-images/main/050da2ea232685dc/events/jesus-campaign/DSC01715.jpg",
        alt: "A crowd singing and celebrating together at an outdoor gathering",
      },
      {
        src: "https://images.kharis.org/site-images/main/34164bd3283277e4/events/jesus-campaign/DSC01878.jpg",
        alt: "Kharis members gathered together after their community outreach",
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
    subtext: "A conference of teaching that roots us in Scripture, held during our trip to Ghana.",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/e2b8282e31fe53dc/events/let-the-bible-speak/_PG_0228.jpg",
        alt: "Let the Bible Speak conference delegates waiting together at an airport",
      },
      {
        src: "https://images.kharis.org/site-images/main/da02b4df22625da0/events/let-the-bible-speak/_PG_1631.jpg",
        alt: "Conference team celebrating together beside a Let the Bible Speak banner",
      },
      {
        src: "https://images.kharis.org/site-images/main/8cb8bd0512da8729/events/let-the-bible-speak/_PG_1838.jpg",
        alt: "A conference volunteer sharing a Bible message with a woman at an outdoor market",
      },
      {
        src: "https://images.kharis.org/site-images/main/90a24f0936df1c26/events/let-the-bible-speak/_PG_4210-2.jpg",
        alt: "Pastor David holding a red Bible on the Let the Bible Speak conference stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/5b4ca6ea89a002e3/events/let-the-bible-speak/_PG_6844.jpg",
        alt: "Three speakers seated together for a conference discussion on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/5642043dcd82ac45/events/let-the-bible-speak/0I1A5753.jpg",
        alt: "Let the Bible Speak team skating together along a city street",
      },
    ],
  },
];
