export type LifeTone = "gold" | "dark" | "purple" | "cream";

export type LifeSlug =
  | "k-group"
  | "baptism"
  | "fasting"
  | "marriage"
  | "children"
  | "departments";

export type LifeSection = {
  title: string;
  body: string;
  items?: readonly string[];
};

export type LifeCategory = {
  slug: LifeSlug;
  title: string;
  shortTitle: string;
  badge: string;
  href: string;
  card: string;
  image: string;
  imageAlt: string;
  tone: LifeTone;
  layout: "photo" | "text" | "blend";
  icon: "users" | "droplets" | "flame" | "heart" | "sparkles" | "layout";
  intro: string;
  quote?: { text: string; source: string };
  sections: readonly LifeSection[];
  contact?: string;
  next?: LifeSlug;
  cta: { label: string; href: string };
};

export const LIFE_MEMBERSHIP_URL = "https://kharis.org/";
export const LIFE_DEPARTMENTS_URL = "http://discover.khar.is/";
export const LIFE_KGROUP_EMAIL = "kgroup@kharis.org";

/** Calm water surface — baptism card and detail hero. */
export const LIFE_BAPTISM_IMAGE =
  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80";

export const LIFE_SERVE_IMAGE = "/images/serve-with-us.jpg";

export const LIFE_HERO = {
  eyebrow: "Community first",
  title: "Kharis Life",
  body: "The Christian life is a one-another life. Believe, become, and belong. Grow in the Word, find your people, and live out your faith in the Kharis family.",
  sticky: "Join the family. We’re better together.",
  banner: "A one-another life. Belong here",
  quoteSource: "David Antwi",
  image: "/images/branch-slide-4.jpg",
  imageAlt:
    "The Kharis congregation gathered in a full hall during Sunday service",
} as const;

/** Real Kharis departments from kharis.org/get-involved. */
export const LIFE_DEPARTMENTS = [
  "Worship",
  "Kids",
  "Media",
  "Prayer",
  "Youth",
  "Hospitality",
  "Ushers",
  "Evangelism",
  "Production",
  "Sound",
  "Welfare",
  "Host team",
] as const;

