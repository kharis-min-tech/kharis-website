"use client";

import type { ChurchEvent } from "@/lib/events";
import { EventBook } from "./EventBook";
import { MoreIssues } from "./MoreIssues";
import { YourChapter } from "./YourChapter";
import "./life-book.css";

/**
 * Life at Kharis Phase 2, as a comic book you read from cover to back cover:
 * cover → contents → events → more adventures → your chapter.
 */
export function LifeBook({ events }: { events: ChurchEvent[] }) {
  return (
    <div className="lb">
      <EventBook />
      <MoreIssues />
      <YourChapter events={events} />
    </div>
  );
}
