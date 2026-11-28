/**
 * Chooses which book the About page is, and renders the header that goes with
 * it.
 *
 * There used to be two tellings here - a scrolling page and the book - and
 * this component picked between them. The scrolling page has been removed, so
 * the only choice left is the shape of the book: a two-page spread where
 * there is room for one, a single page where there is not.
 *
 * Because the book is now the only telling, it is imported normally rather
 * than through `dynamic(..., { ssr: false })`. It has to be: with the
 * scrolling page gone, a `ssr: false` book would leave the server rendering
 * an empty document, and a crawler or a reader without JavaScript would find
 * nothing on /about at all. The book's pages are real markup - headings,
 * text and images read from lib/about-content.ts - so they server-render and
 * read perfectly well as a document.
 */
"use client";

import { useEffect, useState } from "react";
import { AboutBook } from "@/components/AboutBook";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Where the book stops being a spread and becomes one page at a time.
 *
 * The spread needs width for two pages side by side. Below this there is only
 * room for one, so the book turns single page instead of giving up and
 * handing over to the scrolling page - which is what it used to do, and which
 * meant a phone never saw the book at all.
 */
const SPREAD_WIDTH = 1024;

export function AboutPageSwitch() {
  /* False on the server and on the first client render, so the spread is what
   * gets rendered and indexed; a narrow client switches to single pages once
   * the media query has been read. */
  const [single, setSingle] = useState(false);

  useEffect(() => {
    const spread = window.matchMedia(`(min-width: ${SPREAD_WIDTH}px)`);
    const sync = () => setSingle(!spread.matches);
    sync();
    spread.addEventListener("change", sync);
    return () => spread.removeEventListener("change", sync);
  }, []);

  /* The header is rendered here rather than by the route because it has to
   * match what is underneath it. The book opens on the page surface, where
   * white lettering would be invisible. "light" only takes effect in the
   * light theme, so dark mode keeps its white treatment either way. */
  return (
    <>
      <SiteHeader tone="light" />
      <AboutBook single={single} />
    </>
  );
}
