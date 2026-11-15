"use client";

import { useEffect, useState } from "react";
import { nextGathering, type NextGathering } from "@/lib/next-gathering";
import type { Service } from "@/lib/branches";

/**
 * The countdown to this branch's next gathering, in the hero.
 *
 * Set as type rather than as a badge or a pill: an eyebrow, the day and time
 * large, and the countdown under it. The first version of this was a small
 * muted line tucked under the buttons, which made the one genuinely useful
 * fact on the page look like a footnote.
 *
 * Client-only, and that is deliberate rather than lazy: the answer depends
 * on the reader's own clock and timezone, so a server render would either be
 * wrong for most readers or trip a hydration mismatch the moment the two
 * disagreed about what day it is. It holds its height while it resolves so
 * the hero does not jump.
 */
export function BranchNextGathering({ services }: { services: Service[] }) {
  const [next, setNext] = useState<NextGathering | null>(null);

  useEffect(() => {
    const tick = () => setNext(nextGathering(services, new Date()));
    tick();
    /* Every thirty seconds. The countdown is only ever as fine as minutes,
     * and this keeps "in 1 minute" from lingering after it has passed. */
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [services]);

  if (!next) return <div className="branch-next" aria-hidden />;

  return (
    <div className={`branch-next${next.live ? " branch-next--live" : ""}`}>
      <p className="branch-next__label">{next.live ? "Happening now" : "Next gathering"}</p>
      <p className="branch-next__when">
        <span className="branch-next__day">{next.when}</span>
        {next.time ? <span className="branch-next__time">{next.time}</span> : null}
      </p>
      <p className="branch-next__meta">
        {next.service.name}
        {next.countdown ? <span className="branch-next__in">{next.countdown}</span> : null}
      </p>
    </div>
  );
}
