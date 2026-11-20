/**
 * Life at Kharis: the activities a visitor flies through on /life.
 *
 * Both halves of it. The seminars, the sports day and the cook along sit in
 * the same list as baptism, fasting and serving in a department, because
 * discipleship here is holistic: it is one life, not a social programme on
 * one side and a spiritual one on the other. A visitor should not be able to
 * tell where one stops and the other starts, and the tunnel should not sort
 * them.
 *
 * These are evergreen. They describe the rhythm of the church rather than a
 * calendar, so nothing here carries a date and nothing goes stale. If a
 * thing is genuinely one-off, it does not belong in this list.
 *
 * ADDING, REMOVING AND SEASONS
 * ----------------------------
 * The tunnel renders whatever `activeLifeActivities()` returns, in order, so
 * adding an activity is one entry here. Seasonal ones carry a `season` and
 * come out of the list by setting it to false in SEASONS below, without
 * touching the entry itself - a Christmas activity can sit here all year and
 * only surface when it is switched on.
 *
 * MEDIA
 * -----
 * `image` is the photograph on the tunnel wall and at the top of the detail
 * panel. `video` is optional: this tunnel is DOM rather than WebGL, so a
 * clip is simply another element on the wall, muted and looping. `gallery`
 * is the extra photographs shown in the panel.
 *
 * Per AGENTS.md every published picture must be an https://images.kharis.org
 * URL uploaded to the R2 bucket, with its mapping recorded in
 * site-image-urls.json. Entries below still carrying a `placeholder: true`
 * flag are pointing at an existing site photograph as a stand-in and are
 * waiting on the real one.
 */

import { LIFE_BAPTISM_IMAGE, LIFE_CHILDREN_IMAGE, LIFE_SERVE_IMAGE } from "@/lib/life-content";

export type LifeActivitySlug =
  | "singles-seminar"
  | "finance-seminar"
  | "cook-along"
  | "careers-fair"
  | "ai-in-the-workplace"
  | "health-seminar"
  | "innovation-project"
  | "sports-day"
  | "football-tournament"
  | "let-the-bible-speak-conference"
  | "jesus-campaign"
  | "christmas-jumper"
  | "k-group"
  | "baptism"
  | "fasting"
  | "marriage"
  | "children"
  | "departments";

/** Seasons an activity can belong to. Flip one off and it leaves the tunnel. */
export type LifeSeason = "christmas";

export const SEASONS: Record<LifeSeason, boolean> = {
  christmas: false,
};

export type LifeActivity = {
  slug: LifeActivitySlug;
  /** Shown on the tunnel wall and as the panel heading. */
  title: string;
  /** One line, read under the title. What it actually is. */
  blurb: string;
  /** Two or three sentences in the panel. Written as the church, not as copy. */
  body: string;
  /** The rhythm, in words rather than dates: "Every spring", "Twice a year". */
  cadence: string;
  /** Who it is for, in the visitor's words. */
  audience: string;
  /** The tunnel wall photograph. */
  image: string;
  alt: string;
  /** Optional clip, played muted and looping on the wall. */
  video?: string;
  /** Extra photographs for the panel. */
  gallery?: { src: string; alt: string }[];
  /** Where "I want in" goes. Defaults to the contact page. */
  href?: string;
  /** Present only while the entry is using a stand-in photograph. */
  placeholder?: true;
  season?: LifeSeason;
};

/**
 * Stand-in photography, so the experience can be judged with real pictures
 * of real Kharis people while the activity shoots are in progress. Every entry
 * using one of these is flagged `placeholder: true`; search that flag to
 * find everything still waiting on its own photograph.
 */
const STANDIN = {
  congregation:
    "https://images.kharis.org/site-images/main/e9df39abff1c7e6d/hero/sunday-service-stage.jpg",
  worship: "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
  bibles:
    "https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg",
  preaching:
    "https://images.kharis.org/site-images/main/b8180db67daeb332/hero/preaching-open-bible.jpg",
  celebration:
    "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
  outreachStreet:
    "https://images.kharis.org/site-images/main/5bbfb2fff5c0fc8c/hero/outreach-street.jpg",
  outreachCommunity:
    "https://images.kharis.org/site-images/main/ca959585decb8ff4/hero/outreach-community.jpg",
  bibleRaised:
    "https://images.kharis.org/site-images/main/0698b74918b21fe0/hero/sunday-bible-raised.jpg",
  pastor:
    "https://images.kharis.org/site-images/main/aee6ab0aae266c72/hero/easter-pastor-david.jpg",
  serve: "https://images.kharis.org/site-images/main/8440a4a63e4ae020/serve-with-us.jpg",
} as const;

