"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Cross,
  Flame,
  Globe,
  Heart,
  HeartHandshake,
  LockKeyhole,
  ScrollText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "heart-handshake": HeartHandshake,
  globe: Globe,
  users: Users,
  cross: Cross,
  flame: Flame,
  heart: Heart,
  shield: Shield,
  "shield-check": ShieldCheck,
  "shield-alert": ShieldAlert,
  "lock-keyhole": LockKeyhole,
  sparkles: Sparkles,
  "scroll-text": ScrollText,
};

type Props = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

export function ContentIcon({
  name,
  className = "h-7 w-7",
  strokeWidth = 1.75,
}: Props) {
  const Icon = MAP[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
