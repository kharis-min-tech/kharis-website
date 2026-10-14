import type { LucideIcon } from "lucide-react";
import { BookOpen, Church, FerrisWheel, Heart, Megaphone, MicVocal, MoonStar, Tent } from "lucide-react";

/**
 * Event categories on /events: the icon row and the slideshow under it.
 *
 * To swap a photo, change `src` (files live in /public/images) and keep `alt`
 * describing what is actually in the new picture. Upcoming categories read
 * their day, time and venue from the branch data, so never put those here.
 */

export type EventCategoryStatus = "upcoming" | "past";

export type EventSlide = {
  src: string;
  alt: string;
  headline: string;
  /** CSS object-position, for photos whose subject is off-centre. */
  position?: string;
};

export type EventCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  status: EventCategoryStatus;
  /** Which branch service an upcoming category maps to. */
  service?: "sunday" | "midweek";
  summary: string;
  slides: EventSlide[];
};

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: "sunday-service",
    label: "Sunday Service",
    icon: Church,
    status: "upcoming",
    service: "sunday",
    summary: "Worship, the Word and a church family to belong to. Everyone is welcome.",
    slides: [
      {
        src: "/images/events/hero-worship.jpg",
        alt: "Congregation worshipping with hands raised towards the stage",
        headline: "Sundays at Kharis. Worship, the Word, and family.",
      },
      {
        src: "/images/branch-slide-4.jpg",
        alt: "Wide view of the congregation gathered in the main hall",
        headline: "Come as you are. There’s a seat for you.",
      },
      {
        src: "/images/hero/sunday-bible-raised.jpg",
        alt: "Church member smiling and holding up her Bible during the service",
        headline: "Bibles open. Hearts ready.",
      },
      {
        src: "/images/branch-slide-1.jpg",
        alt: "Congregation standing in worship during a Sunday service",
        headline: "One church family, many cities.",
      },
    ],
  },
  {
    id: "midweek",
    label: "Midweek Service",
    icon: MoonStar,
    status: "upcoming",
    service: "midweek",
    summary: "A midweek evening of the Word and prayer to carry you through the week.",
    slides: [
      {
        src: "/images/hero/preaching-open-bible.jpg",
        alt: "Pastor preaching from an open Bible with scripture on the screen",
        headline: "Midweek. The Word, right in the middle of your week.",
      },
      {
        src: "/images/grace-filled-prayer.jpg",
        alt: "Church members praying together",
        headline: "Bring your burdens. Leave with fresh strength.",
      },
      {
        src: "/images/testimony-stage-1.jpg",
        alt: "Members sharing on stage during a service",
        headline: "Stories of what God is doing.",
      },
    ],
  },
  {
    id: "singles-ball",
    label: "Singles Ball",
    icon: Heart,
    status: "past",
    summary: "An evening of elegance, good food and great company.",
    slides: [
      {
        src: "/images/events-hero-banquet.jpg",
        alt: "Banquet tables set with red roses and candles beneath chandeliers",
        headline: "An evening to dress up and be celebrated.",
        position: "50% 30%",
      },
      {
        src: "/images/love-greeting.jpg",
        alt: "Two men greeting each other warmly with a handshake and a hug",
        headline: "Friendships that start at the table.",
      },
      {
        src: "/images/become-a-believer.jpg",
        alt: "Women in matching traditional dresses standing together",
        headline: "Dressed for a night to remember.",
        position: "50% 25%",
      },
    ],
  },
  {
    id: "praise-night",
    label: "Praise Night",
    icon: MicVocal,
    status: "past",
    summary: "A whole night set apart for praise and worship.",
    slides: [
      {
        src: "/images/joyful-worship.jpg",
        alt: "Congregation worshipping with hands raised",
        headline: "A whole night given to praise.",
      },
      {
        src: "/images/locations-worship-team.jpg",
        alt: "Worship team singing on stage",
        headline: "Voices raised, hearts open.",
      },
      {
        src: "/images/hero/sunday-service-stage.jpg",
        alt: "Hands raised in worship under blue stage lights",
        headline: "Hands up. Hearts full.",
      },
      {
        src: "/images/hero/worship-altar.jpg",
        alt: "Congregation gathered at the front of the hall in worship",
        headline: "Lost in His presence.",
      },
    ],
  },
  {
    id: "camps",
    label: "Camps",
    icon: Tent,
    status: "past",
    summary: "Time away to grow in faith and friendship.",
    slides: [
      {
        src: "/images/about-vision-team-2048.jpg",
        alt: "Large group of church members posing together outdoors",
        headline: "Away from the noise, closer to God.",
      },
      {
        src: "/images/young-adults.jpg",
        alt: "Young adults seated together in a session",
        headline: "Word, worship and friendship.",
      },
      {
        src: "/images/branch-slide-3.jpg",
        alt: "Members taking notes during a teaching session",
        headline: "Notebooks open, hearts ready.",
      },
    ],
  },
  {
    id: "family-fun-day",
    label: "Family Fun Day",
    icon: FerrisWheel,
    status: "past",
    summary: "A day out for the whole church family, from the youngest to the oldest.",
    slides: [
      {
        src: "/images/hero/outreach-community.jpg",
        alt: "Church members gathered outdoors in a park",
        headline: "A day out for the whole church family.",
      },
      {
        src: "/images/about-hero-bench-3200.jpg",
        alt: "Church members sitting together on a bench outdoors",
        headline: "Sunshine and good company.",
      },
      {
        src: "/images/branch-slide-2.jpg",
        alt: "Pastor celebrating on stage with the congregation",
        headline: "Every generation, together.",
      },
    ],
  },
  {
    id: "jesus-campaign",
    label: "Jesus Campaign",
    icon: Megaphone,
    status: "past",
    summary: "Taking the good news of Jesus to the streets of our cities.",
    slides: [
      {
        src: "/images/about-mission-outreach-3200.jpg",
        alt: "Church members in yellow shirts talking with people on the street",
        headline: "Taking the good news to the streets.",
      },
      {
        src: "/images/hero/outreach-street.jpg",
        alt: "Outreach team in yellow shirts gathered on a city street",
        headline: "One conversation can change a life.",
      },
      {
        src: "/images/vision-campaign.jpg",
        alt: "Crowd of church members in yellow campaign shirts",
        headline: "One message: Jesus.",
      },
    ],
  },
  {
    id: "let-the-bible-speak",
    label: "Let the Bible Speak Conference",
    icon: BookOpen,
    status: "past",
    summary: "Teaching that roots us in Scripture.",
    slides: [
      {
        src: "/images/biblical-open-bible.jpg",
        alt: "Hands holding an open Bible",
        headline: "Let the Bible speak.",
      },
      {
        src: "/images/hero/easter-bibles-raised.jpg",
        alt: "Congregation holding their Bibles up high",
        headline: "Open the Word. Hear God speak.",
      },
      {
        src: "/images/hero/easter-pastor-david.jpg",
        alt: "Pastor teaching from the stage",
        headline: "Teaching that roots you in Scripture.",
      },
    ],
  },
];
