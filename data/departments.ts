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
      "Our music arm — vocalists, rappers and instrumentalists leading the room into worship with a sound that's unapologetically ours.",
    image: "/assets/K-music-img.jpg",
    accent: "bg-primary",
    icon: "music_note",
    roles: ["Vocalists", "Rappers", "Instrumentalists"],
    featured: true,
  },
  {
    name: "K-DRAMA",
    tagline: "STORY THAT MOVES",
    description:
      "Sketches, skits and stage productions that preach without a pulpit — telling the gospel through story and performance.",
    image: "/assets/K-drama-img.jpg",
    accent: "bg-secondary-container",
    icon: "theater_comedy",
    roles: ["Actors", "Scriptwriters", "Stage Crew"],
    featured: true,
  },
  {
    name: "SPOKEN WORD",
    tagline: "WORDS WITH WEIGHT",
    description:
      "Poetry and prophetic declaration. If you write, you speak, you carry a message — this is where it lands.",
    image: "/assets/Spoken-word.jpg",
    accent: "bg-primary-fixed-dim",
    icon: "record_voice_over",
    roles: ["Poets", "Writers", "Performers"],
    featured: true,
  },
  {
    name: "K-DANCERS",
    tagline: "WORSHIP IN MOTION",
    description:
      "Choreography and movement that carries the message. Rehearse together, minister together, move as one.",
    image: "/assets/K-dancers-img.jpg",
    accent: "bg-primary",
    icon: "directions_run",
    roles: ["Dancers", "Choreographers", "Creative Leads"],
  },
  {
    name: "CHOIR",
    tagline: "LIFT YOUR VOICE",
    description:
      "Join the voices that carry our worship. Rehearse weekly and lead the congregation into God's presence through song.",
    image: "/assets/events-sunday-service.jpg",
    accent: "bg-primary",
    icon: "music_note",
    roles: ["Singers", "Worship Leaders", "Backup Vocals"],
  },
  {
    name: "USHERS",
    tagline: "SERVE AT THE DOOR",
    description:
      "Be the first welcoming face people see. Guide, assist and create order so every guest can focus on encountering God.",
    image: "/assets/worship.jpg",
    accent: "bg-secondary-container",
    icon: "door_sliding",
    roles: ["Door Greeters", "Seat Guides", "Collections"],
  },
  {
    name: "HOST TEAM",
    tagline: "MAKE THEM FEEL AT HOME",
    description:
      "Turn first-timers into family. Hospitality, connection and follow-up that makes every visitor feel known and valued.",
    image: "/assets/serve-with-us.jpg",
    accent: "bg-primary-fixed-dim",
    icon: "group",
    roles: ["Welcome Crew", "Follow-up", "First-timers"],
  },

  {
    name: "WORSHIP & MUSIC",
    tagline: "SOUND & SPIRIT",
    description:
      "Lead the congregation into the presence of God through passionate music and creative expression.",
    image: "/assets/worship.jpg",
    accent: "bg-secondary-container",
    icon: "music_note",
    roles: ["Vocalists & Musicians", "Choir Coordination", "Weekly Rehearsals"],
  },
  {
    name: "MEDIA",
    tagline: "DIGITAL LIGHT",
    description:
      "Capturing moments and amplifying the message across all digital platforms.",
image: "/assets/branch-slide-2.jpg",
    accent: "bg-primary-fixed-dim",
    icon: "videocam",
    roles: ["Camera & Video", "Post Production", "Social Media"],
  },
  {
    name: "EVANGELISM",
    tagline: "OUTREACH",
    description:
      "Taking the gospel to the streets and building bridges in our city.",
    image: "/assets/community.jpg",
    accent: "bg-outline-variant",
    icon: "campaign",
    roles: ["Street Missions", "Community Projects", "Campus Outreach"],
  },
  {
    name: "INTERCESSORY",
    tagline: "PRAYER BACKBONE",
    description:
      "Standing in the gap through prayer and intercession for the church, the city and the nations.",
    image: "/assets/events-thursday-service.jpg",
    accent: "bg-primary",
    icon: "prayer_times",
    roles: ["Prayer Warriors", "Night Vigils", "Intercession Hubs"],
  },
  {
    name: "TECHNICAL",
    tagline: "BEHIND THE SCENES",
    description:
      "Sound, lights and stage — the crew that makes every service run without a hitch.",
    image: "/assets/events-hero-worship.jpg",
    accent: "bg-secondary-container",
    icon: "settings",
    roles: ["Sound Engineers", "Lighting", "Stage Setup"],
  },
  {
    name: "CHILDREN'S MINISTRY",
    tagline: "NEXT GENERATION",
    description:
      "Helping kids discover faith in a fun, safe and age-appropriate environment.",
    image: "/assets/young-adults.jpg",
    accent: "bg-primary-fixed-dim",
    icon: "child_care",
    roles: ["Kids Teachers", "Helpers", "Safeguarding"],
  },
];
