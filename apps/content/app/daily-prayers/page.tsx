"use client";

import { DailyList } from "@/components/studio/daily-list";

export default function DailyPrayersPage() {
  return (
    <DailyList
      kind="prayer"
      title="Daily prayers"
      description="Prayer for the mobile app. Same shape as daily reading, stored separately."
    />
  );
}
