import { glidePageTo, stopPageGlide } from "@/lib/page-snap";

/**
 * Brings an in-page section to the top using the Life page glide (instant under reduced motion),
 * clearing the fixed header and sticky navigator via the section's `scroll-margin-top`.
 * Focus moves to the section so keyboard users land where they went.
 */
export function glideToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;

  const offset = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
  const target = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    stopPageGlide();
    window.scrollTo({ top: target, behavior: "instant" });
  } else {
    glidePageTo(target);
  }

  window.history.replaceState(null, "", `#${id}`);
  section.focus({ preventScroll: true });
}
