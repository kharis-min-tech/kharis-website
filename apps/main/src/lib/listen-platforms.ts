export type ListenPlatform = {
  id: string;
  name: string;
  href: string;
  hint: string;
};

/** Where the congregation can catch Messages by David Antwi */
export const LISTEN_PLATFORMS: ListenPlatform[] = [
  {
    id: "soundcloud",
    name: "SoundCloud",
    href: "https://soundcloud.com/kharismedia",
    hint: "Stream teaching",
  },
  {
    id: "apple",
    name: "Apple Podcasts",
    href: "https://podcasts.apple.com/gb/podcast/messages-by-david-antwi/id1069725119",
    hint: "Subscribe on iPhone",
  },
  {
    id: "spotify",
    name: "Spotify",
    href: "https://open.spotify.com/show/6EfmpLAHngHDBsLjrQwnS7",
    hint: "Listen anytime",
  },
  {
    id: "youtube",
    name: "YouTube",
    href: "https://www.youtube.com/@davidantwi",
    hint: "Watch every message",
  },
  {
    id: "amazon",
    name: "Amazon Music",
    href: "https://music.amazon.com/search/Messages%20by%20David%20Antwi",
    hint: "On Amazon devices",
  },
];
