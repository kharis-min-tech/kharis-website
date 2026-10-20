export type Department = {
  name: string;
  tagline: string;
  description: string;
  image: string;
  imagePosition?: string;
  accent: string;
  icon: string;
  roles: string[];
  featured?: boolean;
};

export const DEPARTMENTS: Department[] = [
  {
    name: "K-MUSIC",
    tagline: "SOUND OF A NEW BREED",
    description:
      "Vocalists and rappers who preach Christ crucified through song. Get busy serving.",
    image: "/kp2/assets/praise-singer-on-stage.jpg",
    accent: "bg-primary text-on-primary",
    icon: "music_note",
    roles: ["Vocalists", "Rappers"],
    featured: true,
  },
  {
    name: "K-DRAMA",
    tagline: "STORY THAT MOVES",
    description:
      "Sketches and stage work that tell the gospel. Christ-exalting, text-driven drama.",
    image: "/kp2/assets/two-sides-of-the-cross-drama.jpg",
    accent: "bg-secondary-container text-[#151218]",
    icon: "theater_comedy",
    roles: ["Actors", "Scriptwriters", "Stage Crew"],
    featured: true,
  },
  {
    name: "SPOKEN WORD",
    tagline: "WORDS WITH WEIGHT",
    description: "Poetry that carries the Word. We are passionate about God and His word.",
    image: "/kp2/assets/spoken-word-performer.jpg",
    imagePosition: "50% 12%",
    accent: "bg-primary-fixed-dim text-on-primary-fixed",
    icon: "record_voice_over",
    roles: ["Poets", "Writers", "Performers"],
    featured: true,
  },
  {
    name: "K-DANCERS",
    tagline: "WORSHIP IN MOTION",
    description: "Dance like David danced. Rehearse together. Minister together.",
    image: "https://images.kharis.org/site-images/kp2/8440a4a63e4ae020/K-dancers-img.jpg",
    accent: "bg-primary text-on-primary",
    icon: "directions_run",
    roles: ["Dancers", "Choreographers"],
  },
  {
    name: "CHOIR",
    tagline: "LIFT YOUR VOICE",
    description: "Voices that lead the room in worship. Get busy serving in song.",
    image: "/kp2/assets/choir-ministering.jpg",
    accent: "bg-primary text-on-primary",
    icon: "music_note",
    roles: ["Singers", "Worship Leaders"],
  },
  {
    name: "USHERS",
    tagline: "SERVE AT THE DOOR",
    description: "Let everything be done in decency and order.",
    image: "https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg",
    accent: "bg-secondary-container text-[#151218]",
    icon: "door_sliding",
    roles: ["Door Greeters", "Seat Guides"],
  },
  {
    name: "HOST TEAM",
    tagline: "MAKE THEM FEEL AT HOME",
    description: "First-timers become family. Welcome them. Follow them up.",
    image: "/kp2/assets/friends-arriving-at-church.jpg",
    imagePosition: "50% 25%",
    accent: "bg-primary-fixed-dim text-on-primary-fixed",
    icon: "group",
    roles: ["Welcome Crew", "Follow-up"],
  },
  {
    name: "INSTRUMENTALISTS",
    tagline: "PLAY FOR HIS GLORY",
    description: "Guitars, drums, piano and more. Serve on the band. Get busy serving.",
    image: "/kp2/assets/saxophonist.jpg",
    accent: "bg-secondary-container text-[#151218]",
    icon: "piano",
    roles: ["Guitar", "Drums", "Piano"],
  },
  {
    name: "MEDIA",
    tagline: "CAPTURE THE WORD",
    description: "Camera, edit, and share a Christ-exalting message.",
    image: "/kp2/assets/hall-with-camera-crew.jpg",
    accent: "bg-primary-fixed-dim text-on-primary-fixed",
    icon: "videocam",
    roles: ["Camera", "Video", "Social"],
  },
  {
    name: "EVANGELISM",
    tagline: "PREACH CHRIST",
    description: "Our mandate is not to bring people to Christ. It is to bring Christ to people.",
    image: "/kp2/assets/bring-a-soul-flyers.jpg",
    imagePosition: "50% 42%",
    accent: "bg-outline-variant text-on-surface",
    icon: "campaign",
    roles: ["Street Missions", "Community Projects"],
  },
  {
    name: "PRAYER",
    tagline: "STAND IN THE GAP",
    description: "Prayer births revival.",
    image: "/kp2/assets/young-woman-praying.jpg",
    imagePosition: "50% 30%",
    accent: "bg-primary text-on-primary",
    icon: "prayer_times",
    roles: ["Intercession", "Night Vigils"],
  },
  {
    name: "EASY WORSHIP (SCRIPTURES AND LIGHTS)",
    tagline: "SCRIPTURE ON THE SCREENS",
    description: "Scriptures and lights for every gathering. Keep the Word in front of the room.",
    image: "/kp2/assets/grand-hall-wide-shot.jpg",
    imagePosition: "50% 62%",
    accent: "bg-secondary-container text-[#151218]",
    icon: "lightbulb",
    roles: ["Scriptures", "Lights", "Stage"],
  },
  {
    name: "SOUND TEAM",
    tagline: "LIVE SOUND",
    description: "Mics, mixers, and live sound so the Word is heard clearly.",
    image: "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/events-hero-worship.jpg",
    accent: "bg-primary text-on-primary",
    icon: "graphic_eq",
    roles: ["Microphones", "Mixers", "Live Sound"],
  },
];
