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
  | "family-fun-day"
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
    title: "Singles' Ball",
    blurb: "Honest conversation about singleness, dating and waiting well.",
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
    image:
      "https://images.kharis.org/site-images/main/618d492c54b5ca18/life-picks/innovation-project/00-main-pitch.jpg",
    alt: "Young people presenting their pitch, HomeLink, on stage at Barclays",
    gallery: [
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
        src: "https://images.kharis.org/site-images/main/15b6069f2c123a2d/life-picks/innovation-project/04-card-tower.jpg",
        alt: "Students building a card tower together during a team exercise",
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
    blurb: "Sack races, tug of war and a trophy on the line.",
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
    blurb: "Days of teaching that put Scripture back at the centre.",
    body: "A conference built around the Word being allowed to say what it says. Sustained teaching rather than a single sermon, for anyone who wants to move past Sunday depth and learn to read Scripture for themselves.",
    cadence: "Yearly",
    audience: "Anyone ready to go deeper",
    image:
      "https://images.kharis.org/site-images/main/67a46f34494b763e/life-picks/let-the-bible-speak-conference/00-main-open-bible.jpg",
    alt: "An open Bible, turned to Genesis 4",
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
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/e3d93dee21bbad78/life-picks/k-group/01-conversation.jpg",
        alt: "Two K-Group members deep in conversation at a home fellowship",
      },
      {
        src: "https://images.kharis.org/site-images/main/67587be47ceeb3bd/life-picks/k-group/02-living-room.jpg",
        alt: "A K-Group gathered around a living room, Bibles open",
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
    gallery: [
      {
        src: "https://images.kharis.org/site-images/main/3ca65e0f86f1c2f8/life-picks/fasting/01-prayer.jpg",
        alt: "A worshipper in prayer during Prayer Fest",
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
    image: LIFE_SERVE_IMAGE,
    alt: "Serving together at Kharis",
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
    ],
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
