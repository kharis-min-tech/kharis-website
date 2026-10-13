export const WORKSPACE_IDS = ["general", "app", "kharis", "kp2"] as const;

export type WorkspaceId = (typeof WORKSPACE_IDS)[number];

export function isWorkspaceId(value: string | null | undefined): value is WorkspaceId {
  return WORKSPACE_IDS.includes(value as WorkspaceId);
}

export type StudioNavItem = {
  href: string;
  label: string;
};

export type StudioWorkspace = {
  id: WorkspaceId;
  name: string;
  description: string;
  nav: StudioNavItem[];
};

const generalNav: StudioNavItem[] = [
  { href: "/branches", label: "Branches" },
  { href: "/sermons", label: "Sermons" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/visitors", label: "Visitors" },
  { href: "/messages", label: "Messages" },
];

const appNav: StudioNavItem[] = [
  { href: "/events", label: "Events" },
  { href: "/announcements", label: "Announcements" },
  { href: "/daily", label: "Daily Reading" },
  { href: "/daily-message", label: "Daily Message" },
  { href: "/daily-prayers", label: "Daily Prayers" },
  { href: "/live", label: "Live" },
];

const kharisNav: StudioNavItem[] = [
  { href: "/events", label: "Events" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/featured-video", label: "Featured Video" },
  { href: "/announcements", label: "Announcements" },
  { href: "/messages", label: "Messages" },
];

const kp2Nav: StudioNavItem[] = [
  { href: "/events", label: "Events" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/announcements", label: "Announcements" },
  { href: "/messages", label: "Messages" },
];

export const WORKSPACES: StudioWorkspace[] = [
  {
    id: "general",
    name: "General",
    description: "Shared content: branches, sermons, testimonies, visitors, and contact messages.",
    nav: generalNav,
  },
  {
    id: "app",
    name: "Mobile App",
    description:
      "App events, announcements, daily reading, daily messages, daily prayers, and live stream.",
    nav: appNav,
  },
  {
    id: "kharis",
    name: "Kharis Website",
    description:
      "Website events, testimonies, featured video, announcements, and contact messages for kharis.org.",
    nav: kharisNav,
  },
  {
    id: "kp2",
    name: "KP2 Website",
    description: "KP2 events, testimonies, announcements, and contact messages for kharis.org/kp2.",
    nav: kp2Nav,
  },
];

export function workspaceById(id: string | null | undefined) {
  return WORKSPACES.find((workspace) => workspace.id === id) ?? null;
}

export function hrefWithWorkspace(href: string, workspace: WorkspaceId | null) {
  if (!workspace) return href;
  return `${href}?workspace=${workspace}`;
}
