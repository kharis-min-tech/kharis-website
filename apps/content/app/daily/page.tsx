"use client";

import { DailyList } from "@/components/studio/daily-list";

export default function DailyReadingPage() {
  return (
    <DailyList
      kind="reading"
      title="Daily reading"
      description="Reading for the mobile app. Each entry has a date, title, scripture reference, and body."
    />
  );
}
