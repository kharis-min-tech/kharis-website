/**
 * Life at KP2, told as a comic book.
 *
 * Everything the book prints lives here: the chapters, the events in the Events book, the extra
 * "issues" on the ring. Pages render whatever is in these lists, in order,
 * so adding an event is one entry in EVENT_CHAPTERS.
 *
 * MEDIA
 * Every picture and clip is an images.kharis.org URL from the R2 bucket. Entries marked
 * `placeholder: true` borrow a photo from another Kharis event until real ones exist (Camp has no
 * photographs yet). Speech bubbles talk to the reader; they are never quotes from real people.
 */

import { KP2_PHOTOS } from "@/lib/photography";

export type BookPhoto = { src: string; alt: string; position?: string };
export type BookVideo = { src: string; poster: string };

export type EventChapter = {
  id: string;
  /** Short name for the contents list, the page counter and the chapter tabs. */
  short: string;
  title: string;
  /** The big comic sound effect on the splash page. */
  sfx: string;
  tagline: string;
  story: string;
  /** Spoken to the reader from the story page. */
  bubble: string;
  facts: { label: string; value: string }[];
  accent: "gold" | "purple" | "red" | "cyan";
  splash: BookPhoto;
  /** Loops muted on the splash page while its spread is open. */
  video?: BookVideo;
  /** Two small panels on the story page. */
  panels: [BookPhoto, BookPhoto];
  gallery: BookPhoto[];
  placeholder?: boolean;
};

export type ExtraIssue = {
  id: string;
  title: string;
  line: string;
  cover: BookPhoto;
  gallery: BookPhoto[];
};

const KP2 = "https://images.kharis.org/site-images/kp2";
const MAIN = "https://images.kharis.org/site-images/main";
const PICKS = `${MAIN}`;

const p = (src: string, alt: string, position?: string): BookPhoto => ({ src, alt, position });

export const COVER_ART: BookPhoto = p(
  `${KP2}/f565b4d37758eee2/bass-sunday.jpg`,
  "A KP2 member in a Bring A Soul Sunday T-shirt celebrating in a packed hall",
  "50% 30%",
);

export const FIRST_PAGE_ART: BookPhoto = p(
  `${KP2}/2bf8a23f06e5bb67/praise-night.jpg`,
  "A hall full of raised hands during worship",
  "50% 40%",
);

