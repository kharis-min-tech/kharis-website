import { publicAsset } from "./public-asset";
import { KP2_PHOTOS } from "./photography";

/** One frame in an event's moments carousel: a photo, or a short silent clip. */
export type EventMoment = {
  kind: "photo" | "clip";
  src: string;
  /** Clips only: the still shown before the clip plays (and instead of it under reduced motion). */
  poster?: string;
  alt: string;
  caption: string;
  /** Portrait media (phone stories) get a tall frame; everything else is landscape. */
  tall?: boolean;
  position?: string;
};

export type SignatureEvent = {
  id: "bass" | "sports-day" | "praise-night" | "camp";
  number: string;
  /** Short name used on the reel, chapter index and marquee. */
  name: string;
  /** Full name, when the short name is an abbreviation. */
  fullName?: string;
  tagline: string;
  intro: string;
  facts: string[];
  /** A line pulled from the event itself, shown as a speech bubble. */
  quote?: string;
  /** Accent colour for the chapter (stickers, rules, progress). */
  accent: string;
  /** Text colour that reads on the accent. */
  onAccent: string;
  /** The feature: video when there is footage, otherwise a slow-panning photo. */
  feature: { kind: "clip" | "photo"; src: string; poster?: string; alt: string; tall?: boolean };
  moments: EventMoment[];
  /** The day's acts on a "now showing" screen with a picker of the others beside it. */
  lineup?: { kicker: string; title: string; intro: string; acts: EventClip[] };
  /** A wide cinema player that runs clips back to back as chapters on a timeline. */
  story?: { kicker: string; title: string; intro: string; clips: EventClip[] };
  /** Team entrances side by side, each card in its team colour. */
  teams?: { kicker: string; title: string; intro: string; teams: EventTeam[] };
  /** Head-to-head bouts (e.g. tug of war), each a fight-poster card. */
  bouts?: { kicker: string; title: string; intro: string; bouts: EventBout[] };
  /** Camp: each camp's theme, quote and photos, shown one at a time with a switcher. */
  camps?: CampEdition[];
  /** Scriptures that frame the chapter (KJV). */
  scriptures?: { ref: string; text: string }[];
};

/** One camp: its theme, colour, the pastor's word for it, its themes and a photo mosaic. */
export type CampEdition = {
  id: string;
  name: string;
  /** The camp's key scripture (on its logo) and its words (KJV). */
  scripture?: string;
  scriptureText?: string;
  colour: string;
  onColour: string;
  summary: string;
  quote: string;
  themes: { title: string; text: string }[];
  /** Three photos: the first is the large one in the mosaic. */
  photos: { src: string; alt: string; position?: string }[];
};

/** A portrait clip with a short label (tabs, slivers) and a longer caption. */
export type EventClip = {
  id: string;
  label: string;
  caption: string;
  /** A sentence about what happens in the clip (the cinema player's caption card). */
  description?: string;
  /** Clip length, so the cinema timeline can size each chapter before the clips load. */
  seconds?: number;
  src: string;
  poster: string;
  alt: string;
};

/** A team colour: the fill and a text colour that reads on it. */
export type TeamColour = { name: string; colour: string; onColour: string };

export type EventTeam = TeamColour & {
  id: string;
  /** The team's own line from its clip. */
  line: string;
  champion?: boolean;
  src: string;
  poster: string;
  alt: string;
};

export type EventBout = {
  id: string;
  home: TeamColour;
  away: TeamColour;
  src: string;
  poster: string;
  alt: string;
};

const TEAM = {
  blue: { name: "Blue", colour: "#1f5fd6", onColour: "#fff" },
  green: { name: "Green", colour: "#22a55a", onColour: "#fff" },
  pink: { name: "Pink", colour: "#f0509a", onColour: "#fff" },
  yellow: { name: "Yellow", colour: "#f7be1d", onColour: "#151218" },
  orange: { name: "Orange", colour: "#f57c1f", onColour: "#151218" },
  red: { name: "Red", colour: "#e63946", onColour: "#fff" },
} satisfies Record<string, TeamColour>;