/** Card copy on the main Life page — adapted from kharis.org/k-life and category pages. */
export const LIFE_CATEGORIES: readonly LifeCategory[] = [
  {
    slug: "k-group",
    title: "K-Group",
    shortTitle: "K-Group",
    badge: "Small groups",
    href: "/life/k-group",
    card: "Small home fellowships where we discuss the Word, pray, and care for one another, growing larger and smaller at the same time.",
    image: "/images/branch-slide-1.jpg",
    imageAlt: "A full Kharis hall gathered for the Word",
    tone: "gold",
    layout: "photo",
    icon: "users",
    intro:
      "Fellowship with other believers is an important part of the Christian journey. That’s why we have created KGroup: small home fellowships where we meet to discuss the Word, pray and get to know other people in Church. And as Kharis grows, KGroup is a key way we ensure that people are genuinely cared for on a 1-2-1 basis.",
    quote: {
      text: "Love must be sincere. Hate what is evil; cling to what is good. Be devoted to one another in love. Honour one another above yourselves.",
      source: "Romans 12:9-10",
    },
    sections: [
      {
        title: "Growing larger and smaller at the same time",
        body: "Kharis is a church of strong and effective small groups. K-Groups keep the family close as the church grows: a place to be known, prayed for, and established in the Word.",
      },
      {
        title: "Meeting times",
        body: "Every Friday from 7:00pm – 8:30pm, unless announced otherwise in the services. Ask at your local branch and we’ll help you find a group near you.",
      },
    ],
    contact: LIFE_KGROUP_EMAIL,
    next: "baptism",
    cta: { label: "Find a K-Group", href: "/contact" },
  },
  {
    slug: "baptism",
    title: "Baptism",
    shortTitle: "Baptism",
    badge: "Next step",
    href: "/life/baptism",
    card: "A public declaration that you identify with Jesus Christ’s death, burial and resurrection, walking in newness of life.",
    image: LIFE_BAPTISM_IMAGE,
    imageAlt: "Calm water, a picture of baptism and new life in Christ",
    tone: "cream",
    layout: "photo",
    icon: "droplets",
    intro:
      "Baptism is a public declaration a person makes to identify with Jesus Christ’s death, burial and resurrection. While baptism doesn’t grant you salvation, that comes by faith alone. Jesus commanded believers to get baptised.",
    quote: {
      text: "Or do you not know that as many of us as were baptised into Christ Jesus were baptised into His death? Therefore we were buried with Him through baptism into death, that just as Christ was raised from the dead by the glory of the Father, even so we also should walk in newness of life.",
      source: "Romans 6:3-4",
    },
    sections: [
      {
        title: "Jesus commanded believers to get baptised",
        body: "Salvation is God’s free gift, received by faith. Baptism is the next step of obedience. In Matthew 28:19, Jesus says: Go therefore and make disciples of all the nations, baptising them in the name of the Father and of the Son and of the Holy Spirit.",
      },
      {
        title: "Baptism classes",
        body: "To get baptised, contact your local branch. Before your baptism, you’ll have the opportunity to learn more through our baptism classes. You can also listen to Pastor David’s teaching, Baptism: Newness of Life in Christ.",
      },
    ],
    next: "fasting",
    cta: { label: "Speak to your branch", href: "/contact" },
  },
  {
    slug: "fasting",
    title: "Fasting",
    shortTitle: "Fasting",
    badge: "Prayer",
    href: "/life/fasting",
    card: "We abstain from food to signal dependence on God, fasting joined with prayer, as a church family seeking His purpose.",
    image: "/images/pastor-stage.jpg",
    imageAlt: "Seeking God together in worship",
    tone: "gold",
    layout: "text",
    icon: "flame",
    intro:
      "When believers fast, they abstain from food to signal dependence on God. Instead of relying on food to sustain us, we turn our focus to God and rely on Him for strength and also to entreat Him for spiritual matters. It adds power to our prayers. Fasting is always joined with prayer. Otherwise it’s just starvation.",
    quote: {
      text: "Moreover when ye fast, be not, as the hypocrites, of a sad countenance… But thou, when thou fastest, anoint thine head, and wash thy face.",
      source: "Matthew 6:16-17",
    },
    sections: [
      {
        title: "Fasting teaches us spiritual discipline",
        body: "Many great people in the Bible fasted and saw God move in miraculous ways among them, from Daniel to Esther to Paul and even Jesus. As a church family we also set aside special times, such as our corporate fasting and prayer, to humble ourselves, renew our hearts, and align with His purpose.",
      },
      {
        title: "Fasting is part of our walk with God",
        body: "Jesus said to the disciples in Matthew 6:16: “When you fast…”. This implies that as believers, fasting is a part of our walk with God. If you sincerely humble yourself before God, repent, pray and meditate on His Word, you’ll experience a heightened awareness of His presence. You’ll feel mentally, spiritually and physically refreshed.",
      },
      {
        title: "Teachings from Pastor David",
        body: "To go deeper, listen to The Mystery of Fasting, Prayer and Obeying Divine Instructions During Fasting, and A Time for Fasting and Feasting, then join your local branch when we fast together.",
      },
    ],
    next: "marriage",
    cta: { label: "Join us in prayer", href: "/events" },
  },
  {
    slug: "marriage",
    title: "Marriage",
    shortTitle: "Marriage",
    badge: "Family",
    href: "/life/marriage",
    card: "We celebrate marriage because God created it: preparation, counselling, and a victorious Christian home.",
    image: "/images/testimony-2.jpg",
    imageAlt: "Joy in the Kharis family",
    tone: "cream",
    layout: "text",
    icon: "heart",
    intro:
      "We celebrate marriage at Kharis, because it’s created by God. We see marriage at the beginning of the Bible in Genesis 2:24, and the Bible will end with marriage. Before making a commitment it is sensible for couples to discover each other at a deeper level and learn how best to keep their relationship strong.",
    quote: {
      text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.",
      source: "Genesis 2:24",
    },
    sections: [
      {
        title: "Eden School of Marriage",
        body: "The Eden School of Marriage focuses on the fundamental areas that help couples prepare for a successful and victorious Christian marriage, a mix of in-person and online sessions.",
        items: [
          "Foundations of Christian marriage",
          "Love and communication",
          "Money and marriage",
          "Duties of a husband and wife",
          "Fighting fair: resolving conflict",
          "The origin of sex",
        ],
      },
      {
        title: "Pre-marital counselling",
        body: "Pre-marital counselling helps couples align with God’s idea of marriage. Couples complete a form independently; a trained Kharis marriage counsellor is then allocated. Sessions typically range from 6–8 and cover the biblical purpose of marriage, roles, communication, finances, sexuality, and family history. Speak to your local branch to begin.",
      },
    ],
    next: "children",
    cta: { label: "Talk to your branch", href: "/contact" },
  },
  {
    slug: "children",
    title: "Children’s department",
    shortTitle: "Children",
    badge: "Kids",
    href: "/life/children",
    card: "Fun, vibrant, and full of life. We partner with parents to help children discover who God is through Bible teaching, worship, and friendship.",
    image: "/images/young-adults.jpg",
    imageAlt: "Young people growing up in the Kharis family",
    tone: "gold",
    layout: "blend",
    icon: "sparkles",
    intro:
      "Building the spiritual lives of the children to shape their future and beyond. We partner with parents to develop children in the way of the Lord. Fun activities, vibrant and powerful messages, and praise and worship help the children to learn and grow. We are seeking revival and equipping our children to carry the torch.",
    sections: [
      {
        title: "Kinder (3–6 years)",
        body: "Kinder is an energetic group of young children aged 3–6 years. A place where children discover the foundational principles of building a personal relationship with God through age-appropriate Bible stories, activities, worship, prayer and building relationships with one another. Our aim is for the children to develop a love and boldness in Jesus so that when they reach the age of awareness they will choose Him for themselves.",
      },
      {
        title: "Super (7–11 years)",
        body: "Super is a vibrant group of young children. We focus on establishing the foundation of their Christian walk through fundamental topics such as salvation, faith and the Holy Spirit. Our aim is to begin a fruitful journey in getting to know Christ.",
      },
      {
        title: "Transition (12–16 years)",
        body: "Transition is an exciting and engaging class designed to support spiritual growth and a smooth assimilation into the wider church, through fun, interactive lessons based on the teachings from Pastor David Antwi.",
      },
    ],
    next: "departments",
    cta: { label: "Bring the family", href: "/#near-you" },
  },
  {
    slug: "departments",
    title: "Departments",
    shortTitle: "Departments",
    badge: "Serve",
    href: LIFE_DEPARTMENTS_URL,
    card: "Serving is part of our worship. From ushers to music to hospitality, every believer has a role in God’s house.",
    image: LIFE_SERVE_IMAGE,
    imageAlt: "Serving together at Kharis",
    tone: "cream",
    layout: "photo",
    icon: "layout",
    intro:
      "There are many ways to serve in God’s House. Serving in church is part of our worship to God. From sanctuary keepers to ushers to children’s teachers, every believer has a role to play. Joining a department also helps you grow as a believer and live out what the New Testament describes as the “one another” life.",
    sections: [
      {
        title: "A snapshot of Kharis departments",
        body: "Contact your local branch to find out how you can join. Here’s a taste of the teams that keep the house running:",
        items: [
          "Administration: office, records, and events including baptism, baby naming and dedication",
          "Children’s department: teaching ages 3–16 in a fun, creative way",
          "Music: instrumentalists, song selection, and sound liaison as an act of service to God",
          "Ushers & Host team: the Kharis welcome, from the door to the seat",
          "Hospitality & Welfare: care for visitors, members, and those in need",
          "Evangelism & Follow up: preaching Christ and establishing new people in the family",
          "Production, Sound & Social media: sharing the Word with the world",
          "Sanctuary keepers, Set-up, Design, Drama, First Aid, Uniform, New believers",
        ],
      },
      {
        title: "Why we serve",
        body: "The Kharis we see equips, enables, empowers and releases ordinary people to live extraordinary lives, helping them discover the gifts and talents God gave them. Get in touch with your local branch to join a department.",
      },
    ],
    cta: { label: "Get involved", href: LIFE_DEPARTMENTS_URL },
  },
] as const;

export const LIFE_PHOTO_CARDS = LIFE_CATEGORIES.filter((c) => c.layout === "photo");

export function lifeBySlug(slug: string): LifeCategory | undefined {
  return LIFE_CATEGORIES.find((c) => c.slug === slug);
}

export const LIFE_SLUGS = LIFE_CATEGORIES.map((c) => c.slug);
