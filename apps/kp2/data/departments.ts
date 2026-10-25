import { KP2_PHOTOS } from "@/lib/photography";
export type Department = {
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt?: string;
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
    image: KP2_PHOTOS.bassMusic.src,
    imageAlt: KP2_PHOTOS.bassMusic.alt,
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
    image: KP2_PHOTOS.bassDrama.src,
    imageAlt: KP2_PHOTOS.bassDrama.alt,
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
    imageAlt: "A KP2 spoken word performer ministering on stage",
    imagePosition: "50% 12%",
    accent: "bg-primary text-on-primary",
    icon: "record_voice_over",
    roles: ["Poets", "Writers", "Performers"],
    featured: true,
  },
  {
    name: "K-DANCERS",
    tagline: "WORSHIP IN MOTION",
    description: "Dance like David danced. Rehearse together. Minister together.",
    image: KP2_PHOTOS.bassDance.src,
    imageAlt: KP2_PHOTOS.bassDance.alt,
    accent: "bg-primary text-on-primary",
    icon: "directions_run",
    roles: ["Dancers", "Choreographers"],
  },
  {
    name: "CHOIR",
    tagline: "LIFT YOUR VOICE",
    description: "Voices that lead the room in worship. Get busy serving in song.",
    image: KP2_PHOTOS.serviceChoir.src,
    imageAlt: KP2_PHOTOS.serviceChoir.alt,
    accent: "bg-primary text-on-primary",
    icon: "music_note",
    roles: ["Singers", "Worship Leaders"],
  },
  {
    name: "USHERS",
    tagline: "SERVE AT THE DOOR",
    description: "Let everything be done in decency and order.",
    image: KP2_PHOTOS.welcomeGroup.src,
    imageAlt: KP2_PHOTOS.welcomeGroup.alt,
    accent: "bg-secondary-container text-[#151218]",
    icon: "door_sliding",
    roles: ["Door Greeters", "Seat Guides"],
  },
  {
    name: "HOST TEAM",
    tagline: "MAKE THEM FEEL AT HOME",
    description: "First-timers become family. Welcome them. Follow them up.",
    image: KP2_PHOTOS.welcomeSmile.src,
    imageAlt: KP2_PHOTOS.welcomeSmile.alt,
    imagePosition: "50% 25%",
    accent: "bg-primary text-on-primary",
    icon: "group",
    roles: ["Welcome Crew", "Follow-up"],
  },
  {
    name: "INSTRUMENTALISTS",
    tagline: "PLAY FOR HIS GLORY",
    description: "Guitars, drums, piano and more. Serve on the band. Get busy serving.",
    image: KP2_PHOTOS.serviceSaxophone.src,
    imageAlt: KP2_PHOTOS.serviceSaxophone.alt,
    accent: "bg-secondary-container text-[#151218]",
    icon: "piano",
    roles: ["Guitar", "Drums", "Piano"],
  },
  {
    name: "MEDIA",
    tagline: "CAPTURE THE WORD",
    description: "Camera, edit, and share a Christ-exalting message.",
    image: KP2_PHOTOS.serviceCamera.src,
    imageAlt: KP2_PHOTOS.serviceCamera.alt,
    accent: "bg-primary text-on-primary",
    icon: "videocam",
    roles: ["Camera", "Video", "Social"],
  },
  {
    name: "EVANGELISM",
    tagline: "PREACH CHRIST",
    description: "Our mandate is not to bring people to Christ. It is to bring Christ to people.",
    image: KP2_PHOTOS.outreachConversation.src,
    imageAlt: KP2_PHOTOS.outreachConversation.alt,
    imagePosition: "50% 42%",
    accent: "bg-secondary-container text-[#151218]",
    icon: "campaign",
    roles: ["Street Missions", "Community Projects"],
  },
  {
    name: "PRAYER",
    tagline: "STAND IN THE GAP",
    description: "Prayer births revival.",
    image: KP2_PHOTOS.servicePrayer.src,
    imageAlt: KP2_PHOTOS.servicePrayer.alt,
    imagePosition: KP2_PHOTOS.servicePrayer.position,
    accent: "bg-primary text-on-primary",
    icon: "prayer_times",
    roles: ["Intercession", "Night Vigils"],
  },
  {
    name: "EASY WORSHIP (SCRIPTURES AND LIGHTS)",
    tagline: "SCRIPTURE ON THE SCREENS",
    description: "Scriptures and lights for every gathering. Keep the Word in front of the room.",
    image: KP2_PHOTOS.serviceScreen.src,
    imageAlt: KP2_PHOTOS.serviceScreen.alt,
    imagePosition: KP2_PHOTOS.serviceScreen.position,
    accent: "bg-secondary-container text-[#151218]",
    icon: "lightbulb",
    roles: ["Scriptures", "Lights", "Stage"],
  },
  {
    name: "SOUND TEAM",
    tagline: "LIVE SOUND",
    description: "Mics, mixers, and live sound so the Word is heard clearly.",
    image: KP2_PHOTOS.serviceSound.src,
    imageAlt: KP2_PHOTOS.serviceSound.alt,
    accent: "bg-primary text-on-primary",
    icon: "graphic_eq",
    roles: ["Microphones", "Mixers", "Live Sound"],
  },
];
