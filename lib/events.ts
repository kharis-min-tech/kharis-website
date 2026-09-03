export type EventCategory =
  | "Weekly"
  | "Conference"
  | "Worship"
  | "Fellowship"
  | "Outreach"
  | "Social";

export type ChurchEvent = {
  slug: string;
  title: string;
  category: EventCategory;
  /** ISO date-time, used for sorting + the countdown. */
  starts: string;
  dayLabel: string;
  timeLabel: string;
  location: string;
  blurb: string;
  cta: string;
  featured?: boolean;
};

/** Placeholder schedule — swap for a Cloud query when the backend lands. */
export const EVENTS: ChurchEvent[] = [
  {
    slug: "sunday-culture",
    title: "Phase 2: Sunday Culture",
    category: "Weekly",
    starts: "2026-08-30T10:30:00Z",
    dayLabel: "Every Sunday",
    timeLabel: "10:30 AM",
    location: "Main Auditorium + Online",
    blurb:
      "Our core gathering. Worship that goes somewhere, the word handled with care, and a room full of people who will know your name.",
    cta: "Plan Your Visit",
    featured: true,
  },
  {
    slug: "midweek-encounter",
    title: "Midweek Encounter",
    category: "Weekly",
    starts: "2026-08-27T19:00:00Z",
    dayLabel: "Every Thursday",
    timeLabel: "7:00 PM",
    location: "Main Auditorium",
    blurb:
      "Teaching, prayer and testimony midweek. Come as you are, leave with your week re-centred.",
    cta: "Join Us",
  },
  {
    slug: "night-of-worship",
    title: "Night of Worship",
    category: "Worship",
    starts: "2026-09-12T19:30:00Z",
    dayLabel: "Fri 12 Sep",
    timeLabel: "7:30 PM",
    location: "Main Auditorium",
    blurb:
      "Two hours, no agenda but His presence. Live band, spontaneous worship and space to respond.",
    cta: "Save My Spot",
  },
  {
    slug: "koc-freshers-takeover",
    title: "KOC Freshers Takeover",
    category: "Fellowship",
    starts: "2026-09-24T18:00:00Z",
    dayLabel: "Thu 24 Sep",
    timeLabel: "6:00 PM",
    location: "Campus — Students' Union",
    blurb:
      "Our campus arm welcomes the new intake. Food, games and a room of students who actually want you there.",
    cta: "Bring a Friend",
  },
  {
    slug: "city-pulse-drive",
    title: "City Pulse Drive",
    category: "Outreach",
    starts: "2026-10-03T09:00:00Z",
    dayLabel: "Sat 3 Oct",
    timeLabel: "9:00 AM",
    location: "Town Centre",
    blurb:
      "Taking the message to the streets — care packages, practical help and honest conversations with our neighbours.",
    cta: "Join the Team",
  },
  {
    slug: "grace-conference",
    title: "Grace Conference 2026",
    category: "Conference",
    starts: "2026-10-16T18:30:00Z",
    dayLabel: "Fri 16 – Sun 18 Oct",
    timeLabel: "From 6:30 PM",
    location: "Kharis Phase 2 HQ",
    blurb:
      "Three days of teaching, worship and sending. Guest ministers, workshops and our biggest gathering of the year.",
    cta: "Register Free",
  },
  {
    slug: "new-breeds-launch",
    title: "New Breeds Launch Night",
    category: "Fellowship",
    starts: "2026-10-24T18:00:00Z",
    dayLabel: "Sat 24 Oct",
    timeLabel: "6:00 PM",
    location: "Local venue — TBC",
    blurb:
      "A taste of Kharis where there isn't a branch yet. Small room, same fire, planted right in your area.",
    cta: "Get Details",
  },
  {
    slug: "young-adults-social",
    title: "Young Adults Social",
    category: "Social",
    starts: "2026-11-07T17:00:00Z",
    dayLabel: "Sat 7 Nov",
    timeLabel: "5:00 PM",
    location: "Off-site — details on sign-up",
    blurb:
      "Bowling, food and far too much noise. No sermon, just the family hanging out.",
    cta: "Count Me In",
  },
];

export const EVENT_CATEGORIES: EventCategory[] = [
  "Weekly",
  "Conference",
  "Worship",
  "Fellowship",
  "Outreach",
  "Social",
];

export const CATEGORY_ICON: Record<EventCategory, string> = {
  Weekly: "event_repeat",
  Conference: "campaign",
  Worship: "music_note",
  Fellowship: "groups",
  Outreach: "volunteer_activism",
  Social: "celebration",
};
