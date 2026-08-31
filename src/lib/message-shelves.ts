import type { MessageVideo } from "@/lib/youtube";

export type MessageShelf = {
  id: string;
  title: string;
  rows: MessageVideo[][];
};

/** Named series shown before year shelves (except trailer series). */
const EARLY_SERIES: Array<{
  id: string;
  title: string;
  match: (title: string) => boolean;
}> = [
  {
    id: "issues-of-life",
    title: "The Issues of Life",
    match: (t) => t.includes("issues of life"),
  },
  {
    id: "podcasts",
    title: "Podcasts",
    match: (t) =>
      t.includes("just men") ||
      t.includes("fragrance"),
  },
];

const LATE_SERIES: Array<{
  id: string;
  title: string;
  match: (title: string) => boolean;
}> = [
  {
    id: "let-the-bible-speak",
    title: "Let the Bible Speak",
    match: (t) =>
      t.includes("let the bible speak") ||
      t.includes("ltbsc") ||
      t.includes("try the bible"),
  },
];

/** Landscape tiles: 4 per row, only full rows so no empty slots */
const PER_ROW = 4;
const MAX_ROWS = 6;

function chunkRows(items: MessageVideo[]): MessageVideo[][] {
  if (!items.length) return [];
  const rows: MessageVideo[][] = [];
  const full = Math.floor(items.length / PER_ROW) * PER_ROW;
  const capped = items.slice(0, Math.min(full, PER_ROW * MAX_ROWS));
  for (let i = 0; i < capped.length; i += PER_ROW) {
    rows.push(capped.slice(i, i + PER_ROW));
  }
  return rows;
}

function yearOf(m: MessageVideo): number | null {
  if (!m.publishedAt) return null;
  const y = new Date(m.publishedAt).getFullYear();
  return Number.isFinite(y) ? y : null;
}

function markShown(rows: MessageVideo[][], used: Set<string>) {
  for (const row of rows) {
    for (const m of row) used.add(m.id);
  }
}

function pushSeries(
  shelves: MessageShelf[],
  used: Set<string>,
  pool: MessageVideo[],
  series: { id: string; title: string; match: (t: string) => boolean },
) {
  const picked: MessageVideo[] = [];
  for (const m of pool) {
    if (used.has(m.id)) continue;
    if (!series.match(m.title.toLowerCase())) continue;
    picked.push(m);
  }
  const rows = chunkRows(picked);
  markShown(rows, used);
  if (rows.length) shelves.push({ id: series.id, title: series.title, rows });
}

/**
 * Shelves under Latest:
 * Issues of Life → Podcasts (Just Men + Fragrance) → year packs →
 * Let the Bible Speak last (small set).
 */
export function buildMessageShelves(
  messages: MessageVideo[],
): MessageShelf[] {
  const pool = [...messages];
  const shelves: MessageShelf[] = [];
  const used = new Set<string>();

  for (const series of EARLY_SERIES) {
    if (series.id === "podcasts") {
      const picked: MessageVideo[] = [];
      for (const m of pool) {
        if (used.has(m.id)) continue;
        if (!series.match(m.title.toLowerCase())) continue;
        picked.push(m);
      }
      const byYear = new Map<number, MessageVideo[]>();
      for (const m of picked) {
        const y = yearOf(m) ?? 2026;
        const list = byYear.get(y) ?? [];
        list.push(m);
        byYear.set(y, list);
      }
      for (const year of [...byYear.keys()].sort((a, b) => b - a)) {
        const rows = chunkRows(byYear.get(year) || []);
        markShown(rows, used);
        if (rows.length) {
          shelves.push({
            id: `podcasts-${year}`,
            title: `Podcasts ${year}`,
            rows,
          });
        }
      }
      continue;
    }
    pushSeries(shelves, used, pool, series);
  }

  const years = new Set<number>();
  for (const m of pool) {
    if (used.has(m.id)) continue;
    // Hold back late-series titles for the final shelf
    const t = m.title.toLowerCase();
    if (LATE_SERIES.some((s) => s.match(t))) continue;
    const y = yearOf(m);
    if (y) years.add(y);
  }

  const sortedYears = [...years].sort((a, b) => b - a);
  for (const year of sortedYears) {
    const picked: MessageVideo[] = [];
    for (const m of pool) {
      if (used.has(m.id)) continue;
      const t = m.title.toLowerCase();
      if (LATE_SERIES.some((s) => s.match(t))) continue;
      if (yearOf(m) !== year) continue;
      picked.push(m);
    }
    const rows = chunkRows(picked);
    markShown(rows, used);
    if (rows.length) {
      shelves.push({
        id: `year-${year}`,
        title: `Messages ${year}`,
        rows,
      });
    }
  }

  const leftover: MessageVideo[] = [];
  for (const m of pool) {
    if (used.has(m.id)) continue;
    const t = m.title.toLowerCase();
    if (LATE_SERIES.some((s) => s.match(t))) continue;
    leftover.push(m);
  }
  const leftoverRows = chunkRows(leftover);
  markShown(leftoverRows, used);
  if (leftoverRows.length) {
    shelves.push({
      id: "more",
      title: "More messages",
      rows: leftoverRows,
    });
  }

  for (const series of LATE_SERIES) {
    pushSeries(shelves, used, pool, series);
  }

  return shelves;
}