export const EVENT_CHAPTERS: EventChapter[] = [
  {
    id: "bass",
    short: "BASS",
    title: "Bring A Soul Sunday",
    sfx: "Bring one!",
    tagline: "One invite can change a whole story.",
    story:
      "The Sunday we fill the hall with friends, family and colleagues who have never been to church, or haven't been for a while. Drama, spoken word, dance and the Gospel, all in one service.",
    bubble: "So… who are you bringing?",
    facts: [
      { label: "Bring", value: "A friend (or five)" },
      { label: "Expect", value: "Drama · Dance · Spoken word" },
      { label: "Wear", value: "The T-shirt" },
    ],
    accent: "cyan",
    splash: p(
      `${KP2}/f565b4d37758eee2/bass-sunday.jpg`,
      "Members in Bring A Soul Sunday T-shirts celebrating in the hall",
      "50% 25%",
    ),
    video: {
      src: `${KP2}/06c4e252e26bc25f/crowd.mp4`,
      poster: `${KP2}/f565b4d37758eee2/bass-sunday.jpg`,
    },
    panels: [
      p(
        `${KP2}/2b9b4add2d16a081/bring-a-soul-flyers.jpg`,
        "Two members holding Bring A Soul Sunday flyers",
        "50% 40%",
      ),
      { ...KP2_PHOTOS.bassDrama, alt: "Actors performing a drama during BASS" },
    ],
    gallery: [
      p(`${KP2}/f565b4d37758eee2/bass-sunday.jpg`, "Members celebrating at Bring A Soul Sunday"),
      p(
        `${KP2}/2b9b4add2d16a081/bring-a-soul-flyers.jpg`,
        "Members holding Bring A Soul Sunday flyers",
      ),
      KP2_PHOTOS.bassDrama,
      KP2_PHOTOS.bassSpokenWord,
      KP2_PHOTOS.bassDance,
    ],
  },
  {
    id: "praise-night",
    short: "Praise Night",
    title: "Praise Night",
    sfx: "Hallelujah!",
    tagline: "A whole night given to praise.",
    story:
      "Lights down, voices up. The choir, the band and the whole KP2 family lifting Jesus high, song after song, until it's way past bedtime.",
    bubble: "Sing it like you mean it!",
    facts: [
      { label: "Expect", value: "Choir · Band · Worship" },
      { label: "Bring", value: "Your loudest voice" },
      { label: "Shoes", value: "Ones you can dance in" },
    ],
    accent: "purple",
    splash: p(
      `${KP2}/0a07dd570dc2424c/praise-singer-on-stage.jpg`,
      "A singer leading praise on stage with his hand raised",
      "50% 30%",
    ),
    video: {
      src: `${KP2}/ba4f09f054519d29/choir2.mp4`,
      poster: `${MAIN}/c92b67201f985207/events/praise-night-stage.jpg`,
    },
    panels: [
      p(
        `${KP2}/2bf8a23f06e5bb67/praise-night.jpg`,
        "Hands raised across the hall during Praise Night",
      ),
      p(
        `${MAIN}/c92b67201f985207/events/praise-night-stage.jpg`,
        "Singers on stage leading a packed hall",
        "30% 50%",
      ),
    ],
    gallery: [
      p(`${KP2}/0a07dd570dc2424c/praise-singer-on-stage.jpg`, "A singer leading praise on stage"),
      p(
        `${KP2}/2bf8a23f06e5bb67/praise-night.jpg`,
        "Hands raised across the hall during Praise Night",
      ),
      p(
        `${MAIN}/c92b67201f985207/events/praise-night-stage.jpg`,
        "Singers on stage leading a packed hall",
      ),
      p(`${MAIN}/30f91e40757f6bf2/events/praise-night/0I1A0489.jpg`, "Worship at Praise Night"),
      p(`${MAIN}/4564419103182d34/events/praise-night/DSC08221.jpg`, "The choir at Praise Night"),
      p(
        `${MAIN}/74b9d2246e4fa66c/events/praise-night/DSC08530.jpg`,
        "The congregation at Praise Night",
      ),
      p(`${MAIN}/eaa93b789c189217/events/praise-night/0I1A0873.jpg`, "Praise at Praise Night"),
    ],
  },
  {
    id: "camp",
    short: "Camp",
    title: "Camp",
    sfx: "Road trip!",
    tagline: "Get away to get closer.",
    story:
      "Days away together: early-morning prayer, teaching that goes deep, games that get competitive, and late-night conversations that turn strangers into family.",
    bubble: "Who's sharing a room with me?",
    facts: [
      { label: "Expect", value: "Teaching · Prayer · Games" },
      { label: "Pack", value: "Your Bible and a sleeping bag" },
      { label: "Leave", value: "Your worries at home" },
    ],
    accent: "gold",
    placeholder: true,
    splash: p(
      `${PICKS}/67587be47ceeb3bd/life-picks/k-group/02-living-room.jpg`,
      "A circle of members studying the Bible together",
      "50% 45%",
    ),
    panels: [
      p(
        `${PICKS}/423f80133efadcb6/life-picks/fasting/14-group-praying-together.jpg`,
        "A group praying together",
      ),
      p(
        `${PICKS}/12674f47125bccf9/life-picks/innovation-project/01-group.jpg`,
        "A group of young adults together",
      ),
    ],
    gallery: [
      p(
        `${PICKS}/67587be47ceeb3bd/life-picks/k-group/02-living-room.jpg`,
        "A circle of members studying the Bible together",
      ),
      p(
        `${PICKS}/423f80133efadcb6/life-picks/fasting/14-group-praying-together.jpg`,
        "A group praying together",
      ),
      p(
        `${PICKS}/12674f47125bccf9/life-picks/innovation-project/01-group.jpg`,
        "A group of young adults together",
      ),
    ],
  },
  {
    id: "sports-day",
    short: "Sports Day",
    title: "Sports Day",
    sfx: "On your marks!",
    tagline: "Faith in trainers.",
    story:
      "Races, relays and a lot of friendly trash talk. Sports Day brings every department onto one field to compete, cheer each other on and laugh until it hurts.",
    bubble: "Last one to the line buys lunch!",
    facts: [
      { label: "Expect", value: "Relays · Tug of war · Sack race" },
      { label: "Bring", value: "Trainers" },
      { label: "Teams", value: "Mixed and very loud" },
    ],
    accent: "red",
    splash: p(
      `${PICKS}/8c997a971d8f4b71/life-picks/family-fun-day/02-race.jpg`,
      "Members sprinting across a court in a race",
      "55% 55%",
    ),
    panels: [
      p(
        `${PICKS}/2e77bbfef0cc35b4/life-picks/family-fun-day/19-tug-of-war-women.jpg`,
        "A tug of war",
      ),
      p(
        `${PICKS}/75064ed5ccbca267/life-picks/family-fun-day/10-sack-race-adults.jpg`,
        "Adults in a sack race",
      ),
    ],
    gallery: [
      p(
        `${PICKS}/8c997a971d8f4b71/life-picks/family-fun-day/02-race.jpg`,
        "Members sprinting in a race",
      ),
      p(
        `${PICKS}/2e77bbfef0cc35b4/life-picks/family-fun-day/19-tug-of-war-women.jpg`,
        "A women's tug of war",
      ),
      p(
        `${PICKS}/29b5e52e9022aa1c/life-picks/family-fun-day/20-tug-of-war-men.jpg`,
        "A men's tug of war",
      ),
      p(
        `${PICKS}/75064ed5ccbca267/life-picks/family-fun-day/10-sack-race-adults.jpg`,
        "Adults in a sack race",
      ),
      p(
        `${MAIN}/3423ef762f6c2481/events/family-fun-day-race.jpg`,
        "Members racing across the court",
      ),
    ],
  },
  {
    id: "football",
    short: "Football",
    title: "Football Tournament",
    sfx: "Goal!!!",
    tagline: "Every match, all heart.",
    story:
      "Teams battle it out for the trophy with a packed sideline, live commentary and an MC who never stops talking. Win or lose, everyone ends up in the team photo.",
    bubble: "Pass it! PASS IT!",
    facts: [
      { label: "Expect", value: "Matches · Penalties · A trophy" },
      { label: "Bring", value: "Boots, or a loud voice" },
      { label: "Prize", value: "Bragging rights" },
    ],
    accent: "gold",
    splash: p(
      `${PICKS}/1c6c077e5f63fe91/life-picks/football-tournament/01-duel.jpg`,
      "Two players battling for the ball in front of a crowd",
      "55% 60%",
    ),
    video: {
      src: `${MAIN}/b32d4e26393125e1/FOOTBALL%202%20-%20Trim-960w.mp4`,
      poster: `${PICKS}/4bee94a5aa2e8d42/life-picks/football-tournament/00-main-trophy.jpg`,
    },
    panels: [
      p(
        `${PICKS}/3921fff2a571ecd9/life-picks/football-tournament/06-shot.jpg`,
        "A player taking a shot",
      ),
      p(
        `${PICKS}/4bee94a5aa2e8d42/life-picks/football-tournament/00-main-trophy.jpg`,
        "The winning team lifting the trophy",
        "50% 30%",
      ),
    ],
    gallery: [
      p(
        `${PICKS}/1c6c077e5f63fe91/life-picks/football-tournament/01-duel.jpg`,
        "Two players battling for the ball",
      ),
      p(
        `${PICKS}/3921fff2a571ecd9/life-picks/football-tournament/06-shot.jpg`,
        "A player taking a shot",
      ),
      p(
        `${PICKS}/66963036c51759b8/life-picks/football-tournament/12-save.jpg`,
        "The goalkeeper making a save",
      ),
      p(
        `${PICKS}/7e5a9c8911b046dd/life-picks/football-tournament/10-celebration-run.jpg`,
        "A goal celebration run",
      ),
      p(
        `${PICKS}/0cd65e1304601281/life-picks/football-tournament/03-crowd.jpg`,
        "The crowd on the sideline",
      ),
      p(
        `${PICKS}/4bee94a5aa2e8d42/life-picks/football-tournament/00-main-trophy.jpg`,
        "The winners lifting the trophy",
      ),
    ],
  },
  {
    id: "fun-day",
    short: "Fun Day",
    title: "Family Fun Day",
    sfx: "Wheee!",
    tagline: "Candy floss and community.",
    story:
      "Bouncy castle, face paint, sack races and the longest conga line you have ever seen. A day for every age to simply enjoy being family.",
    bubble: "Again! AGAIN!",
    facts: [
      { label: "Expect", value: "Games · Food · Face paint" },
      { label: "Bring", value: "Everyone. Kids to grandparents" },
      { label: "Don't miss", value: "The conga line" },
    ],
    accent: "cyan",
    splash: p(
      `${PICKS}/1098ac377fcf2301/life-picks/family-fun-day/08-bouncy-castle.jpg`,
      "Children on a bouncy castle",
      "50% 50%",
    ),
    panels: [
      p(
        `${PICKS}/32153f95b200ccb3/life-picks/family-fun-day/06-face-painting.jpg`,
        "A child having their face painted",
      ),
      p(
        `${PICKS}/43146f4dec017465/life-picks/family-fun-day/13-conga.jpg`,
        "A conga line across the court",
      ),
    ],
    gallery: [
      p(
        `${PICKS}/1098ac377fcf2301/life-picks/family-fun-day/08-bouncy-castle.jpg`,
        "Children on a bouncy castle",
      ),
      p(
        `${PICKS}/32153f95b200ccb3/life-picks/family-fun-day/06-face-painting.jpg`,
        "Face painting",
      ),
      p(`${PICKS}/43146f4dec017465/life-picks/family-fun-day/13-conga.jpg`, "A conga line"),
      p(`${PICKS}/1dfd0822005cbd0e/life-picks/family-fun-day/07-candy-floss.jpg`, "Candy floss"),
      p(
        `${PICKS}/026b9cce00162df0/life-picks/family-fun-day/09-sack-race-kids.jpg`,
        "Children in a sack race",
      ),
      p(
        `${PICKS}/033df5e35b726e10/life-picks/family-fun-day/21-trophy.jpg`,
        "A trophy at Family Fun Day",
      ),
    ],
  },
];

