/**
 * Children's department page (/life/children). Every age group is driven from this file:
 * adding or retuning a group is a data change, not a component change.
 */

export type ChildrenFontKey = "fredoka" | "rubik" | "archivo-black";

/** How a group section arranges its copy and photos, with any layout-specific content. */
export type ChildrenLayout =
  | {
      kind: "picture-book";
      /** Hand-stuck label on the photo pile. */
      sticker: string;
      /** Numbered strip under the spread. */
      routine: { title: string; steps: readonly string[]; confirm: string };
    }
  | {
      kind: "trail";
      checkpoints: readonly { id: string; name: string; goal?: boolean }[];
      /** The one field to edit when the month's verse changes. */
      memoryVerse: { label: string; text: string; reference: string };
    }
  | {
      kind: "bento";
      /** Small label on each discussion tile. */
      kicker: string;
      realTalk: readonly { id: string; title: string }[];
      /** Shown on the page, not only behind a flip. */
      realTalkConfirm: string;
      teaching: string;
      scripture: { text: string; reference: string };
      pathway: { label: string; steps: readonly { label: string; href?: string }[] };
      questions: readonly { id: string; question: string; confirm: string }[];
    };

/** Colour roles the components read. Each maps to one of the group's named tokens. */
export type PaletteRole = "bg" | "ink" | "numeral" | "accent" | "soft";

export type PhotoSlot = {
  id: string;
  /** CSS aspect-ratio on wider screens, e.g. "4 / 5". */
  aspect: string;
  /** CSS aspect-ratio below 768px. Defaults to `aspect`. */
  mobileAspect?: string;
  /** Alt text for the final photo; the placeholder uses it too. */
  alt: string;
  /** Art direction for the photographer. */
  art: string;
  /** Short visible label, where the layout prints one under the photo. */
  caption?: string;
};

export type ChildrenGroup<Token extends string = string> = {
  id: "kinder" | "super" | "transition";
  name: string;
  ages: { from: number; to: number };
  /** One line under the group name. */
  promise?: string;
  palette: {
    tokens: Record<Token, string>;
    roles: Record<PaletteRole, NoInfer<Token>>;
  };
  font: { heading: ChildrenFontKey; headingWeight: number; labelWeight: number };
  /** The group's bar in the growth-chart hero. */
  heroBar: {
    /** Shown when the bar is hovered or focused. */
    line: string;
    tagBg: NoInfer<Token>;
    /** Text colour on the tag; must hold 4.5:1 against `tagBg`. */
    tagText: string;
    photo: PhotoSlot;
  };
  layout: ChildrenLayout;
  headline: string;
  body: string;
  photos: readonly PhotoSlot[];
};

/** Keeps palette roles checked against each group's own token names. */
const defineGroup = <Token extends string>(group: ChildrenGroup<Token>): ChildrenGroup =>
  group as unknown as ChildrenGroup;

export const CHILDREN_VISION_LINE =
  "Our prayer: a generation that carries the torch of faith for years to come.";

export const CHILDREN_HERO = {
  eyebrow: "Kharis Kids · Ages 3–16",
  title: "Grace for every stage of growing up.",
  subtitle:
    "We partner with parents to raise the next generation in the ways of the Lord, through Bible teaching, worship and friendships that grow with your child.",
  findLabel: "Find my child's group",
} as const;

/** Art direction shared by the hero bars: tall on wide screens, short and wide on phones. */
const HERO_BAR_ART =
  "Crops tall on desktop and short-and-wide on phones, so keep the subject centred with space around it. Faces visible only with parental consent.";