export const LIFE_ACTIVITIES: LifeActivity[] = [
  {
    slug: "singles-seminar",
    title: "Singles' Seminar",
    blurb: "Honest conversation about singleness, dating and waiting well.",
    body: "A room where the questions people usually only ask their closest friends get asked out loud. Teaching, a panel, and time to talk - about identity, relationships, loneliness and what it means to live whole while you wait.",
    cadence: "A few times a year",
    audience: "Anyone single, at any age",
    image: STANDIN.congregation,
    alt: "Members at a Kharis seminar",
    placeholder: true,
  },
  {
    slug: "finance-seminar",
    title: "Finance Seminar",
    blurb: "Practical money teaching, with no shame attached.",
    body: "Budgeting, debt, saving, giving and the long game - taught plainly by people who do it for a living. We think a church should be a place you can admit you are struggling with money and leave with a plan.",
    cadence: "Yearly",
    audience: "Anyone, whatever your starting point",
    image: STANDIN.preaching,
    alt: "Teaching from the stage at Kharis",
    placeholder: true,
  },
  {
    slug: "cook-along",
    title: "Cook Along",
    blurb: "Everyone cooking the same thing, badly, together.",
    body: "One recipe, a lot of kitchens, and a call where nobody is pretending to be a chef. It started as a way to stay close when we could not be in a room together, and it stayed because it turns out eating the same meal is a good reason to talk.",
    cadence: "Through the year",
    audience: "Families, flatmates, anyone with a hob",
    image: STANDIN.outreachCommunity,
    alt: "The Kharis community together",
    placeholder: true,
  },
  {
    slug: "careers-fair",
    title: "Careers Fair",
    blurb: "The room where someone in the church already has your answer.",
    body: "People from across the congregation set up and talk about what they actually do - the route in, the pay, the parts nobody advertises. CV help, mock interviews, and introductions that have genuinely ended in jobs.",
    cadence: "Yearly",
    audience: "Students, career changers, anyone stuck",
    image: STANDIN.celebration,
    alt: "Kharis members celebrating together",
    placeholder: true,
  },
  {
    slug: "ai-in-the-workplace",
    title: "AI in the Workplace",
    blurb: "What it is, what it is doing to your job, and what to do about it.",
    body: "A straight session on how these tools are landing in real industries, run by people using them at work. Less hype than you get online, more about what to learn next and what is worth worrying about.",
    cadence: "As the ground shifts",
    audience: "Anyone whose work is changing",
    image: STANDIN.bibles,
    alt: "Kharis members worshipping together",
    placeholder: true,
  },
  {
    slug: "health-seminar",
    title: "Health Seminar",
    blurb: "Bodies matter. We talk about them properly.",
    body: "Doctors, nurses and physios from the congregation on the things people quietly put off - blood pressure, sleep, mental health, the checks that matter at your age. Direct, practical, and not a sales pitch.",
    cadence: "Yearly",
    audience: "Everyone, especially the ones avoiding it",
    image: STANDIN.worship,
    alt: "Members worshipping at Kharis",
    placeholder: true,
  },
  {
    slug: "innovation-project",
    title: "Innovation Project",
    blurb: "Our team at Barclays, building something real.",
    body: "Members of the church took an innovation project into Barclays for Transition - real brief, real stakes, real deadline. It is the sort of thing we want to keep making room for: faith that shows up in the work, not only on a Sunday.",
    cadence: "When the right brief comes",
    audience: "Builders, designers, analysts",
    image: STANDIN.pastor,
    alt: "Kharis members at a church event",
    placeholder: true,
  },
  {
    slug: "sports-day",
    title: "Sports Day",
    blurb: "Church, but with a whistle and far too much shouting.",
    body: "Races, relays, egg and spoon, and adults taking the tug of war much too seriously. One of the few days where the whole church - every age, every branch - ends up on the same field.",
    cadence: "Every summer",
    audience: "All ages, all abilities",
    image: STANDIN.outreachCommunity,
    alt: "The Kharis community outdoors together",
    placeholder: true,
  },
  {
    slug: "football-tournament",
    title: "Football Tournament",
    blurb: "Branch against branch. Bragging rights for a year.",
    body: "A proper tournament - groups, knockouts, a trophy that gets talked about until the next one. It is the quickest way we know to turn people from different branches into people who know each other's names.",
    cadence: "Every summer",
    audience: "Players and the crowd on the touchline",
    image: STANDIN.outreachStreet,
    alt: "Kharis members out together in the community",
    placeholder: true,
  },
  {
    slug: "let-the-bible-speak-conference",
    title: "Let the Bible Speak Conference",
    blurb: "Days of teaching that put Scripture back at the centre.",
    body: "A conference built around the Word being allowed to say what it says. Sustained teaching rather than a single sermon, for anyone who wants to move past Sunday depth and learn to read Scripture for themselves.",
    cadence: "Yearly",
    audience: "Anyone ready to go deeper",
    image: STANDIN.bibleRaised,
    alt: "A worshipper raising her Bible at a Kharis service",
    placeholder: true,
  },
  {
    slug: "jesus-campaign",
    title: "Jesus Campaign",
    blurb: "Taking it outside - streets, campuses, doorsteps.",
    body: "A concentrated push out into the community: teams on the streets, conversations with strangers, prayer with anyone who wants it. It is the part of our life that is least comfortable and most talked about afterwards.",
    cadence: "Every year",
    audience: "Anyone willing to come along",
    image: STANDIN.outreachStreet,
    alt: "The Kharis outreach team sharing the gospel on the street",
    placeholder: true,
  },
  {
    slug: "christmas-jumper",
    title: "Christmas Jumper Service",
    blurb: "The worst jumpers you own, strongly encouraged.",
    body: "A Sunday where the dress code collapses entirely and the hall fills with reindeer, tinsel and at least one jumper with working lights. Christmas at Kharis, done without an ounce of self-consciousness.",
    cadence: "Every December",
    audience: "Everyone, jumper mandatory",
    image: STANDIN.serve,
    alt: "Kharis members together",
    season: "christmas",
    placeholder: true,
  },
  {
    slug: "k-group",
    title: "K-Group",
    blurb: "Small home fellowships, growing larger and smaller at once.",
    body: "Small home fellowships where we discuss the Word, pray, and care for one another. It is where a big church becomes a room of people who know your name.",
    cadence: "Weekly",
    audience: "Everyone, wherever you live",
    image: "https://images.kharis.org/site-images/main/571e499ea60fdffc/branch-slide-1.jpg",
    alt: "A full Kharis hall listening to the Word",
  },
  {
    slug: "baptism",
    title: "Baptism",
    blurb: "A public declaration that you belong to Jesus.",
    body: "A public declaration that you identify with Jesus Christ’s death, burial and resurrection, walking in newness of life. Classes run beforehand so nobody goes into the water unsure of what it means.",
    cadence: "Through the year",
    audience: "Anyone ready to take the step",
    image: LIFE_BAPTISM_IMAGE,
    alt: "A Kharis baptism candidate emerging from the water with hands raised",
  },
  {
    slug: "fasting",
    title: "Fasting",
    blurb: "Abstaining together, to say we depend on God.",
    body: "We abstain from food to signal dependence on God, fasting joined with prayer, as a church family seeking His purpose. Done together rather than alone, which is most of what makes it possible.",
    cadence: "Several times a year",
    audience: "The whole church",
    image: "https://images.kharis.org/site-images/main/ffbe5aca25d25b8c/pastor-stage.jpg",
    alt: "Seeking God together in worship",
  },
  {
    slug: "departments",
    title: "Departments",
    blurb: "Serving is part of our worship.",
    body: "From ushers to music to hospitality, every believer has a role in God’s house. Most people find their closest friendships here rather than in a seat.",
    cadence: "Every week",
    audience: "Anyone willing to serve",
    image: LIFE_SERVE_IMAGE,
    alt: "Serving together at Kharis",
  },
  {
    slug: "children",
    title: "Children’s Department",
    blurb: "Fun, vibrant, and full of life.",
    body: "We partner with parents to help children discover who God is through Bible teaching, worship and friendship, in groups from three years old up to sixteen.",
    cadence: "Every Sunday",
    audience: "Ages 3 to 16, and their parents",
    image: LIFE_CHILDREN_IMAGE,
    alt: "Illustration of a teacher sharing a Bible story with children",
  },
  {
    slug: "marriage",
    title: "Marriage",
    blurb: "We celebrate marriage because God created it.",
    body: "Preparation, counselling and the building of a victorious Christian home. The Eden School of Marriage and pre-marital counselling sit behind this, for couples at either end of the journey.",
    cadence: "Through the year",
    audience: "Couples, and those preparing",
    image: "https://images.kharis.org/site-images/main/15638c2668f428de/testimony-2.jpg",
    alt: "Joy in the Kharis family",
  },
];

/** The activities currently in season, in the order they are listed above. */
export function activeLifeActivities(
  seasons: Record<LifeSeason, boolean> = SEASONS,
): LifeActivity[] {
  return LIFE_ACTIVITIES.filter((a) => !a.season || seasons[a.season]);
}

export function lifeActivityBySlug(slug: string): LifeActivity | undefined {
  return LIFE_ACTIVITIES.find((a) => a.slug === slug);
}
