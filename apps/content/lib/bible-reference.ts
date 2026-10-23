type Book = { usfm: string; name: string; chapters: number };

const BOOKS: Book[] = [
  ["GEN", "Genesis", 50],
  ["EXO", "Exodus", 40],
  ["LEV", "Leviticus", 27],
  ["NUM", "Numbers", 36],
  ["DEU", "Deuteronomy", 34],
  ["JOS", "Joshua", 24],
  ["JDG", "Judges", 21],
  ["RUT", "Ruth", 4],
  ["1SA", "1 Samuel", 31],
  ["2SA", "2 Samuel", 24],
  ["1KI", "1 Kings", 22],
  ["2KI", "2 Kings", 25],
  ["1CH", "1 Chronicles", 29],
  ["2CH", "2 Chronicles", 36],
  ["EZR", "Ezra", 10],
  ["NEH", "Nehemiah", 13],
  ["EST", "Esther", 10],
  ["JOB", "Job", 42],
  ["PSA", "Psalms", 150],
  ["PRO", "Proverbs", 31],
  ["ECC", "Ecclesiastes", 12],
  ["SNG", "Song of Solomon", 8],
  ["ISA", "Isaiah", 66],
  ["JER", "Jeremiah", 52],
  ["LAM", "Lamentations", 5],
  ["EZK", "Ezekiel", 48],
  ["DAN", "Daniel", 12],
  ["HOS", "Hosea", 14],
  ["JOL", "Joel", 3],
  ["AMO", "Amos", 9],
  ["OBA", "Obadiah", 1],
  ["JON", "Jonah", 4],
  ["MIC", "Micah", 7],
  ["NAM", "Nahum", 3],
  ["HAB", "Habakkuk", 3],
  ["ZEP", "Zephaniah", 3],
  ["HAG", "Haggai", 2],
  ["ZEC", "Zechariah", 14],
  ["MAL", "Malachi", 4],
  ["MAT", "Matthew", 28],
  ["MRK", "Mark", 16],
  ["LUK", "Luke", 24],
  ["JHN", "John", 21],
  ["ACT", "Acts", 28],
  ["ROM", "Romans", 16],
  ["1CO", "1 Corinthians", 16],
  ["2CO", "2 Corinthians", 13],
  ["GAL", "Galatians", 6],
  ["EPH", "Ephesians", 6],
  ["PHP", "Philippians", 4],
  ["COL", "Colossians", 4],
  ["1TH", "1 Thessalonians", 5],
  ["2TH", "2 Thessalonians", 3],
  ["1TI", "1 Timothy", 6],
  ["2TI", "2 Timothy", 4],
  ["TIT", "Titus", 3],
  ["PHM", "Philemon", 1],
  ["HEB", "Hebrews", 13],
  ["JAS", "James", 5],
  ["1PE", "1 Peter", 5],
  ["2PE", "2 Peter", 3],
  ["1JN", "1 John", 5],
  ["2JN", "2 John", 1],
  ["3JN", "3 John", 1],
  ["JUD", "Jude", 1],
  ["REV", "Revelation", 22],
].map(([usfm, name, chapters]) => ({
  usfm: String(usfm),
  name: String(name),
  chapters: Number(chapters),
}));

const ALIASES: Record<string, string[]> = {
  GEN: ["gen", "ge", "gn"],
  EXO: ["ex", "exod"],
  LEV: ["le", "lv"],
  NUM: ["nu", "nm", "nb"],
  DEU: ["deut", "de", "dt"],
  JOS: ["josh", "jsh"],
  JDG: ["judg", "jg", "jdgs"],
  RUT: ["rth", "ru"],
  EST: ["esth", "es"],
  JOB: ["jb"],
  PSA: ["ps", "psalm", "pss", "psm", "pslm"],
  PRO: ["prov", "prv", "pr"],
  ECC: ["eccl", "eccles", "ec", "qoh"],
  SNG: ["song", "song of songs", "songs", "sos", "ss", "canticles"],
  ISA: ["is"],
  JER: ["je", "jr"],
  LAM: ["la"],
  EZK: ["ezek", "eze"],
  DAN: ["da", "dn"],
  HOS: ["ho"],
  JOL: ["jl"],
  AMO: ["am"],
  OBA: ["obad", "ob"],
  JON: ["jnh"],
  MIC: ["mc"],
  NAM: ["nah", "na"],
  HAB: ["hb"],
  ZEP: ["zeph", "zp"],
  HAG: ["hg"],
  ZEC: ["zech", "zc"],
  MAL: ["ml"],
  MAT: ["matt", "mt"],
  MRK: ["mk", "mr"],
  LUK: ["lk"],
  JHN: ["jn", "joh"],
  ACT: ["ac"],
  ROM: ["ro", "rm"],
  GAL: ["ga"],
  EPH: ["ephes"],
  PHP: ["phil", "pp"],
  TIT: ["ti"],
  PHM: ["philem", "phlm", "pm"],
  JAS: ["jm", "jms"],
  JUD: ["jd"],
  REV: ["re", "rv", "revelations", "apocalypse"],
};

