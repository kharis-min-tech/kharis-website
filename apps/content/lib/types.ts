import type { WorkspaceId } from "@/lib/workspaces";

export type EventSite = "kharis" | "kp2" | "app" | "general";
export type EventCategory = "service" | "fellowship" | "conference" | "camp" | "general";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  branch_id: string | null;
  branch_name: string | null;
  start_time: string;
  end_time: string | null;
  recurrence: "none" | "weekly";
  recurrence_days: number[] | null;
  recurrence_until: string | null;
  is_featured: boolean | null;
  image_url: string | null;
  category: EventCategory | null;
  sites: EventSite[] | null;
  workspace: string | null;
};

export type SermonRow = {
  id: string;
  title: string;
  speaker: string | null;
  date: string | null;
  series: string | null;
  description: string | null;
  video_url: string | null;
  audio_url: string | null;
  thumbnail: string | null;
  published: boolean | null;
};

export type NewsRow = {
  id: string;
  workspace: string | null;
  title: string;
  body: string | null;
  image: string | null;
  published: boolean | null;
  created_at?: string | null;
};

export type TestimonyRow = {
  id: string;
  name: string;
  branch_name: string | null;
  category: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  is_anonymous: boolean | null;
  workspace: string | null;
  is_featured: boolean | null;
  is_featured_giving: boolean | null;
  is_published: boolean | null;
};

export type VisitorRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  branch: string | null;
  notes: string | null;
  created_at?: string | null;
};

export type DailyKind = "reading" | "prayer";

export type DailyEntryRow = {
  id: string;
  workspace: string | null;
  kind: DailyKind | null;
  date: string | null;
  title: string | null;
  body: string | null;
  reference: string | null;
};

export type DailyMessageRow = {
  id: string;
  date: string;
  sermon_id: string | null;
  note: string | null;
};

export type FeaturedVideoRow = {
  id: string;
  workspace: string | null;
  title: string | null;
  video_url: string | null;
  published: boolean | null;
};

export type ContactStatus = "new" | "read" | "archived";

export type ContactMessage = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  topic: string;
  branch: string | null;
  message: string;
  workspace: string;
  status: ContactStatus;
  created_at: string;
};

export type LiveSettings = {
  url: string;
  isLive: boolean;
  title: string;
};

export type BranchOption = {
  id: string;
  name: string;
};

export type WorkspaceScope = WorkspaceId;
