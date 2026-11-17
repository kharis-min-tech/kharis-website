"use client";

import {
  bibleBooks,
  passageFromReference,
  readingHint,
  referenceFromPassage,
} from "@/lib/bible-reference";
import { Input, Label, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FALLBACK = { book: "John", chapter: 1, verseStart: null, verseEnd: null };

type Scope = "chapter" | "verses";

export function PassagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const books = bibleBooks();
  const pick = passageFromReference(value) ?? FALLBACK;
  const book =
    books.find((item) => item.name === pick.book) ?? books.find((item) => item.name === "John");
  const chapters = book?.chapters ?? 1;
  const singleChapter = chapters === 1;
  const scope: Scope = pick.verseStart == null ? "chapter" : "verses";

  function write(next: {
    book?: string;
    chapter?: number;
    verseStart?: number | null;
    verseEnd?: number | null;
  }) {
    const name = next.book ?? pick.book;
    const chosen = books.find((item) => item.name === name);
    const limit = chosen?.chapters ?? 1;
    const chapter = Math.min(Math.max(1, next.chapter ?? pick.chapter), limit);
    onChange(
      referenceFromPassage({
        book: name,
        chapter,
        verseStart: next.verseStart === undefined ? pick.verseStart : next.verseStart,
        verseEnd: next.verseEnd === undefined ? pick.verseEnd : next.verseEnd,
      }),
    );
  }

  function setScope(next: Scope) {
    if (next === "chapter") {
      write({ verseStart: null, verseEnd: null });
      return;
    }
    write({ verseStart: pick.verseStart ?? 1, verseEnd: pick.verseEnd });
  }

  function verseNumber(raw: string) {
    if (!raw.trim()) return null;
    const number = Number(raw);
    if (!Number.isInteger(number) || number < 1) return null;
    return number;
  }

  return (
    <div>
      <Label>Passage</Label>
      <div
        role="tablist"
        aria-label="Passage scope"
        className="mb-3 inline-flex rounded-lg border border-border bg-card p-0.5"
      >
        {(
          [
            { id: "chapter" as const, label: "Whole chapter" },
            { id: "verses" as const, label: "Verses" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={scope === item.id}
            onClick={() => setScope(item.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground",
              scope === item.id && "bg-brand-soft text-brand hover:text-brand",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(6rem,0.6fr)]">
        <Select
          aria-label="Bible book"
          value={book?.name ?? "John"}
          onChange={(event) => {
            write({
              book: event.target.value,
              chapter: 1,
              verseStart: scope === "chapter" ? null : pick.verseStart,
              verseEnd: scope === "chapter" ? null : pick.verseEnd,
            });
          }}
        >
          <optgroup label="Old Testament">
            {books
              .filter((item) => item.testament === "Old Testament")
              .map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="New Testament">
            {books
              .filter((item) => item.testament === "New Testament")
              .map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
          </optgroup>
        </Select>
        <Select
          aria-label="Chapter"
          value={String(Math.min(pick.chapter, chapters))}
          disabled={singleChapter}
          onChange={(event) => write({ chapter: Number(event.target.value) })}
        >
          {Array.from({ length: chapters }, (_, index) => index + 1).map((chapter) => (
            <option key={chapter} value={chapter}>
              {singleChapter ? "Chapter 1" : `Chapter ${chapter}`}
            </option>
          ))}
        </Select>
      </div>
      {scope === "verses" ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="passage-verse-start">Verse from</Label>
            <Input
              id="passage-verse-start"
              inputMode="numeric"
              placeholder="e.g. 16"
              value={pick.verseStart ?? ""}
              onChange={(event) => {
                const verseStart = verseNumber(event.target.value);
                write({
                  verseStart,
                  verseEnd: verseStart == null ? null : pick.verseEnd,
                });
              }}
            />
          </div>
          <div>
            <Label htmlFor="passage-verse-end">Verse to</Label>
            <Input
              id="passage-verse-end"
              inputMode="numeric"
              placeholder="Optional"
              value={pick.verseEnd ?? ""}
              disabled={pick.verseStart == null}
              onChange={(event) => write({ verseEnd: verseNumber(event.target.value) })}
            />
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          Stores the whole chapter (for example John 3). Switch to Verses for a range.
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{readingHint(value)}</p>
    </div>
  );
}