export const CHILDREN_GROUPS: readonly ChildrenGroup[] = [
  defineGroup({
    id: "kinder",
    name: "Kinder",
    ages: { from: 3, to: 6 },
    palette: {
      tokens: {
        bg: "#FFF4DC",
        sun: "#F6B93B",
        coral: "#EF7A5A",
        sky: "#8FD3F4",
        ink: "#3A2A12",
        clay: "#A8572F",
      },
      roles: { bg: "bg", ink: "ink", numeral: "coral", accent: "sun", soft: "sky" },
    },
    font: { heading: "fredoka", headingWeight: 700, labelWeight: 700 },
    heroBar: {
      line: "Little hearts, big wonder.",
      tagBg: "sun",
      tagText: "#3A2A12",
      photo: {
        id: "kinder-hero-bar",
        aspect: "auto",
        alt: "A Kinder child smiling during a Sunday activity",
        art: HERO_BAR_ART,
      },
    },
    layout: {
      kind: "picture-book",
      sticker: "Little hearts, big wonder.",
      routine: {
        title: "A Kinder morning",
        steps: ["Welcome & play", "Bible story", "Sing & move", "Create & pray", "Pick-up"],
        confirm: "The order of a Kinder morning.",
      },
    },
    headline: "Loved by God from the very start.",
    body: "A nurturing space where little ones first discover God through Bible stories, worship, prayer and friendship. Our aim is a love and boldness for Jesus that, when they reach the age of understanding, they'll eagerly choose for themselves.",
    photos: [
      {
        id: "kinder-story-time",
        aspect: "4 / 5",
        alt: "A Kinder leader reading a picture-book Bible story to a small circle of children",
        art: "Close-up in warm light, over the children's shoulders towards the open book. Backs of heads where consent is hard.",
        caption: "Story time",
      },
      {
        id: "kinder-craft-hands",
        aspect: "1 / 1",
        alt: "Small hands colouring and gluing a Bible craft",
        art: "Tight close-up of hands and materials in warm light; no faces needed.",
        caption: "Little hands at work",
      },
    ],
  }),
  defineGroup({
    id: "super",
    name: "Super",
    ages: { from: 7, to: 11 },
    palette: {
      tokens: {
        bg: "#E9FAF0",
        green: "#0F7A3E",
        cobalt: "#2F5BEA",
        pink: "#FF5EA8",
        ink: "#0F2A1C",
        leaf: "#BFEACF",
      },
      roles: { bg: "bg", ink: "ink", numeral: "green", accent: "cobalt", soft: "leaf" },
    },
    font: { heading: "rubik", headingWeight: 800, labelWeight: 700 },
    heroBar: {
      line: "Curious minds, solid ground.",
      tagBg: "green",
      tagText: "#FFFFFF",
      photo: {
        id: "super-hero-bar",
        aspect: "auto",
        alt: "A Super child reading an open Bible",
        art: HERO_BAR_ART,
      },
    },
    layout: {
      kind: "trail",
      checkpoints: [
        { id: "salvation", name: "Salvation" },
        { id: "faith", name: "Faith" },
        { id: "holy-spirit", name: "The Holy Spirit" },
        { id: "knowing-jesus", name: "Knowing & following Jesus", goal: true },
      ],
      memoryVerse: {
        label: "Memory verse this month",
        text: "Your word is a lamp to my feet and a light to my path.",
        reference: "Psalm 119:105 (NKJV)",
      },
    },
    headline: "Big faith. Bold steps.",
    body: "A lively community laying a solid biblical foundation. Through core truths like salvation, faith and the Holy Spirit, we guide children into a personal, fruitful journey of knowing and following Christ.",
    photos: [
      {
        id: "super-squad-group",
        aspect: "4 / 5",
        mobileAspect: "4 / 3",
        alt: "A group of Super children together, mid-laugh",
        art: "The squad as a group, in motion, bright light. Faces only with consent.",
      },
      {
        id: "super-squad-game",
        aspect: "4 / 5",
        mobileAspect: "4 / 3",
        alt: "Super children in the middle of a game",
        art: "Action: a game underway, movement, no posed line-up.",
      },
      {
        id: "super-squad-hands",
        aspect: "4 / 5",
        mobileAspect: "4 / 3",
        alt: "Super children with hands raised to answer",
        art: "Raised hands, energy, a wide enough frame to show the group.",
      },
    ],
  }),
  defineGroup({
    id: "transition",
    name: "Transition",
    ages: { from: 12, to: 16 },
    palette: {
      tokens: {
        bg: "#F1ECFF",
        purple: "#5B2BD1",
        orange: "#FF7A3D",
        sky: "#2FB7F5",
        ink: "#160B2E",
        lavender: "#CDBDF7",
      },
      roles: { bg: "bg", ink: "ink", numeral: "purple", accent: "orange", soft: "lavender" },
    },
    font: { heading: "archivo-black", headingWeight: 400, labelWeight: 400 },
    heroBar: {
      line: "Big questions, bold faith.",
      tagBg: "purple",
      tagText: "#FFFFFF",
      photo: {
        id: "transition-hero-bar",
        aspect: "auto",
        alt: "A Transition teenager worshipping with friends",
        art: HERO_BAR_ART,
      },
    },
    layout: {
      kind: "bento",
      kicker: "The Person Jesus Christ",
      realTalk: [
        { id: "identity", title: "Truly man" },
        { id: "peers", title: "Truly God" },
        { id: "purpose", title: "Sinless" },
      ],
      realTalkConfirm: "The themes for The Person Jesus Christ: Truly man, Truly God, Sinless.",
      teaching: "Grounded in Pastor David Antwi's teaching",
      scripture: {
        text: "Let no one despise your youth, but be an example to the believers in word, in conduct, in love, in spirit, in faith, in purity.",
        reference: "1 Timothy 4:12 (NKJV)",
      },
      pathway: {
        label: "Your next season",
        steps: [
          { label: "Baptism", href: "/life/baptism" },
          { label: "Departments", href: "/life/departments" },
          { label: "Sunday family" },
        ],
      },
      questions: [
        {
          id: "session",
          question: "What happens in a session?",
          confirm: "What happens in a Transition session.",
        },
        {
          id: "friend",
          question: "Can I bring a friend?",
          confirm: "How a friend checks in to a Transition session.",
        },
      ],
    },
    headline: "Stand firm. Stand out.",
    body: "Fun, interactive lessons grounded in the teachings of Pastor David Antwi. We equip teenagers to navigate everyday life, be bold for Jesus among their peers, and step confidently into their next season in the church.",
    photos: [
      {
        id: "transition-discussion",
        aspect: "1 / 1",
        alt: "Transition teenagers in a candid discussion with a leader",
        art: "Bright and candid, mid-conversation, not a posed line-up. Faces only with consent.",
      },
      {
        id: "transition-worship",
        aspect: "4 / 3",
        alt: "Transition teenagers worshipping together",
        art: "Bright, candid worship, from the side or behind.",
      },
      {
        id: "transition-serving",
        aspect: "4 / 3",
        alt: "Transition teenagers serving on a team",
        art: "Bright and candid, in the middle of serving, movement welcome.",
      },
      {
        id: "transition-leaders",
        aspect: "4 / 3",
        alt: "Transition leaders with the teenagers",
        art: "Leaders' faces, bright and candid, with their consent.",
      },
    ],
  }),
];

export function groupAgeLabel(group: ChildrenGroup) {
  return `${group.ages.from}–${group.ages.to}`;
}

export function groupTone(group: ChildrenGroup, role: PaletteRole) {
  return group.palette.tokens[group.palette.roles[role]];
}