const NUMBERED: Record<string, string[]> = {
  samuel: ["sam", "sa", "sm"],
  kings: ["kgs", "ki", "kin"],
  chronicles: ["chr", "chron", "ch"],
  corinthians: ["cor", "co"],
  thessalonians: ["thess", "thes", "th"],
  timothy: ["tim", "ti", "tm"],
  peter: ["pet", "pe", "pt"],
  john: ["jn", "jhn", "jo", "joh"],
};

function normalize(input: string) {
  let text = input.toLowerCase().trim();
  text = text.replace(/[\u2013\u2014]/g, "-");
  text = text.replace(/(\d)\s*\.\s*(\d)/g, "$1:$2");
  text = text.replace(/\./g, " ");
  text = text.replace(/^(iii|3rd|third)\s+(?=[a-z])/, "3 ");
  text = text.replace(/^(ii|2nd|second)\s+(?=[a-z])/, "2 ");
  text = text.replace(/^(i|1st|first)\s+(?=[a-z])/, "1 ");
  text = text.replace(/(?<=[a-z])(?=\d)/g, " ");
  text = text.replace(/(?<=\d)(?=[a-z])/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.replace(/\s*([:-])\s*/g, "$1");
  return text.trim();
}

const LOOKUP = new Map<string, Book>();
for (const book of BOOKS) {
  LOOKUP.set(normalize(book.name), book);
  LOOKUP.set(normalize(book.usfm), book);
  for (const alias of ALIASES[book.usfm] ?? []) LOOKUP.set(alias, book);
  const numbered = book.name.match(/^([1-3]) (.+)$/);
  if (!numbered) continue;
  const base = numbered[2]?.toLowerCase() ?? "";
  for (const alias of NUMBERED[base] ?? []) LOOKUP.set(`${numbered[1]} ${alias}`, book);
}

const REFERENCE = /^((?:[1-3] )?[a-z][a-z ]*?)(?: ?(\d+)(?::(\d+)(?:-(\d+))?)?)?$/;

export type ReadingCheck = { ok: true; passages: string[] } | { ok: false; message: string };

function labelFor(book: Book, chapter: number, verseStart: number | null, verseEnd: number | null) {
  if (verseStart == null) return `${book.name} ${chapter}`;
  if (verseEnd == null || verseEnd === verseStart) return `${book.name} ${chapter}:${verseStart}`;
  return `${book.name} ${chapter}:${verseStart}-${verseEnd}`;
}

function parsePart(
  input: string,
): { ok: true; label: string; book: string } | { ok: false; message: string } {
  const text = normalize(input);
  if (!text) return { ok: false, message: "Type a reference, like John 3:16." };
  const match = REFERENCE.exec(text);
  if (!match) {
    return {
      ok: false,
      message: `The app cannot read “${input.trim()}”. Try John 3:16 or Psalm 23.`,
    };
  }
  const bookText = match[1]?.trim() ?? "";
  const book = LOOKUP.get(bookText);
  if (!book) {
    const hits = BOOKS.filter((item) => normalize(item.name).startsWith(bookText));
    if (hits.length > 1) {
      return {
        ok: false,
        message: `“${bookText}” could be ${hits
          .slice(0, 4)
          .map((item) => item.name)
          .join(", ")}. Type a little more of the name.`,
      };
    }
    return { ok: false, message: `The app cannot find a book called “${bookText}”.` };
  }
  const onlyChapter = book.chapters === 1;
  let chapter = match[2] ? Number(match[2]) : 1;
  let verseStart = match[3] ? Number(match[3]) : null;
  const verseEnd = match[4] ? Number(match[4]) : null;
  if (onlyChapter && verseStart == null && chapter > 1 && match[2]) {
    verseStart = chapter;
    chapter = 1;
  }
  if (chapter < 1 || chapter > book.chapters) {
    return {
      ok: false,
      message: `${book.name} has ${book.chapters} chapter${book.chapters === 1 ? "" : "s"}.`,
    };
  }
  if (verseStart != null && verseStart < 1) {
    return { ok: false, message: `There is no verse ${verseStart} in ${book.name} ${chapter}.` };
  }
  if (verseEnd != null && verseStart != null && verseEnd < verseStart) {
    return { ok: false, message: "That verse range runs backwards. Try John 3:16-18." };
  }
  return { ok: true, label: labelFor(book, chapter, verseStart, verseEnd), book: book.name };
}

/** The passages the mobile reader opens from a Daily Reading reference. */
export function describeReadingReference(input: string): ReadingCheck {
  const trimmed = input.trim();
  if (!trimmed) return { ok: true, passages: [] };
  const passages: string[] = [];
  let lastBook: string | null = null;
  for (const raw of trimmed.split(/;|\n|\s+and\s+/i)) {
    let part = raw.trim();
    if (!part) continue;
    if (/^\d+(\s*[:.]\s*\d+(\s*[-–]\s*\d+)?)?$/.test(part) && lastBook)
      part = `${lastBook} ${part}`;
    const parsed = parsePart(part);
    if (!parsed.ok) return parsed;
    passages.push(parsed.label);
    lastBook = parsed.book;
  }
  if (passages.length === 0) return { ok: false, message: "Type a reference, like John 3:16." };
  return { ok: true, passages };
}

export function readingHint(input: string) {
  const check = describeReadingReference(input);
  if (!input.trim()) return "The phone opens this in the Bible reader. Example: John 3:16.";
  if (!check.ok) return check.message;
  return `Opens ${check.passages.join(", ")} in the Bible reader.`;
}