export const EXTRA_ISSUES: ExtraIssue[] = [
  {
    id: "singles-ball",
    title: "Singles' Ball",
    line: "Dressed up, fed well, prayed for.",
    cover: p(
      `${PICKS}/46081a409e0e1fd1/life-picks/singles-seminar/00-main-portrait.jpg`,
      "Guests at the Singles' Ball",
    ),
    gallery: [
      p(
        `${PICKS}/46081a409e0e1fd1/life-picks/singles-seminar/00-main-portrait.jpg`,
        "Guests at the Singles' Ball",
      ),
      p(
        `${PICKS}/2f8106a9bc9a96f1/life-picks/singles-seminar/02-dance.jpg`,
        "Dancing at the Singles' Ball",
      ),
      p(
        `${PICKS}/7cd6b6b166e6be55/life-picks/singles-seminar/07-selfie-table.jpg`,
        "A table selfie",
      ),
      p(
        `${PICKS}/83ee08602a84fb40/life-picks/singles-seminar/14-table-setting.jpg`,
        "The table setting",
      ),
    ],
  },
  {
    id: "bible-speak",
    title: "Let the Bible Speak",
    line: "A conference that opens the Book.",
    cover: p(
      `${PICKS}/0ba04c272f02e78b/life-picks/let-the-bible-speak-conference/05-raised-bibles-reaching.jpg`,
      "Bibles raised high at the conference",
    ),
    gallery: [
      p(
        `${PICKS}/0ba04c272f02e78b/life-picks/let-the-bible-speak-conference/05-raised-bibles-reaching.jpg`,
        "Bibles raised high",
      ),
      p(
        `${PICKS}/48c13b558056fe3d/life-picks/let-the-bible-speak-conference/01-packed-hall.jpg`,
        "A packed hall",
      ),
      p(
        `${PICKS}/013a7f8eb198cb46/life-picks/let-the-bible-speak-conference/03-preaching-open-bible.jpg`,
        "Preaching from an open Bible",
      ),
      p(
        `${PICKS}/0c8c7e0fc5cbd9ef/life-picks/let-the-bible-speak-conference/11-full-stage-worship.jpg`,
        "Worship on the main stage",
      ),
    ],
  },
  {
    id: "outreach",
    title: "Jesus Campaign",
    line: "The Gospel on our streets.",
    cover: p(
      `${PICKS}/af6114c87c7ccc08/life-picks/jesus-campaign/00-main-passionate-outreach.jpg`,
      "Sharing the Gospel on the street",
    ),
    gallery: [
      p(
        `${PICKS}/af6114c87c7ccc08/life-picks/jesus-campaign/00-main-passionate-outreach.jpg`,
        "Sharing the Gospel on the street",
      ),
      p(
        `${PICKS}/1ecc159356293775/life-picks/jesus-campaign/04-bench-conversation.jpg`,
        "A conversation on a bench",
      ),
      p(`${PICKS}/38698af4162d2e1e/life-picks/jesus-campaign/15-fist-bump.jpg`, "A fist bump"),
      p(
        `${PICKS}/913afa5a001db19d/life-picks/jesus-campaign/11-prayer-huddle.jpg`,
        "A prayer huddle",
      ),
    ],
  },
  {
    id: "baptism",
    title: "Baptism",
    line: "Buried with Him, raised to new life.",
    cover: KP2_PHOTOS.baptismJoy,
    gallery: [
      KP2_PHOTOS.baptismJoy,
      KP2_PHOTOS.baptismCelebration,
      KP2_PHOTOS.baptismCeremony,
      KP2_PHOTOS.baptismFamily,
    ],
  },
  {
    id: "fasting",
    title: "Fasting & Prayer",
    line: "Seasons of seeking God together.",
    cover: p(
      `${PICKS}/414d2eed19e87141/life-picks/fasting/06-joyful-worship-raised-hands.jpg`,
      "Joyful worship with raised hands",
    ),
    gallery: [
      p(
        `${PICKS}/414d2eed19e87141/life-picks/fasting/06-joyful-worship-raised-hands.jpg`,
        "Joyful worship",
      ),
      p(
        `${PICKS}/147b57347de9dd9c/life-picks/fasting/03-prayer-fest-crowd.jpg`,
        "A crowd at prayer",
      ),
      p(
        `${PICKS}/423f80133efadcb6/life-picks/fasting/14-group-praying-together.jpg`,
        "A group praying together",
      ),
    ],
  },
  {
    id: "innovation",
    title: "Innovation Project",
    line: "Big ideas, real mentors.",
    cover: p(
      `${PICKS}/618d492c54b5ca18/life-picks/innovation-project/00-main-pitch.jpg`,
      "A team pitching their idea",
    ),
    gallery: [
      p(
        `${PICKS}/618d492c54b5ca18/life-picks/innovation-project/00-main-pitch.jpg`,
        "A team pitching their idea",
      ),
      p(
        `${PICKS}/0e8f625d864e8e5a/life-picks/innovation-project/02-mentoring-chat.jpg`,
        "A mentoring chat",
      ),
      p(
        `${PICKS}/15b6069f2c123a2d/life-picks/innovation-project/04-card-tower.jpg`,
        "Building a card tower",
      ),
    ],
  },
  {
    id: "serve",
    title: "Departments",
    line: "There's a place on the team for you.",
    cover: KP2_PHOTOS.serviceSaxophone,
    gallery: [
      KP2_PHOTOS.serviceSaxophone,
      KP2_PHOTOS.serviceCamera,
      KP2_PHOTOS.serviceSound,
      KP2_PHOTOS.serviceChoir,
    ],
  },
  {
    id: "outreach-kp2",
    title: "Street Outreach",
    line: "KP2 taking the Good News outside.",
    cover: KP2_PHOTOS.outreachTeam,
    gallery: [
      KP2_PHOTOS.outreachTeam,
      KP2_PHOTOS.outreachConversation,
      KP2_PHOTOS.outreachSharing,
      KP2_PHOTOS.outreachStreet,
    ],
  },
];

/** The contents page, the inside cover and the page counter all read from this. */
export type Chapter = { id: string; label: string; page: string };

export const CHAPTERS: Chapter[] = [
  { id: "lb-origin", label: "The origin story", page: "02" },
  { id: "lb-events", label: "The Events", page: "04" },
  { id: "lb-more", label: "More adventures", page: "18" },
  { id: "lb-you", label: "Your chapter", page: "22" },
];
