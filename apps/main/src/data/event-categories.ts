import type { LucideIcon } from "lucide-react";
import { BookOpen, Church, FerrisWheel, Heart, Megaphone, MicVocal, Tent } from "lucide-react";

/**
 * Event categories on /events: the icon row and the story shown under it.
 *
 * Each story has four parts. Photos live in /public/images, videos in /public/videos.
 *
 *  hero     Full-width banner with no buttons. `video` is optional and only Sunday Service
 *           and Singles Ball use one; without it the poster photo is shown with a slow
 *           zoom. `poster` is also the still shown while the video loads.
 *  tiles    Exactly two large photos side by side, each with a short caption.
 *  split    Two photos joined edge to edge to look like one wide image, with a big
 *           headline and the section's only button, "Explore", which opens `gallery`.
 *  gallery  Any number of photos for the Explore lightbox (6–12 works well).
 *
 * Keep every `alt` describing what is actually in the new photo. Upcoming categories
 * take their day, time and venue from the branch data, so never put those here, and
 * never invent dates for past events.
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

export type EventHero = {
  video?: string;
  poster: string;
  posterAlt: string;
  headline: string;
  subtext: string;
};

export type EventTile = EventPhoto & {
  eyebrow: string;
  title: string;
  description: string;
};

export type EventSplit = {
  left: EventPhoto;
  right: EventPhoto;
  eyebrow: string;
  headline: string;
};

export type EventCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  status: EventCategoryStatus;
  /** Which branch service an upcoming category maps to. */
  service?: "sunday" | "midweek";
  hero: EventHero;
  tiles: [EventTile, EventTile];
  split: EventSplit;
  gallery: EventPhoto[];
};

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: "sunday-service",
    label: "Sunday Service",
    icon: Church,
    status: "upcoming",
    service: "sunday",
    hero: {
      video: "/videos/hero-a.mp4?v=2",
      poster: "/videos/hero-a-poster.jpg",
      posterAlt: "Congregation in worship during a Sunday service",
      headline: "Sunday Service",
      subtext: "Worship, the Word and a church family to belong to. Everyone is welcome.",
    },
    tiles: [
      {
        src: "/images/events/sunday-worship-hands.jpg",
        alt: "Woman worshipping with both hands raised during a Sunday service",
        position: "82% center",
        eyebrow: "Worship",
        title: "Hearts lifted high",
        description: "We open every Sunday giving God the praise He deserves.",
      },
      {
        src: "/images/hero/sunday-bible-raised.jpg",
        alt: "Church member smiling and holding up her Bible during the service",
        eyebrow: "The Word",
        title: "Bibles open, hearts ready",
        description: "Clear, practical teaching from Scripture for the week ahead.",
      },
    ],
    split: {
      left: {
        src: "/images/events/sunday-pastor-open-bible.jpg",
        alt: "Pastor David holding up an open Bible on stage",
        position: "100% center",
        mobilePosition: "54% center",
      },
      right: {
        src: "/images/events/sunday-pastor-bible-raised.jpg",
        alt: "Pastor David lifting a red Bible during the service",
        position: "30% center",
        mobilePosition: "50% center",
      },
      eyebrow: "Preaching at Kharis",
      headline: "Built on the Word.",
    },
    gallery: [
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
    id: "midweek",
    label: "Midweek Service",
    icon: Church,
    status: "upcoming",
    service: "midweek",
    hero: {
      poster: "/images/hero/preaching-open-bible.jpg",
      posterAlt: "Pastor preaching from an open Bible with scripture on the screen",
      headline: "Midweek Service",
      subtext: "The Word and prayer, right in the middle of your week.",
    },
    tiles: [
      {
        src: "/videos/hero-b-poster.jpg",
        alt: "Pastor preaching on stage in front of a blue screen",
        eyebrow: "The Word",
        title: "Teaching for everyday life",
        description: "An evening in Scripture to steady you for the rest of the week.",
      },
      {
        src: "/images/grace-filled-prayer.jpg",
        alt: "Church members praying together",
        eyebrow: "Prayer",
        title: "Bring your burdens",
        description: "Time set aside to pray for one another and leave with fresh strength.",
      },
    ],
    split: {
      left: { src: "/images/testimony-stage-1.jpg", alt: "Members sharing on stage" },
      right: { src: "/images/testimony-stage-2.jpg", alt: "Pastor praying with members on stage" },
      eyebrow: "Testimonies",
      headline: "Stories of what God is doing",
    },
    gallery: [
      { src: "/images/testimony-sharing.jpg", alt: "Member sharing a testimony" },
      { src: "/images/love-greeting.jpg", alt: "Two members greeting each other warmly" },
      { src: "/images/hero/impartation-celebration.jpg", alt: "Pastor celebrating with the congregation" },
      { src: "/images/hero/easter-pastor-david.jpg", alt: "Pastor teaching from the stage" },
      { src: "/images/branch-slide-3.jpg", alt: "Members taking notes during teaching" },
      { src: "/images/young-adults.jpg", alt: "Young adults seated together in a session" },
    ],
  },
  {
    id: "singles-ball",
    label: "Singles Ball",
    icon: Heart,
    status: "past",
    hero: {
      // video: "/videos/singles-ball.mp4",
      poster: "/images/events/singles-ball/stage-panel.jpg",
      posterAlt:
        "Three hosts in evening wear seated on stage with microphones in front of a glowing pink backdrop",
      headline: "Singles Ball",
      subtext: "An evening of elegance, good food and great company.",
    },
    tiles: [
      {
        src: "/images/events/singles-ball/gentlemen-stairs.jpg",
        alt: "Gentlemen in black tuxedos and bow ties walking down a grand staircase",
        eyebrow: "The gentlemen",
        title: "Black tie, best foot forward.",
        description: "Tuxedos pressed and bow ties straight for the walk down to the ballroom.",
        position: "50% 30%",
      },
      {
        src: "/images/events/singles-ball/ladies-selfie.jpg",
        alt: "Ladies in evening gowns smiling and posing together for a selfie",
        eyebrow: "The ladies",
        title: "Glamour, laughter and selfies all night.",
        description: "Evening gowns, big smiles and plenty of photos to remember the night.",
        position: "50% 30%",
      },
    ],
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
      headline: "Kharis Singles Ball",
    },
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
        alt: "Gentlemen in tuxedos walking down a grand staircase",
      },
      {
        src: "/images/events/singles-ball/ladies-selfie.jpg",
        alt: "Ladies in evening gowns posing for a selfie",
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
  {
    id: "praise-night",
    label: "Praise Night",
    icon: MicVocal,
    status: "past",
    hero: {
      poster: "/images/joyful-worship.jpg",
      posterAlt: "Congregation worshipping with hands raised",
      headline: "Praise Night",
      subtext: "A whole night set apart for praise and worship.",
    },
    tiles: [
      {
        src: "/images/locations-worship-team.jpg",
        alt: "Worship team singing on stage",
        eyebrow: "The team",
        title: "Voices raised, hearts open",
        description: "The worship team led the room in song from start to finish.",
      },
      {
        src: "/images/get-involved-sax.jpg",
        alt: "Saxophonist playing during worship",
        eyebrow: "The sound",
        title: "Every instrument giving thanks",
        description: "Live music carried the night from one song to the next.",
        position: "50% 30%",
      },
    ],
    split: {
      left: { src: "/images/hero/sunday-service-stage.jpg", alt: "Hands raised under blue stage lights" },
      right: { src: "/images/hero/worship-altar.jpg", alt: "Congregation gathered at the front in worship" },
      eyebrow: "Praise Night",
      headline: "Lost in His presence",
    },
    gallery: [
      { src: "/images/joyful-worship.jpg", alt: "Congregation worshipping with joy" },
      { src: "/images/locations-worship-team.jpg", alt: "Worship team singing" },
      { src: "/images/hero/worship-altar.jpg", alt: "Worship at the front of the hall" },
      { src: "/images/hero/sunday-service-stage.jpg", alt: "Hands raised under stage lights" },
      { src: "/images/branch-slide-2.jpg", alt: "Celebration on stage" },
      { src: "/images/worship.jpg", alt: "Worshippers with hands raised" },
    ],
  },
  {
    id: "camps",
    label: "Camps",
    icon: Tent,
    status: "past",
    hero: {
      poster: "/images/about-vision-team-2048.jpg",
      posterAlt: "Large group of church members posing together outdoors",
      headline: "Camps",
      subtext: "Time away to grow in faith and friendship.",
    },
    tiles: [
      {
        src: "/images/young-adults.jpg",
        alt: "Young adults seated together in a session",
        eyebrow: "Together",
        title: "Word, worship and friendship",
        description: "Days spent learning, praying and laughing together.",
      },
      {
        src: "/images/branch-slide-3.jpg",
        alt: "Members taking notes during a teaching session",
        eyebrow: "Sessions",
        title: "Notebooks open, hearts ready",
        description: "Teaching sessions that went deeper than a Sunday allows.",
      },
    ],
    split: {
      left: { src: "/images/about-hero-bench-3200.jpg", alt: "Members sitting together outdoors" },
      right: { src: "/images/hero/outreach-community.jpg", alt: "Members gathered outdoors in a park" },
      eyebrow: "Camps",
      headline: "Away from the noise",
    },
    gallery: [
      { src: "/images/about-vision-team-2048.jpg", alt: "Group photo outdoors" },
      { src: "/images/young-adults.jpg", alt: "Young adults in a session" },
      { src: "/images/branch-slide-3.jpg", alt: "Members taking notes" },
      { src: "/images/about-hero-bench-3200.jpg", alt: "Members sitting together outdoors" },
      { src: "/images/hero/outreach-community.jpg", alt: "Members gathered in a park" },
      { src: "/images/love-greeting.jpg", alt: "Members greeting each other" },
    ],
  },
  {
    id: "family-fun-day",
    label: "Family Fun Day",
    icon: FerrisWheel,
    status: "past",
    hero: {
      poster: "/images/about-hero-bench-3200.jpg",
      posterAlt: "Church members sitting together on a bench outdoors",
      headline: "Family Fun Day",
      subtext: "A day out for the whole church family, from the youngest to the oldest.",
    },
    tiles: [
      {
        src: "/images/hero/outreach-community.jpg",
        alt: "Church members gathered outdoors in a park",
        eyebrow: "Outdoors",
        title: "Sunshine and good company",
        description: "Families spent the day together out in the open air.",
      },
      {
        src: "/images/branch-slide-2.jpg",
        alt: "Pastor celebrating on stage with the congregation",
        eyebrow: "Celebration",
        title: "Joy you could hear",
        description: "Games, food and plenty of laughter for every age.",
      },
    ],
    split: {
      left: { src: "/images/hero/impartation-celebration.jpg", alt: "Pastor celebrating with the congregation" },
      right: { src: "/images/love-greeting.jpg", alt: "Members greeting each other warmly" },
      eyebrow: "Family Fun Day",
      headline: "Every generation, together",
    },
    gallery: [
      { src: "/images/about-hero-bench-3200.jpg", alt: "Members on a bench outdoors" },
      { src: "/images/hero/outreach-community.jpg", alt: "Members in a park" },
      { src: "/images/branch-slide-2.jpg", alt: "Celebration on stage" },
      { src: "/images/hero/impartation-celebration.jpg", alt: "Pastor celebrating with members" },
      { src: "/images/love-greeting.jpg", alt: "Members greeting each other" },
      { src: "/images/young-adults.jpg", alt: "Young adults together" },
    ],
  },
  {
    id: "jesus-campaign",
    label: "Jesus Campaign",
    icon: Megaphone,
    status: "past",
    hero: {
      poster: "/images/about-mission-outreach-3200.jpg",
      posterAlt: "Church members in yellow shirts talking with people on the street",
      headline: "Jesus Campaign",
      subtext: "Taking the good news of Jesus to the streets of our cities.",
    },
    tiles: [
      {
        src: "/images/hero/outreach-street.jpg",
        alt: "Outreach team in yellow shirts on a city street",
        eyebrow: "On the streets",
        title: "One conversation can change a life",
        description: "Teams went out to share the gospel with anyone who would listen.",
      },
      {
        src: "/images/about-vision-team-2048.jpg",
        alt: "Outreach team posing together in yellow shirts",
        eyebrow: "The team",
        title: "Yellow shirts, one message",
        description: "Members from across the church served side by side.",
      },
    ],
    split: {
      left: { src: "/images/about-hero-bench-3200.jpg", alt: "Outreach team members resting outdoors" },
      right: { src: "/images/hero/outreach-community.jpg", alt: "Outreach team gathered in a park" },
      eyebrow: "Jesus Campaign",
      headline: "One message: Jesus",
    },
    gallery: [
      { src: "/images/about-mission-outreach-3200.jpg", alt: "Talking with people on the street" },
      { src: "/images/hero/outreach-street.jpg", alt: "Outreach team on a city street" },
      { src: "/images/vision-campaign.jpg", alt: "Crowd in yellow campaign shirts" },
      { src: "/images/about-vision-team-2048.jpg", alt: "Outreach team group photo" },
      { src: "/images/about-hero-bench-3200.jpg", alt: "Team members outdoors" },
      { src: "/images/hero/outreach-community.jpg", alt: "Team gathered in a park" },
    ],
  },
  {
    id: "let-the-bible-speak",
    label: "Let the Bible Speak Conference",
    icon: BookOpen,
    status: "past",
    hero: {
      poster: "/images/biblical-open-bible.jpg",
      posterAlt: "Hands holding an open Bible",
      headline: "Let the Bible Speak",
      subtext: "A conference of teaching that roots us in Scripture.",
    },
    tiles: [
      {
        src: "/images/hero/easter-bibles-raised.jpg",
        alt: "Congregation holding their Bibles up high",
        eyebrow: "Scripture",
        title: "Open the Word, hear God speak",
        description: "Sessions built around reading and understanding the Bible together.",
      },
      {
        src: "/images/hero/preaching-open-bible.jpg",
        alt: "Pastor preaching from an open Bible",
        eyebrow: "Teaching",
        title: "Rooted and grounded",
        description: "Speakers opened the Scriptures and applied them to everyday life.",
      },
    ],
    split: {
      left: { src: "/images/hero/easter-pastor-david.jpg", alt: "Pastor teaching from the stage" },
      right: { src: "/images/hero/sunday-bible-raised.jpg", alt: "Member holding up her Bible" },
      eyebrow: "Let the Bible Speak",
      headline: "Let the Bible speak",
    },
    gallery: [
      { src: "/images/biblical-open-bible.jpg", alt: "Open Bible" },
      { src: "/images/hero/easter-bibles-raised.jpg", alt: "Bibles raised high" },
      { src: "/images/hero/easter-pastor-david.jpg", alt: "Pastor teaching" },
      { src: "/images/hero/preaching-open-bible.jpg", alt: "Preaching from an open Bible" },
      { src: "/images/hero/sunday-bible-raised.jpg", alt: "Member holding up her Bible" },
      { src: "/images/pastor-stage.jpg", alt: "Pastor on stage" },
    ],
  },
];
