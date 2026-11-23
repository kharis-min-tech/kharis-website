"use client";

import { useEffect, useState } from "react";

/**
 * Whether a media query currently matches.
 *
 * Starts false on the server and on the first client render, then syncs in an
 * effect, which is the only way to read a media query without the markup the
 * server sent disagreeing with the markup the client builds. Anything that
 * must not move after hydration should therefore treat false as its resting
 * state, or be rendered client-only.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
