"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { VideoDrop } from "@/components/studio/image-drop";
import { PageHeader } from "@/components/studio/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENTS, listDepartmentVideos, saveDepartmentVideo } from "@/lib/department-videos";

export default function DepartmentVideosPage() {
  const [savedUrls, setSavedUrls] = useState<Record<string, string> | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError("");
    listDepartmentVideos()
      .then((map) => {
        if (cancelled) return;
        setSavedUrls(map);
      })
      .catch((caught) => {
        if (cancelled) return;
        setSavedUrls({});
        setError(caught instanceof Error ? caught.message : "Could not load department videos.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return DEPARTMENTS;
    return DEPARTMENTS.filter((dept) =>
      `${dept.key} ${dept.description}`.toLowerCase().includes(needle),
    );
  }, [query]);

  async function handleUpdateVideo(key: string, nextUrl: string) {
    try {
      await saveDepartmentVideo(key, nextUrl);
      setSavedUrls((prev) => ({ ...(prev ?? {}), [key]: nextUrl }));
      toast.success(nextUrl ? `Saved ${key} video` : `Removed ${key} video`);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Videos"
        description="Upload the 24 ministry department videos shown on the Department Discovery Quiz (/quiz). Drop a video file (.mp4 or .mov) from Finder / iCloud or click to browse."
      />

      <div className="max-w-sm">
        <Input
          placeholder="Search 24 departments..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {savedUrls === null ? (
        <div className="space-y-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {visible.map((dept) => {
            const currentUrl = (savedUrls[dept.key] ?? "").trim();
            const hasVideo = Boolean(currentUrl);

            return (
              <div key={dept.key} className="space-y-3 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{dept.key}</p>
                      <Badge tone={hasVideo ? "accent" : "muted"}>
                        {hasVideo ? "Video uploaded" : "No video"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{dept.description}</p>
                  </div>
                </div>

                <VideoDrop
                  value={currentUrl}
                  folder="department-videos"
                  onChange={(url) => handleUpdateVideo(dept.key, url)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
