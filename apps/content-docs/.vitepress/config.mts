import { defineConfig, type DefaultTheme } from "vitepress";
import { iconSvg, type IconName } from "./icons";

type Page = [text: string, link: string, icon: IconName];

const groups: { text: string; items: Page[] }[] = [
  {
    text: "Getting Started",
    items: [
      ["Introduction", "/getting-started/introduction", "layers"],
      ["What is Content Studio?", "/getting-started/what-is-content-studio", "help"],
      ["Core Concepts", "/getting-started/core-concepts", "bulb"],
      ["Signing In", "/getting-started/signing-in", "login"],
      ["Roles & Permissions", "/getting-started/roles-permissions", "shield"],
    ],
  },
  {
    text: "Studio",
    items: [
      ["Overview", "/studio/overview", "gauge"],
      ["Workspaces", "/studio/workspaces", "grid"],
      ["Branches", "/studio/branches", "church"],
      ["Events", "/studio/events", "calendar"],
      ["Announcements", "/studio/announcements", "megaphone"],
      ["Testimonies", "/studio/testimonies", "quote"],
      ["Messages", "/studio/messages", "inbox"],
      ["Visitors", "/studio/visitors", "userPlus"],
      ["Newsletter", "/studio/newsletter", "mail"],
      ["Sermons", "/studio/sermons", "mic"],
      ["Department Videos", "/studio/department-videos", "clapper"],
      ["Featured Video", "/studio/featured-video", "video"],
      ["Ask Grace", "/studio/ask-grace", "chat"],
    ],
  },
  {
    text: "Mobile App",
    items: [
      ["Daily Reading", "/mobile-app/daily-reading", "book"],
      ["Daily Message", "/mobile-app/daily-message", "sun"],
      ["Daily Prayers", "/mobile-app/daily-prayers", "prayer"],
      ["Bible", "/mobile-app/bible", "bible"],
      ["Sermon Library", "/mobile-app/sermon-library", "library"],
      ["Live", "/mobile-app/live", "radio"],
    ],
  },
  {
    text: "Guides",
    items: [
      ["Adding a Branch", "/guides/adding-a-branch", "plus"],
      ["Publishing an Event", "/guides/publishing-an-event", "send"],
      ["Images & Video", "/guides/images-and-video", "image"],
      ["Working the Inbox", "/guides/working-the-inbox", "inbox"],
      ["Where Content Appears", "/guides/where-content-appears", "map"],
    ],
  },
  {
    text: "Administration",
    items: [
      ["Users", "/administration/users", "userCog"],
      ["Access Reference", "/administration/access-reference", "key"],
      ["Troubleshooting", "/administration/troubleshooting", "wrench"],
    ],
  },
  {
    text: "More",
    items: [
      ["FAQ", "/more/faq", "help"],
      ["Release Notes", "/more/release-notes", "scroll"],
    ],
  },
];

const sidebar: DefaultTheme.SidebarItem[] = groups.map((group) => ({
  text: group.text,
  collapsed: false,
  items: group.items.map(([text, link, icon]) => ({ text: `${iconSvg(icon)}${text}`, link })),
}));

const nav: DefaultTheme.NavItem[] = groups
  .filter((group) => group.text !== "More")
  .map((group) => ({
    text: group.text,
    activeMatch: `^${group.items[0][1].split("/").slice(0, 2).join("/")}/`,
    items: group.items.map(([text, link]) => ({ text, link })),
  }));

export default defineConfig({
  lang: "en-GB",
  title: "Content Studio",
  description: "Content management for Kharis Church: documentation for the Content Studio.",
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/favicon.png" }],
    ["meta", { name: "theme-color", content: "#6D28D9", media: "(prefers-color-scheme: light)" }],
    ["meta", { name: "theme-color", content: "#0a0a0a", media: "(prefers-color-scheme: dark)" }],
    ["meta", { name: "robots", content: "noindex, nofollow" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  ],
  themeConfig: {
    siteTitle: "Content Studio",
    nav,
    sidebar,
    outline: { level: [2, 3], label: "On this page" },
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/kharis-min-tech/kharis-website" }],
    docFooter: { prev: "Previous", next: "Next" },
    footer: {
      message:
        'Content Studio: Content Management by Kharis Church · <a href="https://content.kharis.org">Open the studio</a> · <a href="https://docs.kairos.kharis.org">Kairos docs</a>',
    },
  },
});
