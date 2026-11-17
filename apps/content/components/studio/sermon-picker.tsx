"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { CatalogueSermon } from "@/lib/sermon-catalogue";
import { searchSermons } from "@/lib/sermon-search";
import { cn } from "@/lib/utils";

function sermonLine(sermon: CatalogueSermon) {
  return [sermon.speaker, sermon.date, sermon.scripture].filter(Boolean).join(" · ");
}

export function SermonPicker({
  picked,
  onPick,
  onClear,
  label = "Sermon",
  id = "sermon-search",
}: {
  picked: CatalogueSermon | null;
  onPick: (sermon: CatalogueSermon) => void;
  onClear: () => void;
  label?: string;
  id?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogueSermon[]>([]);
  const [searching, setSearching] = useState(false);
  const needle = query.trim();

  useEffect(() => {
    if (needle.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setSearching(true);
      searchSermons(needle)
        .then((sermons) => {
          if (!cancelled) setResults(sermons);
        })
        .catch((caught) => {
          if (!cancelled) {
            setResults([]);
            toast.error(caught instanceof Error ? caught.message : "Search failed.");
          }
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [needle]);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {picked ? (
        <div className="mb-3 rounded-xl border border-primary/40 bg-primary/5 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium">{picked.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {sermonLine(picked) || "From the sermon catalogue"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClear();
                setQuery("");
                setResults([]);
              }}
            >
              Change
            </Button>
          </div>
        </div>
      ) : (
        <p className="mb-2 text-xs text-muted-foreground">
          Search the catalogue by title, speaker, or scripture, then choose a sermon.
        </p>
      )}
      <Input
        id={id}
        value={query}
        placeholder="Search title, speaker or scripture"
        onChange={(event) => setQuery(event.target.value)}
      />
      {searching ? (
        <p className="mt-2 text-xs text-muted-foreground">Searching the catalogue…</p>
      ) : null}
      {!searching && needle.length >= 2 && results.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No sermons match “{needle}”.</p>
      ) : null}
      {results.length > 0 ? (
        <ul className="mt-2 max-h-80 overflow-auto rounded-xl border border-border bg-card">
          {results.map((sermon) => {
            const selected = picked?.id === sermon.id;
            return (
              <li key={sermon.id} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  className={cn(
                    "w-full px-3 py-3 text-left transition-colors hover:bg-accent",
                    selected && "bg-primary/10",
                  )}
                  onClick={() => {
                    onPick(sermon);
                    setQuery("");
                    setResults([]);
                  }}
                >
                  <span className="block font-medium">{sermon.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {sermon.speaker ? <span>{sermon.speaker}</span> : null}
                    {sermon.date ? <span>{sermon.date}</span> : null}
                    {sermon.scripture ? (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-foreground">
                        {sermon.scripture}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
