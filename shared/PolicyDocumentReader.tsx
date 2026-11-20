"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

export type PolicyTextPage = { number: number; text: string };
export type PolicyQuickLink = { label: string; page: number };

export type PolicyDocumentReaderProps = {
  title: string;
  description: string;
  updatedAt?: string;
  pages: PolicyTextPage[];
  pdfUrl: string;
  quickLinks?: PolicyQuickLink[];
  theme: "main" | "kp2";
};

type TextMatch = { pageIndex: number; start: number };

function highlightText(text: string, query: string): ReactNode {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return text;

  const lower = text.toLocaleLowerCase();
  const chunks: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = lower.indexOf(needle, cursor);

  while (matchIndex >= 0) {
    if (matchIndex > cursor) chunks.push(text.slice(cursor, matchIndex));
    chunks.push(
      <mark key={`${matchIndex}-${cursor}`} className="policy-reader__mark">
        {text.slice(matchIndex, matchIndex + needle.length)}
      </mark>,
    );
    cursor = matchIndex + needle.length;
    matchIndex = lower.indexOf(needle, cursor);
  }

  if (cursor < text.length) chunks.push(text.slice(cursor));
  return chunks;
}

export function PolicyDocumentReader({
  title,
  description,
  updatedAt,
  pages,
  pdfUrl,
  quickLinks = [],
  theme,
}: PolicyDocumentReaderProps) {
  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [matchIndex, setMatchIndex] = useState(0);

  const matches = useMemo<TextMatch[]>(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (needle.length < 2) return [];

    const found: TextMatch[] = [];
    pages.forEach((page, index) => {
      const text = page.text.toLocaleLowerCase();
      let start = text.indexOf(needle);
      while (start >= 0) {
        found.push({ pageIndex: index, start });
        start = text.indexOf(needle, start + needle.length);
      }
    });
    return found;
  }, [pages, query]);

  const currentMatch = matches.length ? matches[matchIndex % matches.length] : undefined;
  const visiblePageIndex = currentMatch?.pageIndex ?? pageIndex;

  useEffect(() => {
    if (!currentMatch) return;
    document
      .getElementById(`policy-page-${pages[currentMatch.pageIndex]?.number}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentMatch, pages]);

  const changeQuery = (value: string) => {
    setQuery(value);
    setMatchIndex(0);
  };

  const selectPage = (index: number) => {
    setPageIndex(index);
    setQuery("");
    setMatchIndex(0);
    requestAnimationFrame(() => {
      document
        .getElementById(`policy-page-${pages[index]?.number}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const cycleMatch = (direction: -1 | 1) => {
    setMatchIndex((current) => (current + direction + matches.length) % matches.length);
  };

  return (
    <section
      className={`policy-reader policy-reader--${theme}`}
      aria-label={`${title} document reader`}
    >
      <div className="policy-reader__intro">
        <p className="policy-reader__eyebrow">Governance · Full policy text</p>
        <h1>{title}</h1>
        <p className="policy-reader__description">{description}</p>
        {updatedAt ? (
          <p className="policy-reader__date">Date shown in the supplied document: {updatedAt}</p>
        ) : null}
      </div>

      {quickLinks.length ? (
        <aside className="policy-reader__quick" aria-label="Key information in this policy">
          <h2>Key information</h2>
          <p>Quick links to important information in the original policy:</p>
          <div className="policy-reader__quick-links">
            {quickLinks.map((link) => (
              <button
                key={`${link.label}-${link.page}`}
                type="button"
                onClick={() => selectPage(link.page - 1)}
              >
                {link.label} <span>Page {link.page} →</span>
              </button>
            ))}
          </div>
        </aside>
      ) : null}

      <div className="policy-reader__tools">
        <label className="policy-reader__search">
          <span>Find a word or phrase</span>
          <input
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Search this policy…"
            aria-describedby="policy-search-help"
          />
        </label>
        <p id="policy-search-help" className="policy-reader__search-help">
          Search all {pages.length} pages. Use at least two characters.
        </p>

        {query.trim().length >= 2 ? (
          <div className="policy-reader__match-controls" aria-live="polite">
            {matches.length ? (
              <>
                <span>
                  Match {matchIndex + 1} of {matches.length} · page{" "}
                  {pages[visiblePageIndex]?.number}
                </span>
                <div>
                  <button type="button" onClick={() => cycleMatch(-1)} aria-label="Previous match">
                    Previous
                  </button>
                  <button type="button" onClick={() => cycleMatch(1)} aria-label="Next match">
                    Next
                  </button>
                </div>
              </>
            ) : (
              <span>No matches found. Try another word or phrase.</span>
            )}
          </div>
        ) : null}
      </div>

      <div className="policy-reader__page-jump">
        <label>
          <span>Jump to a page</span>
          <select
            value={visiblePageIndex}
            onChange={(event) => selectPage(Number(event.target.value))}
          >
            {pages.map((page, index) => (
              <option key={page.number} value={index}>
                Page {page.number} of {pages.length}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="policy-reader__document" aria-label="Complete policy text">
        {pages.map((page) => (
          <article
            className="policy-reader__page"
            id={`policy-page-${page.number}`}
            key={page.number}
            aria-label={`Policy page ${page.number}`}
          >
            <h2>Page {page.number}</h2>
            <div className="policy-reader__page-text">{highlightText(page.text, query)}</div>
          </article>
        ))}
      </div>

      <details className="policy-reader__original">
        <summary>View the original PDF in this page</summary>
        <div className="policy-reader__pdf-frame">
          <iframe title={`Original ${title} PDF`} src={`${pdfUrl}#view=FitH`} loading="lazy" />
        </div>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Open the original PDF in a new tab
        </a>
      </details>
      <p className="policy-reader__source-note">
        The complete text above is transcribed from the supplied PDF and organized by its original
        page numbers. The original PDF is available above for checking the layout and wording.
      </p>
    </section>
  );
}
