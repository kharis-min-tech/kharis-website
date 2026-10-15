export type Department = {
  name: string;
  tagline: string;
  description: string;
  image: string;
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
    image: "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/K-music-img.jpg",
    accent: "bg-primary",
    icon: "music_note",
    roles: ["Vocalists", "Rappers"],
    featured: true,
  },
  {
    name: "K-DRAMA",
    tagline: "STORY THAT MOVES",
    description:
      "Sketches and stage work that tell the gospel. Christ-exalting, text-driven drama.",
    image: "https://images.kharis.org/site-images/kp2/4cdb8d19355fced2/K-drama-img.jpg",
    accent: "bg-secondary-container",
    icon: "theater_comedy",
    roles: ["Actors", "Scriptwriters", "Stage Crew"],
    featured: true,
  },
  {
    name: "SPOKEN WORD",
    tagline: "WORDS WITH WEIGHT",
    description: "Poetry that carries the Word. We are passionate about God and His word.",
    image: "https://images.kharis.org/site-images/kp2/ffbe5aca25d25b8c/Spoken-word.jpg",
    accent: "bg-primary-fixed-dim",
    icon: "record_voice_over",
    roles: ["Poets", "Writers", "Performers"],
    featured: true,
  },
  {
    name: "K-DANCERS",
    tagline: "WORSHIP IN MOTION",
    description: "Dance like David danced. Rehearse together. Minister together.",
    image: "https://images.kharis.org/site-images/kp2/8440a4a63e4ae020/K-dancers-img.jpg",
    accent: "bg-primary",
    icon: "directions_run",
    roles: ["Dancers", "Choreographers"],
  },
  {
    name: "CHOIR",
    tagline: "LIFT YOUR VOICE",
    description: "Voices that lead the room in worship. Get busy serving in song.",
    image: "https://images.kharis.org/site-images/kp2/d6b67a1d5d3003b0/events-sunday-service.jpg",
    accent: "bg-primary",
    icon: "music_note",
    roles: ["Singers", "Worship Leaders"],
  },
  {
    name: "USHERS",
    tagline: "SERVE AT THE DOOR",
    description: "Let everything be done in decency and order.",
    image: "https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg",
    accent: "bg-secondary-container",
    icon: "door_sliding",
    roles: ["Door Greeters", "Seat Guides"],
  },
  {
    name: "HOST TEAM",
    tagline: "MAKE THEM FEEL AT HOME",
    description: "First-timers become family. Welcome them. Follow them up.",
    image: "https://images.kharis.org/site-images/kp2/8440a4a63e4ae020/serve-with-us.jpg",
    accent: "bg-primary-fixed-dim",
    icon: "group",
    roles: ["Welcome Crew", "Follow-up"],
  },
  {
    name: "INSTRUMENTALISTS",
    tagline: "PLAY FOR HIS GLORY",
    description: "Guitars, drums, piano and more. Serve on the band. Get busy serving.",
    image: "https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg",
    accent: "bg-secondary-container",
    icon: "piano",
    roles: ["Guitar", "Drums", "Piano"],
  },
  {
    name: "MEDIA",
    tagline: "CAPTURE THE WORD",
    description: "Camera, edit, and share a Christ-exalting message.",
    image: "https://images.kharis.org/site-images/kp2/79f53822455f01b0/branch-slide-2.jpg",
    accent: "bg-primary-fixed-dim",
    icon: "videocam",
    roles: ["Camera", "Video", "Social"],
  },
  {
    name: "EVANGELISM",
    tagline: "PREACH CHRIST",
    description: "Our mandate is not to bring people to Christ. It is to bring Christ to people.",
    image: "https://images.kharis.org/site-images/kp2/ca1bcf57dbf80629/community.jpg",
    accent: "bg-outline-variant",
    icon: "campaign",
    roles: ["Street Missions", "Community Projects"],
  },
  {
    name: "PRAYER",
    tagline: "STAND IN THE GAP",
    description: "Prayer births revival.",
    image: "https://images.kharis.org/site-images/kp2/dd56ea86ee00aa8d/events-thursday-service.jpg",
    accent: "bg-primary",
    icon: "prayer_times",
    roles: ["Intercession", "Night Vigils"],
  },
  {
    name: "EASY WORSHIP (SCRIPTURES AND LIGHTS)",
    tagline: "SCRIPTURE ON THE SCREENS",
    description: "Scriptures and lights for every gathering. Keep the Word in front of the room.",
    image: "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/events-hero-worship.jpg",
    accent: "bg-secondary-container",
    icon: "lightbulb",
    roles: ["Scriptures", "Lights", "Stage"],
  },
  {
    name: "SOUND TEAM",
    tagline: "LIVE SOUND",
    description: "Mics, mixers, and live sound so the Word is heard clearly.",
    image: "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/events-hero-worship.jpg",
    accent: "bg-primary",
    icon: "graphic_eq",
    roles: ["Microphones", "Mixers", "Live Sound"],
  },
];
