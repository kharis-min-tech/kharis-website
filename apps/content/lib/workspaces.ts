import type { StudioRole } from "@/lib/studio-api";

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
  { href: "/department-videos", label: "Department Videos" },
  { href: "/sermons", label: "Sermons" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/visitors", label: "Visitors" },
  { href: "/messages", label: "Messages" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/users", label: "Users" },
];

const appNav: StudioNavItem[] = [
  { href: "/events", label: "Events" },
  { href: "/announcements", label: "Announcements" },
  { href: "/daily", label: "Daily Reading" },
  { href: "/daily-message", label: "Daily Message" },
  { href: "/daily-prayers", label: "Daily Prayers" },
  { href: "/bible", label: "Bible" },
  { href: "/sermon-library", label: "Sermon library" },
  { href: "/live", label: "Live" },
];

const kharisNav: StudioNavItem[] = [
  { href: "/branches", label: "Branches" },
  { href: "/department-videos", label: "Department Videos" },
  { href: "/events", label: "Events" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/featured-video", label: "Featured Video" },
  { href: "/announcements", label: "Announcements" },
  { href: "/messages", label: "Messages" },
];

const kp2Nav: StudioNavItem[] = [
  { href: "/branches", label: "Branches" },
  { href: "/department-videos", label: "Department Videos" },
  { href: "/events", label: "Events" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/announcements", label: "Announcements" },
  { href: "/messages", label: "Messages" },
  { href: "/newsletter", label: "Newsletter" },
];

export const WORKSPACES: StudioWorkspace[] = [
  {
    id: "general",
    name: "General",
    description:
      "Shared content: branches, sermons, testimonies, visitors, contact messages, newsletter emails, and studio users.",
    nav: generalNav,
  },
  {
    id: "app",
    name: "Mobile App",
    description:
      "App events, announcements, daily reading, daily messages, daily prayers, Bible references, the sermon library, and live stream.",
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
    description:
      "KP2 events, testimonies, announcements, contact messages, and newsletter emails for kharis.org/kp2.",
    nav: kp2Nav,
  },
];

export function workspaceById(id: string | null | undefined) {
  return WORKSPACES.find((workspace) => workspace.id === id) ?? null;
}

/** The only sections a branch admin can use. RLS scopes their rows to their branches. */
export const BRANCH_ADMIN_PAGES = ["/branches", "/events", "/messages", "/visitors"];

function listLabels(nav: StudioNavItem[]) {
  const labels = nav.map((item) => item.label);
  if (labels.length < 2) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}

/** Workspaces and sections the role can open. A workspace with nothing left is hidden. */
export function workspacesForRole(role: StudioRole): StudioWorkspace[] {
  if (role === "super_admin") return WORKSPACES;
  if (role !== "branch_admin") return [];
  return WORKSPACES.flatMap((workspace) => {
    const nav = workspace.nav.filter((item) => BRANCH_ADMIN_PAGES.includes(item.href));
    if (!nav.length) return [];
    return [{ ...workspace, nav, description: `${listLabels(nav)} for your branches.` }];
  });
}

/** Whether the role may open a studio path. Anything else redirects to /. */
export function canOpenPath(role: StudioRole, pathname: string) {
  if (role === "super_admin") return true;
  const workspaces = workspacesForRole(role);
  if (!workspaces.length) return false;
  if (pathname === "/") return true;
  if (pathname.startsWith("/workspace/")) {
    return workspaces.some((workspace) => pathname === `/workspace/${workspace.id}`);
  }
  return workspaces.some((workspace) =>
    workspace.nav.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
}

export function hrefWithWorkspace(href: string, workspace: WorkspaceId | null) {
  if (!workspace) return href;
  return `${href}?workspace=${workspace}`;
}
