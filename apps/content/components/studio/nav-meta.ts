import {
  BookMarked,
  BookOpen,
  CalendarDays,
  Church,
  Clapperboard,
  Globe,
  HeartHandshake,
  Inbox,
  LayoutGrid,
  Library,
  Mail,
  Megaphone,
  Mic,
  Quote,
  Radio,
  Smartphone,
  Sparkles,
  SunMedium,
  UserCog,
  UserPlus,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { WorkspaceId } from "@/lib/workspaces";

export const SECTION_ICONS: Record<string, LucideIcon> = {
  "/branches": Church,
  "/department-videos": Clapperboard,
  "/sermons": Mic,
  "/testimonies": Quote,
  "/visitors": UserPlus,
  "/messages": Inbox,
  "/newsletter": Mail,
  "/events": CalendarDays,
  "/announcements": Megaphone,
  "/daily": BookOpen,
  "/daily-message": SunMedium,
  "/daily-prayers": HeartHandshake,
  "/bible": BookMarked,
  "/sermon-library": Library,
  "/live": Radio,
  "/featured-video": Video,
  "/users": UserCog,
};

export const SECTION_HINTS: Record<string, string> = {
  "/branches": "Campuses, venues, service times and photos.",
  "/department-videos": "Ministry and department videos.",
  "/sermons": "Sermon records shown on the websites.",
  "/testimonies": "Stories of what God has done.",
  "/visitors": "People who planned a visit.",
  "/messages": "Contact form inbox.",
  "/newsletter": "Emails from the newsletter signup.",
  "/events": "Services, gatherings and weekly repeats.",
  "/announcements": "News and notices.",
  "/daily": "The scripture for each day.",
  "/daily-message": "A sermon scheduled for each day.",
  "/daily-prayers": "Prayer points for each day.",
  "/bible": "Check a Bible reference.",
  "/sermon-library": "Search the app's sermon library.",
  "/live": "Live stream link and status.",
  "/featured-video": "The video on the home page.",
  "/users": "Studio accounts, roles and branches.",
};

export const WORKSPACE_ICONS: Record<WorkspaceId, LucideIcon> = {
  general: LayoutGrid,
  app: Smartphone,
  kharis: Globe,
  kp2: Sparkles,
};

export function sectionIcon(href: string) {
  return SECTION_ICONS[href] ?? BookOpen;
}
