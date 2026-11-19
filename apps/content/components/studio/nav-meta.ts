import {
  BookOpen,
  CalendarDays,
  Church,
  Clapperboard,
  FileText,
  Globe,
  HeartHandshake,
  Inbox,
  LayoutGrid,
  Megaphone,
  Quote,
  Radio,
  Route,
  Smartphone,
  Sparkles,
  SunMedium,
  UserCog,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { WorkspaceId } from "@/lib/workspaces";

export const SECTION_ICONS: Record<string, LucideIcon> = {
  "/branches": Church,
  "/department-videos": Clapperboard,
  "/documents": FileText,
  "/testimonies": Quote,
  "/visitors": UserPlus,
  "/messages": Inbox,
  "/events": CalendarDays,
  "/announcements": Megaphone,
  "/daily": BookOpen,
  "/daily-message": SunMedium,
  "/daily-prayers": HeartHandshake,
  "/plans": Route,
  "/live": Radio,
  "/users": UserCog,
};

export const SECTION_HINTS: Record<string, string> = {
  "/branches": "Campuses, venues, service times and photos.",
  "/department-videos": "Ministry and department videos.",
  "/documents": "Governance and fasting PDF uploads.",
  "/testimonies": "Stories of what God has done. General lists every site.",
  "/visitors": "People who planned a visit.",
  "/messages": "Contact form inbox.",
  "/events": "Services, gatherings and weekly repeats.",
  "/announcements": "News and notices.",
  "/daily": "The scripture for each day.",
  "/daily-message": "A sermon scheduled for each day.",
  "/daily-prayers": "Prayer points for each day.",
  "/plans": "Multi-day programmes for the future app.",
  "/live": "Live stream link and status.",
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
