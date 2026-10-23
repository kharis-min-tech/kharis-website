"use client";

import { DailyList } from "@/components/studio/daily-list";

export default function DailyReadingPage() {
  return (
    <DailyList
      kind="reading"
      title="Daily reading"
      description="Pick a book and chapter for the phone. YouVersion sends the verse text to the reader, so it is not stored here. Verses are optional."
    />
  );
}
