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
 * An activity waiting on real content - not seasonal, just not ready - carries
 * `hidden: true` instead. The copy stays here so it is one flag away from
 * coming back, rather than being rewritten from scratch later.
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

import { LIFE_BAPTISM_IMAGE, LIFE_CHILDREN_IMAGE } from "@/lib/life-content";

export type LifeActivitySlug =
  | "singles-seminar"
  | "seminars"
  | "cook-along"
  | "careers-fair"
  | "ai-in-the-workplace"
  | "innovation-project"
  | "sports-day"
  | "football-tournament"
  | "family-fun-day"
  | "let-the-bible-speak-conference"
  | "jesus-campaign"
  | "christmas-jumper"
  | "k-group"
  | "baptism"
  | "fasting"
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
  /** Kept in the list but left out of `activeLifeActivities()` - no real content yet. */
  hidden?: true;
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
    title: "Singles' Ball",
    blurb: "Honest conversations about singleness, dating and waiting well.",
    body: "A room where the questions people usually only ask their closest friends get asked out loud. Teaching, a panel, and time to talk - about identity, relationships, loneliness and what it means to live whole while you wait.",
    cadence: "A few times a year",
    audience: "Anyone single, at any age",
    image:
      "https://images.kharis.org/site-images/main/46081a409e0e1fd1/life-picks/singles-seminar/00-main-portrait.jpg",
    alt: "A couple at the Singles' Ball photo booth",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/d5de8e5ea8d6136d/life-picks/singles-seminar/01-friends.jpg",
        alt: "Friends laughing together at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/2f8106a9bc9a96f1/life-picks/singles-seminar/02-dance.jpg",
        alt: "Dancing on the floor at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/6f0894034c89d135/life-picks/singles-seminar/03-dessert-1.jpg",
        alt: "Dessert served at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/a006c8c2d13d3911/life-picks/singles-seminar/04-arrival.jpg",
        alt: "A warm welcome on arrival at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/649556a0ae38406f/life-picks/singles-seminar/05-group-women.jpg",
        alt: "A group of singles together at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/4f93d727f341e3c8/life-picks/singles-seminar/06-interacting.jpg",
        alt: "Singles chatting over drinks at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/7cd6b6b166e6be55/life-picks/singles-seminar/07-selfie-table.jpg",
        alt: "A selfie around the table at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/e1d582f9728b24fc/life-picks/singles-seminar/08-singer.jpg",
        alt: "A singer performing on stage at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/dc09cccccec8d86f/life-picks/singles-seminar/09-fashion-moment.jpg",
        alt: "Singles taking part in an activity on the floor at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/35e5d4e9b12adf68/life-picks/singles-seminar/10-booth-women.jpg",
        alt: "Friends in the photo booth at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/bb5ae635b74b233f/life-picks/singles-seminar/11-booth-men.jpg",
        alt: "Friends in the photo booth at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/b7336d41e2555528/life-picks/singles-seminar/12-crowd.jpg",
        alt: "The room full of singles at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/e5a31cc240782f3f/life-picks/singles-seminar/13-dessert-2.jpg",
        alt: "Another dessert served at the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/83ee08602a84fb40/life-picks/singles-seminar/14-table-setting.jpg",
        alt: "A table set for the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/13a2b032e41d95fc/life-picks/singles-seminar/15-venue.jpg",
        alt: "The ballroom set up for the Singles' Ball",
      },
      {
        src: "https://images.kharis.org/site-images/main/2484f91ff08d994e/life-picks/singles-seminar/16-booth-women-2.jpg",
        alt: "More friends in the photo booth at the Singles' Ball",
      },
    ],
  },
  {
    slug: "seminars",
    title: "Seminars",
    blurb: "Practical teaching on the things we don't talk about enough.",
    body: "Standalone sessions on the parts of life a sermon doesn't usually cover - budgeting, debt and saving one seminar, blood pressure, sleep and mental health the next, taught plainly by people in the congregation who do it, or deal with it, for a living. It ranges from finance to health and beyond, but the aim is always the same: leave with something you can actually use.",
    cadence: "A few times a year",
    audience: "Anyone, whatever you're putting off",
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
    hidden: true,
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
    hidden: true,
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
    hidden: true,
  },
  {
    slug: "innovation-project",
    title: "Innovation Project",
    blurb: "Empowering leaders of tomorrow to build the future through faith.",
    body: "Members of the church took an innovation project into Barclays for Transition - real brief, real stakes, real deadline. It is the sort of thing we want to keep making room for: faith that shows up in the work, not only on a Sunday.",
    cadence: "When the right brief comes",
    audience: "Builders, designers, analysts",
    image:
      "https://images.kharis.org/site-images/main/15b6069f2c123a2d/life-picks/innovation-project/04-card-tower.jpg",
    alt: "Students building a card tower together during a team exercise",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/618d492c54b5ca18/life-picks/innovation-project/00-main-pitch.jpg",
        alt: "Young people presenting their pitch, HomeLink, on stage at Barclays",
      },
      {
        src: "https://images.kharis.org/site-images/main/12674f47125bccf9/life-picks/innovation-project/01-group.jpg",
        alt: "The Innovation Challenge cohort with their completion certificates at Barclays",
      },
      {
        src: "https://images.kharis.org/site-images/main/0e8f625d864e8e5a/life-picks/innovation-project/02-mentoring-chat.jpg",
        alt: "A mentor chatting with a student during the Innovation Challenge",
      },
      {
        src: "https://images.kharis.org/site-images/main/1593e1c926aecea3/life-picks/innovation-project/03-mentor-hug.jpg",
        alt: "A mentor and student embracing during the Innovation Challenge",
      },
      {
        src: "https://images.kharis.org/site-images/main/24373420e731c103/life-picks/innovation-project/05-speaking.jpg",
        alt: "A student speaking into a microphone during a team exercise",
      },
      {
        src: "https://images.kharis.org/site-images/main/a4cfb1373d47c3b6/life-picks/innovation-project/06-gift.jpg",
        alt: "The Kharis Careers Innovation Challenge notebook and pen",
      },
      {
        src: "https://images.kharis.org/site-images/main/67a9b7e890704f00/life-picks/innovation-project/07-flipchart-poverty.jpg",
        alt: "Students working through their research on a flipchart",
      },
      {
        src: "https://images.kharis.org/site-images/main/c51ab2084977b207/life-picks/innovation-project/08-flipchart-fastfashion.jpg",
        alt: "A student mapping out their project idea on a flipchart",
      },
      {
        src: "https://images.kharis.org/site-images/main/4ea607f22d582513/life-picks/innovation-project/09-flipchart-sustainability.jpg",
        alt: "A student presenting their idea to the group on a flipchart",
      },
      {
        src: "https://images.kharis.org/site-images/main/5d2c5c312b8ffc37/life-picks/innovation-project/10-peace-sign.jpg",
        alt: "Two students smiling together during the Innovation Challenge",
      },
      {
        src: "https://images.kharis.org/site-images/main/22bb5072100697c2/life-picks/innovation-project/11-portrait.jpg",
        alt: "A student at the Innovation Challenge",
      },
      {
        src: "https://images.kharis.org/site-images/main/9c7619a414a8876e/life-picks/innovation-project/12-judges-notes.jpg",
        alt: "Mentors and judges taking notes during the student pitches",
      },
    ],
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
    hidden: true,
  },
  {
    slug: "football-tournament",
    title: "Football Tournament",
    blurb: "Branch against branch. Bragging rights for a year.",
    body: "A proper tournament - groups, knockouts, a trophy that gets talked about until the next one. It is the quickest way we know to turn people from different branches into people who know each other's names.",
    cadence: "Every summer",
    audience: "Players and the crowd on the touchline",
    image:
      "https://images.kharis.org/site-images/main/4bee94a5aa2e8d42/life-picks/football-tournament/00-main-trophy.jpg",
    alt: "The winning team lifting the Kharis Cup",
    video: "https://images.kharis.org/site-videos/main/FOOTBALL%202%20-%20Trim.mp4",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/1c6c077e5f63fe91/life-picks/football-tournament/01-duel.jpg",
        alt: "Two players challenging for the ball in front of a watching crowd",
      },
      {
        src: "https://images.kharis.org/site-images/main/57fbd83216369731/life-picks/football-tournament/02-sideline.jpg",
        alt: "A coach talking a player through the game, ball in hand",
      },
      {
        src: "https://images.kharis.org/site-images/main/0cd65e1304601281/life-picks/football-tournament/03-crowd.jpg",
        alt: "Supporters cheering from the touchline",
      },
      {
        src: "https://images.kharis.org/site-images/main/b504014891b77b77/life-picks/football-tournament/04-action.jpg",
        alt: "Players battling for the ball in front of goal",
      },
      {
        src: "https://images.kharis.org/site-images/main/5a3ac5204f415560/life-picks/football-tournament/05-mc.jpg",
        alt: "The host addressing the crowd on the pitch",
      },
      {
        src: "https://images.kharis.org/site-images/main/3921fff2a571ecd9/life-picks/football-tournament/06-shot.jpg",
        alt: "A player striking a shot at goal",
      },
      {
        src: "https://images.kharis.org/site-images/main/85a8b96f20e05378/life-picks/football-tournament/07-lifted-up.jpg",
        alt: "A player lifted up by teammates in celebration",
      },
      {
        src: "https://images.kharis.org/site-images/main/5e8e8b2bae4c8045/life-picks/football-tournament/08-team-blue.jpg",
        alt: "A team photo together on the pitch",
      },
      {
        src: "https://images.kharis.org/site-images/main/568cca7442c08e7f/life-picks/football-tournament/09-yellow-card.jpg",
        alt: "The referee showing a yellow card",
      },
      {
        src: "https://images.kharis.org/site-images/main/7e5a9c8911b046dd/life-picks/football-tournament/10-celebration-run.jpg",
        alt: "A player celebrating after scoring",
      },
      {
        src: "https://images.kharis.org/site-images/main/85c1f1c251b91f1c/life-picks/football-tournament/11-commentary.jpg",
        alt: "Commentators calling the match pitch-side",
      },
      {
        src: "https://images.kharis.org/site-images/main/66963036c51759b8/life-picks/football-tournament/12-save.jpg",
        alt: "A goalkeeper diving to make a save",
      },
      {
        src: "https://images.kharis.org/site-images/main/65ddaa4b201c09d3/life-picks/football-tournament/13-trophy-presentation.jpg",
        alt: "The crowd cheering as the trophy is presented",
      },
      {
        src: "https://images.kharis.org/site-images/main/7aa34d72065cad1b/life-picks/football-tournament/14-team-red-selfie.jpg",
        alt: "A team taking a group selfie in celebration",
      },
      {
        src: "https://images.kharis.org/site-images/main/d7745b88edd75ccd/life-picks/football-tournament/15-trophy-medals.jpg",
        alt: "Players with their medals around the Kharis Cup",
      },
      {
        src: "https://images.kharis.org/site-images/main/aafc76184d9be495/life-picks/football-tournament/16-trophy-group.jpg",
        alt: "The winning team celebrating together with the trophy",
      },
      {
        src: "https://images.kharis.org/site-images/main/f722bab5cf0a3e47/life-picks/football-tournament/17-arrival.jpg",
        alt: "Two players arriving at the tournament, ball in hand",
      },
      {
        src: "https://images.kharis.org/site-images/main/2652d2277b97d351/life-picks/football-tournament/18-friends.jpg",
        alt: "Two friends together at the tournament",
      },
      {
        src: "https://images.kharis.org/site-images/main/ef6c85b6563a830b/life-picks/football-tournament/19-warmup-stretch.jpg",
        alt: "Players stretching together before the match",
      },
      {
        src: "https://images.kharis.org/site-images/main/33635f1784b4bd2c/life-picks/football-tournament/20-warmup-run.jpg",
        alt: "Players warming up together on the pitch",
      },
      {
        src: "https://images.kharis.org/site-images/main/4b82373afb6528c8/life-picks/football-tournament/21-team-pdak.jpg",
        alt: "A team gathered together for a photo",
      },
      {
        src: "https://images.kharis.org/site-images/main/c46fd715a9e56114/life-picks/football-tournament/22-huddle-prayer.jpg",
        alt: "A team praying together before kick-off",
      },
      {
        src: "https://images.kharis.org/site-images/main/7888a91b134aae4a/life-picks/football-tournament/23-appeal.jpg",
        alt: "A player appealing from the ground during play",
      },
      {
        src: "https://images.kharis.org/site-images/main/975cfd0bac7be7d7/life-picks/football-tournament/24-ball-detail.jpg",
        alt: "A close view of the ball during play",
      },
      {
        src: "https://images.kharis.org/site-images/main/d8a56c7a05f025ec/life-picks/football-tournament/25-huddle-prayer-2.jpg",
        alt: "Another team praying together before kick-off",
      },
      {
        src: "https://images.kharis.org/site-images/main/24412d7baed464e7/life-picks/football-tournament/26-penalty.jpg",
        alt: "A player striking a penalty at goal",
      },
    ],
  },
  {
    slug: "family-fun-day",
    title: "Family Fun Day",
    blurb: "Fun for all, tug-of-war, sack races, musical chairs and more.",
    body: "One afternoon a year with no agenda beyond being glad to be in the same place - games, face painting, food and a trophy that gets taken far too seriously, for every age in one playground at once.",
    cadence: "Every summer",
    audience: "Every age, every family",
    image:
      "https://images.kharis.org/site-images/main/fd5267537b53300e/life-picks/family-fun-day/00-main-group.jpg",
    alt: "The whole church family together at Family Fun Day",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/4cb63cc342d44d4c/life-picks/family-fun-day/01-jenga.jpg",
        alt: "Friends playing giant Jenga together",
      },
      {
        src: "https://images.kharis.org/site-images/main/8c997a971d8f4b71/life-picks/family-fun-day/02-race.jpg",
        alt: "A race across the playground",
      },
      {
        src: "https://images.kharis.org/site-images/main/6498e5c06368eb24/life-picks/family-fun-day/03-table-tennis.jpg",
        alt: "Friends playing table tennis",
      },
      {
        src: "https://images.kharis.org/site-images/main/bb7eb611a3a4870d/life-picks/family-fun-day/04-dance.jpg",
        alt: "Families dancing together on the court",
      },
      {
        src: "https://images.kharis.org/site-images/main/262536b03042452d/life-picks/family-fun-day/05-hula-hoop.jpg",
        alt: "Children and parents hula hooping together",
      },
      {
        src: "https://images.kharis.org/site-images/main/32153f95b200ccb3/life-picks/family-fun-day/06-face-painting.jpg",
        alt: "A child having her face painted",
      },
      {
        src: "https://images.kharis.org/site-images/main/1dfd0822005cbd0e/life-picks/family-fun-day/07-candy-floss.jpg",
        alt: "Candy floss being made at the fair",
      },
      {
        src: "https://images.kharis.org/site-images/main/1098ac377fcf2301/life-picks/family-fun-day/08-bouncy-castle.jpg",
        alt: "Children playing on the bouncy castle",
      },
      {
        src: "https://images.kharis.org/site-images/main/026b9cce00162df0/life-picks/family-fun-day/09-sack-race-kids.jpg",
        alt: "Children in a sack race",
      },
      {
        src: "https://images.kharis.org/site-images/main/75064ed5ccbca267/life-picks/family-fun-day/10-sack-race-adults.jpg",
        alt: "Adults in a sack race",
      },
      {
        src: "https://images.kharis.org/site-images/main/f9556a2ed6a3ee5d/life-picks/family-fun-day/11-friends.jpg",
        alt: "Friends together at Family Fun Day",
      },
      {
        src: "https://images.kharis.org/site-images/main/8377686204236d2d/life-picks/family-fun-day/12-food.jpg",
        alt: "Sharing food together at Family Fun Day",
      },
      {
        src: "https://images.kharis.org/site-images/main/43146f4dec017465/life-picks/family-fun-day/13-conga.jpg",
        alt: "A conga line across the playground",
      },
      {
        src: "https://images.kharis.org/site-images/main/7d6c856f85329e55/life-picks/family-fun-day/14-musical-chairs.jpg",
        alt: "A game of musical chairs",
      },
      {
        src: "https://images.kharis.org/site-images/main/f03843d2d0b5d99d/life-picks/family-fun-day/15-tug-of-war-kids.jpg",
        alt: "A tug of war between two teams",
      },
      {
        src: "https://images.kharis.org/site-images/main/e2e6ebaad7c877bc/life-picks/family-fun-day/16-tug-of-war-teens.jpg",
        alt: "Young people in a tug of war",
      },
      {
        src: "https://images.kharis.org/site-images/main/dba8537b56308b6d/life-picks/family-fun-day/17-celebration-1.jpg",
        alt: "A joyful moment during the celebrations",
      },
      {
        src: "https://images.kharis.org/site-images/main/be25ad1594871313/life-picks/family-fun-day/18-celebration-2.jpg",
        alt: "The crowd dancing and celebrating together",
      },
      {
        src: "https://images.kharis.org/site-images/main/2e77bbfef0cc35b4/life-picks/family-fun-day/19-tug-of-war-women.jpg",
        alt: "Adults pulling together in a tug of war",
      },
      {
        src: "https://images.kharis.org/site-images/main/29b5e52e9022aa1c/life-picks/family-fun-day/20-tug-of-war-men.jpg",
        alt: "Men pulling together in a tug of war",
      },
      {
        src: "https://images.kharis.org/site-images/main/033df5e35b726e10/life-picks/family-fun-day/21-trophy.jpg",
        alt: "The Kharis Family & Friends Fun Day Champions trophy",
      },
    ],
  },
  {
    slug: "let-the-bible-speak-conference",
    title: "Let the Bible Speak Conference",
    blurb: "Open the book. Hear His voice.",
    body: "A conference built around the Word being allowed to say what it says. Sustained teaching rather than a single sermon, for anyone who wants to move past Sunday depth and learn to read Scripture for themselves.",
    cadence: "Yearly",
    audience: "Anyone ready to go deeper",
    image:
      "https://images.kharis.org/site-images/main/8c981a0c49fdc966/life-picks/let-the-bible-speak-conference/13-sola-scriptura-bible.jpg",
    alt: 'A leather Bible embossed "Sola Scriptura" held up on stage',
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/67a46f34494b763e/life-picks/let-the-bible-speak-conference/00-main-open-bible.jpg",
        alt: "An open Bible, turned to Genesis 4",
      },
      {
        src: "https://images.kharis.org/site-images/main/48c13b558056fe3d/life-picks/let-the-bible-speak-conference/01-packed-hall.jpg",
        alt: "The packed conference hall listening to the preacher on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/2870d7031a515637/life-picks/let-the-bible-speak-conference/02-scripture-on-screen.jpg",
        alt: "2 Timothy 3:15 displayed on the big screen above the seated delegates",
      },
      {
        src: "https://images.kharis.org/site-images/main/013a7f8eb198cb46/life-picks/let-the-bible-speak-conference/03-preaching-open-bible.jpg",
        alt: "A speaker preaching with an open Bible in hand",
      },
      {
        src: "https://images.kharis.org/site-images/main/c3c8df9a42fb2711/life-picks/let-the-bible-speak-conference/04-street-banners.jpg",
        alt: "Street banners for the conference's speakers outside the venue",
      },
      {
        src: "https://images.kharis.org/site-images/main/0ba04c272f02e78b/life-picks/let-the-bible-speak-conference/05-raised-bibles-reaching.jpg",
        alt: "Delegates reaching up with raised Bibles toward the stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/060809ad2cee71a2/life-picks/let-the-bible-speak-conference/06-crowd-cheering-bibles.jpg",
        alt: "The crowd cheering with Bibles held high",
      },
      {
        src: "https://images.kharis.org/site-images/main/6aa622f57e4aa378/life-picks/let-the-bible-speak-conference/07-young-man-raised-bible.jpg",
        alt: "A young delegate holding his Bible high overhead",
      },
      {
        src: "https://images.kharis.org/site-images/main/66b460fd7035683d/life-picks/let-the-bible-speak-conference/08-overwhelmed-in-worship.jpg",
        alt: "A worshipper overwhelmed with emotion, hand raised",
      },
      {
        src: "https://images.kharis.org/site-images/main/c093e5d8a6303f21/life-picks/let-the-bible-speak-conference/09-dancing-in-celebration.jpg",
        alt: "Delegates dancing and celebrating together in the hall",
      },
      {
        src: "https://images.kharis.org/site-images/main/53e10f89181cf0b4/life-picks/let-the-bible-speak-conference/10-worship-leader-singing.jpg",
        alt: "A worship leader singing under blue stage light",
      },
      {
        src: "https://images.kharis.org/site-images/main/0c8c7e0fc5cbd9ef/life-picks/let-the-bible-speak-conference/11-full-stage-worship.jpg",
        alt: "The full worship team leading the hall from the stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/f107d3fecea565f3/life-picks/let-the-bible-speak-conference/12-preacher-gesturing.jpg",
        alt: "A speaker preaching with an open Bible under dramatic stage light",
      },
      {
        src: "https://images.kharis.org/site-images/main/9f1ebbe3a52ac298/life-picks/let-the-bible-speak-conference/14-panel-discussion.jpg",
        alt: "A panel discussion on stage in front of the conference backdrop",
      },
      {
        src: "https://images.kharis.org/site-images/main/7389bd5bca97daea/life-picks/let-the-bible-speak-conference/15-kente-welcome-dancers.jpg",
        alt: "Traditional dancers in kente cloth welcoming the team to Ghana",
      },
      {
        src: "https://images.kharis.org/site-images/main/d208ce0d193056fe/life-picks/let-the-bible-speak-conference/16-street-skaters.jpg",
        alt: "Skaters in conference T-shirts taking the message onto the street",
      },
      {
        src: "https://images.kharis.org/site-images/main/07c358ba2796500c/life-picks/let-the-bible-speak-conference/17-speaker-on-stage.jpg",
        alt: "A speaker addressing the conference in front of the event backdrop",
      },
      {
        src: "https://images.kharis.org/site-images/main/dc4477e8fb14e998/life-picks/let-the-bible-speak-conference/18-departure-group-photo.jpg",
        alt: "The Let the Bible Speak Conference team posing together before departure, pointing to the sky",
      },
      {
        src: "https://images.kharis.org/site-images/main/d63192390ffa531f/life-picks/let-the-bible-speak-conference/19-sunglasses-trio.jpg",
        alt: "A team member wearing sunglasses with 'LTBS 2026' written on the lenses, flanked by two smiling colleagues",
      },
      {
        src: "https://images.kharis.org/site-images/main/13ca8a9d622ce4e4/life-picks/let-the-bible-speak-conference/20-departure-lounge-portrait.jpg",
        alt: "A team member smiling in the airport departure lounge, wearing a conference polo shirt",
      },
      {
        src: "https://images.kharis.org/site-images/main/5338f1e9431e6916/life-picks/let-the-bible-speak-conference/21-preaching-jesus-screen.jpg",
        alt: "A speaker preaching on stage in front of a large 'JESUS' graphic on the screen",
      },
      {
        src: "https://images.kharis.org/site-images/main/107ea3ed28032ab3/life-picks/let-the-bible-speak-conference/22-arrivals-corridor-ghana.jpg",
        alt: "The conference team walking through the arrivals corridor after landing in Ghana",
      },
      {
        src: "https://images.kharis.org/site-images/main/6b76bb51da6bfb00/life-picks/let-the-bible-speak-conference/23-reception-desk-banner.jpg",
        alt: "Two staff waving behind a reception desk next to the Let the Bible Speak Conference banner listing all four speakers",
      },
      {
        src: "https://images.kharis.org/site-images/main/4a7d66c80c32a8a0/life-picks/let-the-bible-speak-conference/24-welcome-to-ghana-banner.jpg",
        alt: "Supporters holding up a 'Welcome to Ghana' banner for Rev. Dr. David Antwi on his arrival",
      },
      {
        src: "https://images.kharis.org/site-images/main/744f414453d90375/life-picks/let-the-bible-speak-conference/25-crowd-cheering-flyers.jpg",
        alt: "A cheering crowd holding up conference flyers and wearing branded sunglasses",
      },
      {
        src: "https://images.kharis.org/site-images/main/b3cad6b76b796fe2/life-picks/let-the-bible-speak-conference/26-street-arrival-interview.jpg",
        alt: "A speaker giving an interview to reporters amid a crowd outside a shopping mall at night",
      },
      {
        src: "https://images.kharis.org/site-images/main/b4b0eb01f0f14b48/life-picks/let-the-bible-speak-conference/27-sunglasses-profile.jpg",
        alt: "A young delegate in branded sunglasses among the crowd, conference flyers visible nearby",
      },
      {
        src: "https://images.kharis.org/site-images/main/1fb46b12c76c6668/life-picks/let-the-bible-speak-conference/28-night-street-march.jpg",
        alt: "Delegates holding conference signs aloft as they walk together at night, under a highway flyover",
      },
      {
        src: "https://images.kharis.org/site-images/main/5c03011050e00ab9/life-picks/let-the-bible-speak-conference/29-worship-leader-hand-raised.jpg",
        alt: "A worship leader singing with one hand raised under blue stage light",
      },
      {
        src: "https://images.kharis.org/site-images/main/ae3c2a5ef8788c60/life-picks/let-the-bible-speak-conference/30-truck-skaters.jpg",
        alt: "Rollerblading promo team sitting atop the conference's branded street truck",
      },
      {
        src: "https://images.kharis.org/site-images/main/0fa58f4791c726f1/life-picks/let-the-bible-speak-conference/31-promo-truck-crowd.jpg",
        alt: "A crowd gathered on the conference's promotional truck, waving booklets and cheering",
      },
      {
        src: "https://images.kharis.org/site-images/main/48c13b558056fe3d/life-picks/let-the-bible-speak-conference/32-auditorium-wide-dignitaries.jpg",
        alt: "A wide view of the conference hall with dignitaries seated in front and a speaker addressing the crowd from the stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/6aa622f57e4aa378/life-picks/let-the-bible-speak-conference/33-auditorium-scripture-screen.jpg",
        alt: "The conference hall viewed from the back, with 2 Timothy 3:15 displayed on the stage screen",
      },
      {
        src: "https://images.kharis.org/site-images/main/228d8ea9cc84dad0/life-picks/let-the-bible-speak-conference/34-orange-bible-raised.jpg",
        alt: "A delegate holding an orange Bible high overhead",
      },
      {
        src: "https://images.kharis.org/site-images/main/7f9a525d3a8c06f2/life-picks/let-the-bible-speak-conference/35-laughing-at-phone.jpg",
        alt: "Delegates laughing together while looking at a phone at the airport",
      },
      {
        src: "https://images.kharis.org/site-images/main/64fc5f1cb48a82da/life-picks/let-the-bible-speak-conference/36-airport-selfie.jpg",
        alt: "Three delegates taking a selfie together at the airport, pointing and smiling",
      },
      {
        src: "https://images.kharis.org/site-images/main/e7a222e9fd46a420/life-picks/let-the-bible-speak-conference/37-promo-truck-street.jpg",
        alt: "The conference's branded promotional truck parked on the street, with the team loading sound equipment",
      },
      {
        src: "https://images.kharis.org/site-images/main/9b466d1d4cd617d8/life-picks/let-the-bible-speak-conference/38-flyers-fanned-out.jpg",
        alt: "A hand fanning out a stack of Let the Bible Speak Conference flyers featuring all four speakers",
      },
      {
        src: "https://images.kharis.org/site-images/main/15f3e7048967e330/life-picks/let-the-bible-speak-conference/39-tshirt-logo-closeup.jpg",
        alt: "Close-up of the 'Let the Bible Speak' conference t-shirt logo on a volunteer's back",
      },
      {
        src: "https://images.kharis.org/site-images/main/0a030c67eec931e7/life-picks/let-the-bible-speak-conference/40-speakers-panel-laughing.jpg",
        alt: "Speakers sharing a laugh together during a panel discussion on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/d1892d630e0469cc/life-picks/let-the-bible-speak-conference/41-worship-leader-passionate.jpg",
        alt: "A worship leader singing passionately with his hand raised, lit in blue stage light",
      },
      {
        src: "https://images.kharis.org/site-images/main/96113ece96a38858/life-picks/let-the-bible-speak-conference/42-backdrop-interview.jpg",
        alt: "Two attendees being interviewed in front of the conference's step-and-repeat backdrop",
      },
      {
        src: "https://images.kharis.org/site-images/main/dccd2e5ba96e0a80/life-picks/let-the-bible-speak-conference/43-worship-duet-passionate.jpg",
        alt: "Two worship leaders singing together, one with hand raised, under smoky blue stage light",
      },
      {
        src: "https://images.kharis.org/site-images/main/6a621d320400d364/life-picks/let-the-bible-speak-conference/44-bibles-raised-cheering-aisle.jpg",
        alt: "Delegates cheering with raised Bibles as a speaker walks down the aisle holding a red Bible",
      },
      {
        src: "https://images.kharis.org/site-images/main/5bffb2329f4fdd2c/life-picks/let-the-bible-speak-conference/45-street-banners-security.jpg",
        alt: "Street banner flags of the conference speakers lining the road outside the venue, with security on duty",
      },
      {
        src: "https://images.kharis.org/site-images/main/4ed95c000f332b18/life-picks/let-the-bible-speak-conference/46-outdoor-screen-mentorship-poster.jpg",
        alt: "An outdoor LED screen broadcasting the stage feed live next to a poster for the Special Mentorship Sessions",
      },
      {
        src: "https://images.kharis.org/site-images/main/587f1cfe228eab50/life-picks/let-the-bible-speak-conference/47-stage-backdrop-setup.jpg",
        alt: "The conference's main stage backdrop featuring Rev. Dr. David Antwi, being set up ahead of the event",
      },
      {
        src: "https://images.kharis.org/site-images/main/6b02e22bddccf7c0/life-picks/let-the-bible-speak-conference/48-full-stage-performance.jpg",
        alt: "The full worship team performing on stage in front of the crowd, with the conference logo on the screen behind them",
      },
    ],
  },
  {
    slug: "jesus-campaign",
    title: "Jesus Campaign",
    blurb: "The Great Commission in action: we preach Christ crucified.",
    body: "A concentrated push out into the community: teams on the streets, conversations with strangers, prayer with anyone who wants it. It is the part of our life that is least comfortable and most talked about afterwards.",
    cadence: "Every year",
    audience: "Anyone willing to come along",
    image:
      "https://images.kharis.org/site-images/main/1a7b7f7826638cf9/life-picks/jesus-campaign/02-no-jesus-no-life-shirt.jpg",
    alt: "A woman wearing a 'No Jesus No Life' t-shirt outside a cafe",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/af6114c87c7ccc08/life-picks/jesus-campaign/00-main-passionate-outreach.jpg",
        alt: "A Kharis member preaching passionately into a microphone, fist raised, wearing a 'My God Died For Me' campaign shirt",
      },
      {
        src: "https://images.kharis.org/site-images/main/965dea58655780bd/life-picks/jesus-campaign/01-street-conversation.jpg",
        alt: "A Kharis outreach team member in conversation with two people on the street",
      },
      {
        src: "https://images.kharis.org/site-images/main/f42578a2ea27500b/life-picks/jesus-campaign/03-bus-stop-conversation.jpg",
        alt: "Outreach team members talking with passers-by at a bus stop",
      },
      {
        src: "https://images.kharis.org/site-images/main/1ecc159356293775/life-picks/jesus-campaign/04-bench-conversation.jpg",
        alt: "Three men in conversation on a bench under a tree",
      },
      {
        src: "https://images.kharis.org/site-images/main/fb859f79c3d4ce3b/life-picks/jesus-campaign/05-group-worship-gathering.jpg",
        alt: "A large group of campaign volunteers gathered under a tree in matching John 3:16 jerseys, singing and praising",
      },
      {
        src: "https://images.kharis.org/site-images/main/fa1ef5cdde467963/life-picks/jesus-campaign/06-prayer-with-strangers.jpg",
        alt: "A volunteer praying with two women on the street, hands clasped together",
      },
      {
        src: "https://images.kharis.org/site-images/main/7f916299b98c8dbe/life-picks/jesus-campaign/07-underpass-conversation.jpg",
        alt: "A volunteer in a 'He Died I Lived' t-shirt sharing the gospel with a passer-by under a graffitied railway bridge",
      },
      {
        src: "https://images.kharis.org/site-images/main/5cae8f55b7a1763c/life-picks/jesus-campaign/08-mother-daughter-hug.jpg",
        alt: "A volunteer hugging a young girl, both wearing John 3:16 jerseys",
      },
      {
        src: "https://images.kharis.org/site-images/main/8a3f7381fb7a5888/life-picks/jesus-campaign/09-group-photo.jpg",
        alt: "The Jesus Campaign outreach team posing together in their campaign shirts",
      },
      {
        src: "https://images.kharis.org/site-images/main/340aa5c29826c430/life-picks/jesus-campaign/10-wheelchair-conversation.jpg",
        alt: "A volunteer crouching down to talk with a man in a wheelchair",
      },
      {
        src: "https://images.kharis.org/site-images/main/913afa5a001db19d/life-picks/jesus-campaign/11-prayer-huddle.jpg",
        alt: "A small group praying together in a huddle on the street",
      },
      {
        src: "https://images.kharis.org/site-images/main/c714a9464b65279d/life-picks/jesus-campaign/12-bike-celebration.jpg",
        alt: "A volunteer in a Kharis Phase 2 Peterborough hoodie cheering with a fist in the air while riding a hire bike",
      },
      {
        src: "https://images.kharis.org/site-images/main/7860fe3947c5103e/life-picks/jesus-campaign/13-park-conversation.jpg",
        alt: "Volunteers in conversation with a passer-by in a park, one wearing an 'I Speak Jesus' t-shirt",
      },
      {
        src: "https://images.kharis.org/site-images/main/d4a43b2ea2bb86d7/life-picks/jesus-campaign/14-street-conversation-women.jpg",
        alt: "Three women talking on the street, one wearing a 'Jesus Paid The Price' t-shirt",
      },
      {
        src: "https://images.kharis.org/site-images/main/38698af4162d2e1e/life-picks/jesus-campaign/15-fist-bump.jpg",
        alt: "Two volunteers sharing a fist bump and a laugh on the street",
      },
      {
        src: "https://images.kharis.org/site-images/main/1d4e462b2030cccb/life-picks/jesus-campaign/16-preaching-mic.jpg",
        alt: "A volunteer preaching into a microphone, wearing a 'Jesus Paid The Price' t-shirt",
      },
    ],
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
    image:
      "https://images.kharis.org/site-images/main/67587be47ceeb3bd/life-picks/k-group/02-living-room.jpg",
    alt: "A K-Group gathered around a living room, Bibles open",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/e3d93dee21bbad78/life-picks/k-group/01-conversation.jpg",
        alt: "Two K-Group members deep in conversation at a home fellowship",
      },
      {
        src: "https://images.kharis.org/site-images/main/ef81b7e09ac9af7d/life-picks/k-group/03-family-table.jpg",
        alt: "A family K-Group with children around the table, Bibles open",
      },
    ],
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
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/1bd318f907282361/life-picks/baptism/01-newness-of-life-tshirts.jpg",
        alt: "Two baptism candidates holding up their 'Newness of Life in Christ' t-shirts",
      },
      {
        src: "https://images.kharis.org/site-images/main/f8fd0dbfee7bffb1/life-picks/baptism/02-candidates-lined-up-poolside.jpg",
        alt: "Baptism candidates lined up poolside in prayer before going into the water",
      },
      {
        src: "https://images.kharis.org/site-images/main/e86b43f79e152614/life-picks/baptism/03-worship-before-the-water.jpg",
        alt: "A candidate with eyes closed and hands raised in worship before baptism",
      },
      {
        src: "https://images.kharis.org/site-images/main/349a9a7c729b5b5a/life-picks/baptism/04-raised-up-out-of-the-water.jpg",
        alt: "A woman raised up out of the water by two helpers either side of her",
      },
      {
        src: "https://images.kharis.org/site-images/main/9598bf69ee2e11c6/life-picks/baptism/05-men-celebrating-in-the-pool.jpg",
        alt: "Three men celebrating and laughing together in the baptism pool",
      },
      {
        src: "https://images.kharis.org/site-images/main/11b78c25fef288c7/life-picks/baptism/06-arms-raised-in-celebration.jpg",
        alt: "A newly baptised man shouting with arms raised in the water",
      },
      {
        src: "https://images.kharis.org/site-images/main/a58ea8bf731a6d7e/life-picks/baptism/07-three-men-hands-raised.jpg",
        alt: "Three men with hands raised, cheering in the baptism pool",
      },
      {
        src: "https://images.kharis.org/site-images/main/7ee08e2cf7b35e6a/life-picks/baptism/08-full-group-photo-outside.jpg",
        alt: "The full group of baptism candidates and helpers posing together outside",
      },
      {
        src: "https://images.kharis.org/site-images/main/0f3d5c57741744a1/life-picks/baptism/09-friends-celebrating-outside.jpg",
        alt: "Four friends celebrating together outside after the baptism service",
      },
    ],
  },
  {
    slug: "fasting",
    title: "Fasting",
    blurb: "Fasting together, seeking God’s agenda on earth.",
    body: "We abstain from food to signal dependence on God, fasting joined with prayer, as a church family seeking His purpose. Done together rather than alone, which is most of what makes it possible.",
    cadence: "Several times a year",
    audience: "The whole church",
    image:
      "https://images.kharis.org/site-images/main/bbe05e8d16aa55cc/life-picks/fasting/05-pastor-kneeling-passionate.jpg",
    alt: "A pastor kneeling on stage, crying out into the microphone",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/9f531452791f6c5c/life-picks/fasting/00-main-hands-raised-prayer.jpg",
        alt: "A worshipper, hands clasped above her head, moved to tears in prayer",
      },
      {
        src: "https://images.kharis.org/site-images/main/3ca65e0f86f1c2f8/life-picks/fasting/01-prayer.jpg",
        alt: "A worshipper in prayer during Prayer Fest",
      },
      {
        src: "https://images.kharis.org/site-images/main/c6d26bd4db049e2b/life-picks/fasting/02-tearful-prayer.jpg",
        alt: "A young woman in tears, hands clasped in prayer",
      },
      {
        src: "https://images.kharis.org/site-images/main/147b57347de9dd9c/life-picks/fasting/03-prayer-fest-crowd.jpg",
        alt: "A packed hall at Prayer Fest, hands raised and one man lying prostrate on the floor",
      },
      {
        src: "https://images.kharis.org/site-images/main/3334e18f48ae3ff0/life-picks/fasting/04-fervent-praise.jpg",
        alt: "Worshippers crying out with fists raised in fervent praise",
      },
      {
        src: "https://images.kharis.org/site-images/main/414d2eed19e87141/life-picks/fasting/06-joyful-worship-raised-hands.jpg",
        alt: "A worshipper smiling with hands raised",
      },
      {
        src: "https://images.kharis.org/site-images/main/0807240ed3439675/life-picks/fasting/07-worship-eyes-closed.jpg",
        alt: "A worshipper, eyes closed, lost in worship",
      },
      {
        src: "https://images.kharis.org/site-images/main/f59d0f5d096cee15/life-picks/fasting/08-young-man-worship.jpg",
        alt: "A young man worshipping with his hand raised",
      },
      {
        src: "https://images.kharis.org/site-images/main/2d807bf18debdb14/life-picks/fasting/09-embraced-in-worship.jpg",
        alt: "A worshipper embraced by a friend mid-worship",
      },
      {
        src: "https://images.kharis.org/site-images/main/c5af83ad88c45f90/life-picks/fasting/10-prostrate-on-open-bible.jpg",
        alt: "A young man face down in prayer over an open Bible",
      },
      {
        src: "https://images.kharis.org/site-images/main/88839764cefe0599/life-picks/fasting/11-worship-with-bible.jpg",
        alt: "A worshipper standing in prayer, Bible in hand",
      },
      {
        src: "https://images.kharis.org/site-images/main/df130ac8376e877d/life-picks/fasting/12-three-women-worshipping-together.jpg",
        alt: "Three women worshipping together, arm in arm",
      },
      {
        src: "https://images.kharis.org/site-images/main/b46b0be0c64d817e/life-picks/fasting/13-private-prayer-by-chair.jpg",
        alt: "A woman kneeling in quiet prayer beside her chair",
      },
      {
        src: "https://images.kharis.org/site-images/main/423f80133efadcb6/life-picks/fasting/14-group-praying-together.jpg",
        alt: "A group gathered in prayer over someone kneeling among them",
      },
      {
        src: "https://images.kharis.org/site-images/main/b1c654a6c0319637/life-picks/fasting/15-worship-cross-necklace.jpg",
        alt: "A worshipper, head back and eyes closed, a cross necklace at her neck",
      },
    ],
  },
  {
    slug: "departments",
    title: "Departments",
    blurb: "Serving is part of our worship.",
    body: "From ushers to music to hospitality, every believer has a role in God’s house. Most people find their closest friendships here rather than in a seat.",
    cadence: "Every week",
    audience: "Anyone willing to serve",
    image:
      "https://images.kharis.org/site-images/main/4a1bb718d732af9e/life-picks/departments/11-sound-engineer.jpg",
    alt: "A sound engineer smiling while working the mixing desk during a service",
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/7f57aa7edcc26557/life-picks/departments/01-led-wall.jpg",
        alt: "A member of the production team wiring up the stage LED wall",
      },
      {
        src: "https://images.kharis.org/site-images/main/ce4506c5208a3d77/life-picks/departments/02-drum-tech.jpg",
        alt: "A member of the music team setting up a microphone over the drum kit",
      },
      {
        src: "https://images.kharis.org/site-images/main/bce4860eb375858e/life-picks/departments/03-rigging.jpg",
        alt: "A member of the production team up a ladder rigging the stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/463852ab7fec4d1c/life-picks/departments/04-sound-desk.jpg",
        alt: "A member of the sound team at the mixing desk",
      },
      {
        src: "https://images.kharis.org/site-images/main/cc3e21bab82fec4f/life-picks/departments/05-bassist.jpg",
        alt: "Members of the music team sharing a laugh on stage",
      },
      {
        src: "https://images.kharis.org/site-images/main/27487d8a6247d0bb/life-picks/departments/06-saxophonist.jpg",
        alt: "A saxophonist from the music department playing during a service",
      },
      {
        src: "https://images.kharis.org/site-images/main/70fe31fd939c61a5/life-picks/departments/07-camera-operator.jpg",
        alt: "A camera operator filming from behind a tripod-mounted camera",
      },
      {
        src: "https://images.kharis.org/site-images/main/3b9f2b64898938a4/life-picks/departments/08-broadcast-desk.jpg",
        alt: "The broadcast team watching Pastor David on the production monitors",
      },
      {
        src: "https://images.kharis.org/site-images/main/7a02ae0347d707cc/life-picks/departments/09-led-wall-panels.jpg",
        alt: "A member of the production team working behind the LED wall panels",
      },
      {
        src: "https://images.kharis.org/site-images/main/38c3674a2fc929ea/life-picks/departments/10-foh-mixing.jpg",
        alt: "A sound engineer adjusting the front-of-house mixing desk, viewed from above",
      },
      {
        src: "https://images.kharis.org/site-images/main/fa92704371d5d511/life-picks/departments/12-photography-team.jpg",
        alt: "A member of the photography team capturing the choir on stage",
      },
    ],
  },
];

/** The activities currently in season, in the order they are listed above. */
export function activeLifeActivities(
  seasons: Record<LifeSeason, boolean> = SEASONS,
): LifeActivity[] {
  return LIFE_ACTIVITIES.filter((a) => !a.hidden && (!a.season || seasons[a.season]));
}

export function lifeActivityBySlug(slug: string): LifeActivity | undefined {
  return LIFE_ACTIVITIES.find((a) => a.slug === slug);
}
