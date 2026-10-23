"use client";

import {
  bibleBooks,
  passageFromReference,
  readingHint,
  referenceFromPassage,
} from "@/lib/bible-reference";
import { Input, Label, Select } from "@/components/ui/input";

const FALLBACK = { book: "John", chapter: 1, verseStart: null, verseEnd: null };

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

  function verseNumber(raw: string) {
    if (!raw.trim()) return null;
    const number = Number(raw);
    if (!Number.isInteger(number) || number < 1) return null;
    return number;
  }

  return (
    <div>
      <Label>Passage</Label>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(6rem,0.6fr)]">
        <Select
          aria-label="Bible book"
          value={book?.name ?? "John"}
          onChange={(event) => {
            const next = books.find((item) => item.name === event.target.value);
            write({
              book: event.target.value,
              chapter: 1,
              verseStart: next?.chapters === 1 ? pick.verseStart : pick.verseStart,
              verseEnd: next?.chapters === 1 ? pick.verseEnd : pick.verseEnd,
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
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="passage-verse-start">Verse from</Label>
          <Input
            id="passage-verse-start"
            inputMode="numeric"
            placeholder="Optional"
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
      <p className="mt-2 text-xs text-muted-foreground">{readingHint(value)}</p>
    </div>
  );
}
