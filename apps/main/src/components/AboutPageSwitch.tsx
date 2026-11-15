/**
 * Chooses how the About page is told.
 *
 * The scrolling page is what the server renders, so a crawler, a reader
 * without JavaScript and anyone on a narrow screen gets the whole thing as
 * ordinary visible text. On the client, where there is room and motion is
 * welcome, the book replaces it.
 *
 * One or the other, never both: a hidden duplicate would be invisible to
 * screen readers anyway (hidden takes it out of the accessibility tree) and
 * would hand search engines the same text twice. The book does not need a
 * shadow copy to be accessible, because its pages are real markup with a
 * tablist, keyboard paging and labels, read from the same
 * lib/about-content.ts the scrolling page uses.
 *
 * REVIEWING THE TWO SIDE BY SIDE
 * ------------------------------
 * ?view=book and ?view=scroll pin the choice, so both can be opened in two
 * windows at once while the book is still being decided on. It is an override
 * of the measurement, not of the content: the pinned view is the same one the
 * rule would otherwise pick, so nothing is being previewed that a visitor
 * cannot get to. Anything other than those two values, and no value at all,
 * leaves the rule in charge, which is what every real visit does.
 */
"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AboutExperience } from "@/components/AboutExperience";
import { SiteHeader } from "@/components/SiteHeader";

const AboutBook = dynamic(
  () => import("@/components/AboutBook").then((m) => ({ default: m.AboutBook })),
  { ssr: false, loading: () => null },
);

/**
 * Below this the book is too cramped. It opens into a spread now, so the
 * width has to carry two pages side by side, not one.
 */
const MIN_WIDTH = 1024;

export function AboutPageSwitch() {
  const [fits, setFits] = useState(false);
  const pinned = useSearchParams().get("view");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const sync = () => setFits(wide.matches && !motion.matches);
    sync();
    motion.addEventListener("change", sync);
    wide.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      wide.removeEventListener("change", sync);
    };
  }, []);

  const useBook = pinned === "book" ? true : pinned === "scroll" ? false : fits;

  /* The header is rendered here rather than by the route because only this
   * component knows which view won. The scrolling page opens on a dark
   * photograph, where the header has to be white; the book opens on the page
   * surface, where white lettering would be invisible. "light" only takes
   * effect in the light theme, so dark mode keeps its white treatment either
   * way. */
  return (
    <>
      <SiteHeader tone={useBook ? "light" : "auto"} />
      {useBook ? <AboutBook /> : <AboutExperience />}
    </>
  );
}
