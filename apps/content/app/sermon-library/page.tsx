"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Input, Label } from "@/components/ui/input";
import { searchSermons } from "@/lib/sermon-search";
import type { CatalogueSermon } from "@/lib/sermon-catalogue";
import { useWorkspaceId } from "@/lib/workspace-context";

export default function SermonLibraryPage() {
  const workspace = useWorkspaceId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogueSermon[]>([]);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const needle = query.trim();
    if (needle.length < 2) {
      setResults([]);
      setError("");
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setSearching(true);
      searchSermons(needle)
        .then((sermons) => {
          if (cancelled) return;
          setResults(sermons);
          setError("");
        })
        .catch((caught) => {
          if (cancelled) return;
          setResults([]);
          setError(caught instanceof Error ? caught.message : "Search failed.");
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  if (!workspace) return <PickWorkspace />;

  return (
    <div>
      <PageHeader
        title="Sermon library"
        description="The messages the mobile app plays. They are mirrored into Cloudflare from the church sermon host, including audio, video and transcripts. Schedule one for a day under Daily Message. This list is not the General sermon records."
      />
      <div className="max-w-xl">
        <Label htmlFor="catalogue-search">Search</Label>
        <Input
          id="catalogue-search"
          value={query}
          placeholder="Title, speaker or scripture"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {searching ? <p className="mt-4 text-sm text-muted-foreground">Searching…</p> : null}
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      {results.length > 0 ? (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {results.map((sermon) => (
            <li key={sermon.id} className="px-4 py-3">
              <p className="font-medium">{sermon.title}</p>
              <p className="text-sm text-muted-foreground">
                {[sermon.speaker, sermon.date, sermon.scripture, sermon.series]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
