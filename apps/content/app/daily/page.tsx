"use client";

import { DailyList } from "@/components/studio/daily-list";

export default function DailyReadingPage() {
  return (
    <DailyList
      kind="reading"
      title="Daily reading"
      description="Reading for the mobile app. The reference is what the phone opens in the Bible reader. Passage text comes from YouVersion, so it is not stored here."
    />
  );
}