const asset = (path: string) => publicAsset(`/assets/events/${path}`);
const clip = (path: string) => ({ src: asset(`${path}.mp4`), poster: asset(`${path}-poster.jpg`) });

export const SIGNATURE_EVENTS: SignatureEvent[] = [
  {
    id: "bass",
    number: "01",
    name: "BASS",
    fullName: "Bring A Soul Sunday",
    tagline: "Bring someone. Shades on.",
    intro:
      "One Sunday built around the person you bring with you. Food, fellowship, worship and the Word of God, with yellow shades on every face and two very friendly bees working the room.",
    facts: ["Food & fellowship", "Worship & the Word", "Invite a friend"],
    quote: "This type of bee doesn't sting.",
    lineup: {
      kicker: "The line-up",
      title: "Food, music & moves",
      intro:
        "Everything that happens before the Word: a table full of treats, K-Music on stage, K-Dancers on the floor and a room that came ready.",
      acts: [
        {
          id: "came-ready",
          label: "Came ready",
          caption: "On the dance floor before the service even starts",
          ...clip("bass/bass-came-ready"),
          alt: "KP2 members dancing together in the ballroom before the service",
        },
        {
          id: "food",
          label: "Food",
          caption: "A striped table of treats, sweets and fruit punch",
          ...clip("bass/bass-food-table"),
          alt: "A red and white striped table of desserts, sweets and jars of drinks",
        },
        {
          id: "k-music",
          label: "K-Music",
          caption: "K-Music leading the room from the stage",
          ...clip("bass/bass-k-music"),
          alt: "K-Music singers leading worship on the BASS stage",
        },
        {
          id: "k-dancers",
          label: "K-Dancers",
          caption: "K-Dancers on the floor, with a bee joining in",
          ...clip("bass/bass-k-dancers"),
          alt: "K-Dancers in white dancing in front of the stage, joined by the BASS bee",
        },
        {
          id: "servers",
          label: "Hosts",
          caption: "Hosts serving with a smile (gloves on)",
          ...clip("bass/bass-food-servers"),
          alt: "Hosts in Bring A Soul Sunday T-shirts smiling behind the food table",
        },
      ],
    },
    story: {
      kicker: "Our pastor at BASS",
      title: "Pastor David at BASS",
      intro:
        "From an expectant room at the start to joy in the presence of the Lord at the end, Christ is at the centre of it all.",
      clips: [
        {
          id: "expectant",
          label: "Expectant",
          caption: "Excited to hear the Word",
          description: "We were on our feet as he walked in, excited to hear the Word.",
          seconds: 10.3,
          ...clip("bass/bass-pastor-walks-in"),
          alt: "Pastor David walking towards the stage as the congregation cheers",
        },
        {
          id: "pulpit",
          label: "The Word",
          caption: "At the pulpit",
          description: "At the pulpit with his hands lifted, ministering the Word to a full room.",
          seconds: 8.9,
          ...clip("bass/bass-pastor-pulpit"),
          alt: "Pastor David at the pulpit, lifting his hands as he ministers",
        },
        {
          id: "kadosh",
          label: "Kadosh",
          caption: "Dancing to Kadosh",
          description: "BASS T-shirt on, dancing on stage with the choir as the room sings Kadosh.",
          seconds: 15.2,
          ...clip("bass/bass-pastor-kadosh"),
          alt: "Pastor David in a Bring A Soul Sunday T-shirt dancing on stage during Kadosh",
        },
        {
          id: "joy",
          label: "Joy",
          caption: "Joy in the presence of the Lord",
          description:
            "Joy in the presence of the Lord, with the young people dancing alongside him.",
          seconds: 24,
          ...clip("bass/bass-pastor-azuka"),
          alt: "Pastor David dancing with joy on stage alongside the young people",
        },
      ],
    },
    accent: "#f7be1d",
    onAccent: "#151218",
    feature: {
      kind: "clip",
      ...clip("bass/bass-bee-dance"),
      alt: "The BASS bee mascots dancing with the congregation in the hotel ballroom",
      tall: true,
    },
    moments: [
      {
        kind: "photo",
        src: asset("bass/bass-shades-hero.jpg"),
        alt: "A smiling member wearing yellow BASS sunglasses and pointing at them",
        caption: "Shades on",
        position: "center 35%",
      },
      {
        kind: "clip",
        ...clip("bass/bass-recap"),
        alt: "A member dancing in a blue Bring A Soul Sunday T-shirt during the summer BASS",
        caption: "Summer BASS recap",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("bass/bass-crowd-shirts.jpg"),
        alt: "Members in blue Bring A Soul Sunday T-shirts celebrating with their arms raised",
        caption: "The blue shirts",
      },
      {
        kind: "photo",
        src: asset("bass/bass-shades-2.jpg"),
        alt: "A member in a gilet striking a pose in yellow BASS shades",
        caption: "Brought a friend",
        tall: true,
      },
      {
        kind: "clip",
        ...clip("bass/bass-praise-bees"),
        alt: "The bees and the congregation praising together in front of the stage",
        caption: "Praise the Lord",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("bass/bass-praise-fans.jpg"),
        alt: "The congregation waving fans and lifting their hands in praise",
        caption: "Full voice",
      },
      {
        kind: "photo",
        src: asset("bass/bass-shades-3.jpg"),
        alt: "A member with curly hair laughing in yellow BASS shades",
        caption: "First time here",
        tall: true,
      },
      {
        kind: "photo",
        src: KP2_PHOTOS.bassDance.src,
        alt: KP2_PHOTOS.bassDance.alt,
        caption: "On the dance floor",
      },
      {
        kind: "clip",
        ...clip("bass/bass-crowd"),
        alt: "The whole room singing and dancing in their BASS T-shirts",
        caption: "The room",
        tall: true,
      },
      {
        kind: "photo",
        src: KP2_PHOTOS.bassSpokenWord.src,
        alt: KP2_PHOTOS.bassSpokenWord.alt,
        caption: "Spoken word",
      },
      {
        kind: "photo",
        src: asset("bass/bass-flyer.jpg"),
        alt: "The summer Bring A Soul Sunday flyer: Millennium Gloucester Hotel at 2pm, a touch of denim, food, fellowship, worship and the Word of God",
        caption: "The invite",
        tall: true,
      },
    ],
  },
  {
    id: "sports-day",
    number: "02",
    name: "Sports Day",
    tagline: "On your marks.",
    intro:
      "A full day on the track. Teams turn out in their colours, the cheer squads take the stands, and everyone ends up in the tug of war. There's football on the field and a table of trophies at the end.",
    facts: ["Team colours", "Tug of war", "Trophies"],
    quote: "It's coming home.",
    teams: {
      kicker: "Team entrances",
      title: "Five teams. One track.",
      intro:
        "Every team made an entrance: smoke, banners, matching kits and a dance to go with it. Blue had the best one, and went on to win.",
      teams: [
        {
          id: "blue",
          ...TEAM.blue,
          line: "Best entrance, and the win",
          champion: true,
          ...clip("sports/sports-team-blue"),
          alt: "The blue team dancing on the track in matching blue tops",
        },
        {
          id: "green",
          ...TEAM.green,
          line: "Green, green, green",
          ...clip("sports/sports-team-green"),
          alt: "The green team arriving with green smoke, balloons and whistles",
        },
        {
          id: "pink",
          ...TEAM.pink,
          line: "Pink team have entered the chat",
          ...clip("sports/sports-team-pink"),
          alt: "The pink team dancing through pink smoke on the track",
        },
        {
          id: "yellow",
          ...TEAM.yellow,
          line: "Banner up, it's coming home",
          ...clip("sports/sports-team-yellow"),
          alt: "The yellow team marching behind their hand-made Yellow Team banner",
        },
        {
          id: "orange",
          ...TEAM.orange,
          line: "Warming up for the win",
          ...clip("sports/sports-team-orange"),
          alt: "The orange team warming up with a dance on the track",
        },
      ],
    },
    bouts: {
      kicker: "Tug of war",
      title: "Grip it. Dig in. Pull.",
      intro: "Three bouts on the field, one rope, and nobody letting go first.",
      bouts: [
        {
          id: "yellow-green",
          home: TEAM.yellow,
          away: TEAM.green,
          ...clip("sports/sports-tug-yellow-green"),
          alt: "The yellow and green teams pulling against each other in the tug of war",
        },
        {
          id: "red-blue",
          home: TEAM.red,
          away: TEAM.blue,
          ...clip("sports/sports-tug-red-blue"),
          alt: "The red and blue teams straining on the rope in the tug of war",
        },
        {
          id: "pink-orange",
          home: TEAM.pink,
          away: TEAM.orange,
          ...clip("sports/sports-tug-pink-orange"),
          alt: "The pink and orange teams digging in during the tug of war",
        },
      ],
    },
    accent: "#e63946",
    onAccent: "#fff",
    feature: {
      kind: "clip",
      ...clip("sports/sports-highlights"),
      alt: "Sports Day highlights: teams dancing, cheering and racing at the athletics track",
    },
    moments: [
      {
        kind: "clip",
        ...clip("sports/sports-tug-of-war"),
        alt: "Teams straining on the rope during the Sports Day tug of war",
        caption: "Tug of war",
      },
      {
        kind: "photo",
        src: asset("sports/sports-track.jpg"),
        alt: "Runners racing down the track with the stands full of supporters, plus cheerleaders and a trophy selfie",
        caption: "The track",
        tall: true,
      },
      {
        kind: "clip",
        ...clip("sports/sports-trophies"),
        alt: "A table of gold trophies waiting for the winners",
        caption: "The trophy table",
      },
      {
        kind: "photo",
        src: asset("sports/sports-red-team.jpg"),
        alt: "The red team posing together in their team colours",
        caption: "Team red",
        tall: true,
      },
      {
        kind: "clip",
        ...clip("sports/sports-football"),
        alt: "A football match on the field at Sports Day",
        caption: "Five-a-side",
      },
      {
        kind: "photo",
        src: asset("sports/sports-coming-home.jpg"),
        alt: "Supporters holding an It's Coming Home sign, with smoke flares and the yellow team",
        caption: "It's coming home",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("sports/sports-referee.jpg"),
        alt: "The referee in a striped shirt with his clipboard raised",
        caption: "The ref",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("sports/sports-park.jpg"),
        alt: "Sports Day by the stadium, with races, smiles and the medal table",
        caption: "Medal moments",
        tall: true,
      },
      {
        kind: "clip",
        ...clip("sports/sports-blue-on-a-roll"),
        alt: "The blue team celebrating on the track",
        caption: "Blue on a roll",
        tall: true,
      },
      {
        kind: "clip",
        ...clip("sports/sports-ice-cream-van"),
        alt: "Ice cream being served to the teams by the track",
        caption: "Ice cream",
        tall: true,
      },
      {
        kind: "clip",
        ...clip("sports/sports-burger-van"),
        alt: "Lunch being served to the teams at Sports Day",
        caption: "Lunch time",
        tall: true,
      },
    ],
  },
  {
    id: "praise-night",
    number: "03",
    name: "Praise Night",
    tagline: "A whole night of praise.",
    intro:
      "The lights go down and the praise goes up. The choir, the band and the whole room singing together, with nothing else on the programme.",
    facts: ["Choir & band", "Packed hall", "Walking by faith"],
    quote: "Let everything that has breath praise the Lord.",
    accent: "#630ed4",
    onAccent: "#fff",
    feature: {
      kind: "photo",
      src: asset("praise/praise-night-crowd.jpg"),
      alt: "A packed hall at Praise Night with the congregation singing towards the stage",
    },
    moments: [
      {
        kind: "photo",
        src: "https://images.kharis.org/site-images/main/c92b67201f985207/events/praise-night-stage.jpg",
        alt: "Singers leading praise on stage beside a large screen, with a packed hall in front of them",
        caption: "The stage",
        position: "30% 50%",
      },
      {
        kind: "photo",
        src: asset("praise/praise-night-singer.jpg"),
        alt: "A singer in a black suit lifting his voice into the microphone",
        caption: "Lift it up",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("praise/praise-night-walking-by-faith.jpg"),
        alt: "Singers on stage under a Walking by Faith screen",
        caption: "Walking by faith",
      },
      {
        kind: "photo",
        src: asset("praise/praise-night-praise.jpg"),
        alt: "A worship leader in a blue suit pointing up as he sings",
        caption: "All the glory",
      },
      {
        kind: "photo",
        src: KP2_PHOTOS.servicePraise.src,
        alt: KP2_PHOTOS.servicePraise.alt,
        caption: "The team",
        position: KP2_PHOTOS.servicePraise.position,
      },
      {
        kind: "photo",
        src: KP2_PHOTOS.serviceWorship.src,
        alt: KP2_PHOTOS.serviceWorship.alt,
        caption: "Hands up",
      },
    ],
  },
  {
    id: "camp",
    number: "04",
    name: "Camp",
    tagline: "A day at His feet.",
    intro:
      "A day appointed to sit at the feet of God's servant, Pastor David Antwi, and hear the Word of God expounded from morning to evening, with every ear attentive to the Word. Deep prayer and worship, the pursuit of a fresh fire from the Holy Spirit, and testimonies of lives that have been changed.",
    scriptures: [
      {
        ref: "Acts 28:23",
        text: "…there came many to him into his lodging; to whom he expounded and testified the kingdom of God… from morning till evening.",
      },
      {
        ref: "Nehemiah 8:3",
        text: "…and the ears of all the people were attentive unto the book of the law.",
      },
    ],
    facts: ["A whole day in the Word", "Prayer & worship", "Testimonies"],
    accent: "#f57c1f",
    onAccent: "#151218",
    feature: {
      kind: "photo",
      src: asset("camp/aor-hands-raised.jpg"),
      alt: "A packed hall at Agents of Revival camp, hands raised in worship",
    },
    camps: [
      {
        id: "agents-of-revival",
        name: "Agents of Revival",
        scripture: "Acts 8:5",
        scriptureText:
          "Then Philip went down to the city of Samaria, and preached Christ unto them.",
        colour: "#f57c1f",
        onColour: "#151218",
        summary:
          "A dedicated space for spiritual growth, where we are prepared to be sent out as agents of revival: to spread the Gospel and live for Christ.",
        quote: "Every genuine revival is preceded by the preaching of the Gospel.",
        themes: [
          {
            title: "Spiritual focus",
            text: "Deep prayer, worship and the pursuit of a fresh fire from the Holy Spirit to transform lives.",
          },
          {
            title: "The message",
            text: "The Gospel: the good news for bad people, and the foundation of genuine salvation.",
          },
          {
            title: "Community",
            text: "Testimonies of changed lives, and a commitment to live differently, away from the party environment and towards Christ.",
          },
          {
            title: "Identity",
            text: "Orange shirts on, as representatives of the vision to establish believers and strengthen churches.",
          },
        ],
        photos: [
          {
            src: asset("camp/aor-hands-raised.jpg"),
            alt: "The hall at Agents of Revival camp full of raised hands in orange camp shirts",
            position: "left bottom",
          },
          {
            src: asset("camp/aor-pastor-laughing.jpg"),
            alt: "Pastor David Antwi smiling on stage at Agents of Revival camp",
            position: "center top",
          },
          {
            src: asset("camp/aor-poster.jpg"),
            alt: "The Agents of Revival camp poster with photos of worship and the pastor",
          },
        ],
      },
      {
        id: "not-one-city",
        name: "Not One City Too Strong For Us",
        scripture: "Acts 8:5",
        scriptureText:
          "Then Philip went down to the city of Samaria, and preached Christ unto them.",
        colour: "#7b2fd0",
        onColour: "#fff",
        summary:
          "KP2 as a Spirit-filled movement for city-wide evangelism and church planting, with every city in reach when Christ is preached.",
        quote: "We only take cities when we preach Christ.",
        themes: [
          {
            title: "Spiritual focus",
            text: "The anointing and fresh oil as the power for mission, kept through consecration and prayer: a vessel meet for the Master's use.",
          },
          {
            title: "The message",
            text: "Preach Christ. Not politics, motivational speaking or social justice in place of the Gospel: cities are taken by His authority.",
          },
          {
            title: "Identity",
            text: "A new breed of Christians, unashamed of their faith and wholly following God, committed to the local church and its missionary assignments.",
          },
        ],
        photos: [
          {
            src: asset("camp/noc-pastor-crowd.jpg"),
            alt: "Pastor David Antwi reaching out to a crowd of young people at Not One City camp",
            position: "left bottom",
          },
          {
            src: asset("camp/noc-pastor-pulpit.jpg"),
            alt: "Pastor David Antwi preaching at the pulpit at Not One City camp",
            position: "center top",
          },
          {
            src: asset("camp/noc-cheering.jpg"),
            alt: "Young people in purple camp shirts cheering during Not One City camp",
          },
        ],
      },
    ],
    moments: [
      {
        kind: "photo",
        src: asset("camp/noc-joy.jpg"),
        alt: "A young man throwing his arms up and laughing with friends at Not One City camp",
        caption: "Not One City",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/aor-collage-stage.jpg"),
        alt: "Pastor David Antwi on stage facing a hall full of orange camp shirts",
        caption: "Agents of Revival",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/noc-bibles.jpg"),
        alt: "Rows of young people with their Bibles open at Not One City camp",
        caption: "Bibles open",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/aor-hands-raised-2.jpg"),
        alt: "Hands raised across the hall at Agents of Revival camp",
        caption: "Fresh fire",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/noc-holy-religion.jpg"),
        alt: "A young man with his hands on his head in worship at Not One City camp",
        caption: "Genuine heart",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/aor-pastor-collage.jpg"),
        alt: "Pastor David Antwi preaching, with photos of the young people at Agents of Revival camp",
        caption: "The Word",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/noc-hall.jpg"),
        alt: "The hall at Not One City camp, filled with young people facing the stage",
        caption: "Expectant",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/aor-collage-faces.jpg"),
        alt: "A collage of worship and prayer at Agents of Revival camp",
        caption: "Prayer",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/noc-worship-collage.jpg"),
        alt: "Worship and the pastor at Not One City camp",
        caption: "Worship",
        tall: true,
      },
      {
        kind: "photo",
        src: asset("camp/aor-moments-collage.jpg"),
        alt: "Black and white moments from Agents of Revival camp",
        caption: "Moments",
        tall: true,
      },
    ],
  },
];

/** Poster shown for each event on the opening reel. */
export const REEL_COVERS: Record<
  SignatureEvent["id"],
  { clip?: string; still: string; alt: string }
> = {
  bass: {
    clip: asset("bass/bass-recap.mp4"),
    still: asset("bass/bass-recap-poster.jpg"),
    alt: "A member dancing at Bring A Soul Sunday",
  },
  "sports-day": {
    clip: asset("sports/sports-tug-of-war.mp4"),
    still: asset("sports/sports-tug-of-war-poster.jpg"),
    alt: "The Sports Day tug of war",
  },
  "praise-night": {
    still: asset("praise/praise-night-crowd.jpg"),
    alt: "A packed hall singing at Praise Night",
  },
  camp: {
    still: asset("camp/aor-hands-raised.jpg"),
    alt: "Hands raised in worship at Agents of Revival camp",
  },
};
