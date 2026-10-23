"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Input, Label } from "@/components/ui/input";
import { describeReadingReference, readingHint } from "@/lib/bible-reference";
import { listDaily } from "@/lib/content-repo";
import type { DailyEntryRow } from "@/lib/types";
import { hrefWithWorkspace } from "@/lib/workspaces";
import { useWorkspaceId } from "@/lib/workspace-context";

export default function BiblePage() {
  const workspace = useWorkspaceId();
  const [sample, setSample] = useState("John 3:16");
  const [rows, setRows] = useState<DailyEntryRow[] | null>(null);

  useEffect(() => {
    if (!workspace) return;
    listDaily(workspace, "reading")
      .then(setRows)
      .catch(() => setRows([]));
  }, [workspace]);

  if (!workspace) return <PickWorkspace />;

  const check = describeReadingReference(sample);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const upcoming = (rows ?? [])
    .filter((row) => (row.date ?? "").slice(0, 10) >= today)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
    .slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Bible"
        description="The phone loads passage text from YouVersion. This studio stores the reference on Daily Reading, and the app opens it in the Bible reader. The default translation is NIV. Verse text is not copied here."
      />
      <div className="max-w-xl">
        <Label htmlFor="bible-check">Check a reference</Label>
        <Input
          id="bible-check"
          value={sample}
          placeholder="Romans 8:1-11; Psalm 23"
          onChange={(event) => setSample(event.target.value)}
        />
        <p className={`mt-2 text-sm ${check.ok ? "text-muted-foreground" : "text-destructive"}`}>
          {readingHint(sample)}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold">Daily readings</h2>
        <Link
          href={hrefWithWorkspace("/daily", workspace)}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Edit readings
        </Link>
      </div>
      {rows === null ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading readings…</p>
      ) : upcoming.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No upcoming readings.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {upcoming.map((row) => {
            const parsed = describeReadingReference(row.reference ?? "");
            return (
              <li key={row.id} className="px-4 py-3">
                <p className="font-medium">
                  {(row.date ?? "").slice(0, 10)} · {row.title || "Untitled"}
                </p>
                <p
                  className={`text-sm ${parsed.ok ? "text-muted-foreground" : "text-destructive"}`}
                >
                  {row.reference?.trim()
                    ? parsed.ok
                      ? parsed.passages.join(", ")
                      : parsed.message
                    : "No reference, so the reader will not open a passage."}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
