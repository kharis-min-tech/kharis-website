"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { ChildrenGroup, ChildrenLayout } from "@/data/children-groups";

type Trail = Extract<ChildrenLayout, { kind: "trail" }>;

const VERSE_MOTION_MS = 420;

/** Super: a dashed route through four checkpoints. Each opens its scripture. */
export function TrailLayout({ group, layout }: { group: ChildrenGroup; layout: Trail }) {
  const [open, setOpen] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const panelId = `${group.id}-scripture`;
  const verse = layout.checkpoints.find((checkpoint) => checkpoint.id === shown);

  function toggle(id: string) {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (open === id) {
      setOpen(null);
      closeTimer.current = window.setTimeout(() => setShown(null), VERSE_MOTION_MS);
      return;
    }
    setShown(id);
    setOpen(id);
  }

  return (
    <>
      <div className="kids-group__copy kids-trail-intro">
        <h3>{group.headline}</h3>
        <p>{group.body}</p>
      </div>

      <div className="kids-trail">
        <svg className="kids-trail__line" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
          <line pathLength="1" x1="0" y1="5" x2="100" y2="5" />
        </svg>
        {layout.checkpoints.map((checkpoint, index) => {
          const expanded = open === checkpoint.id;
          return (
            <button
              key={checkpoint.id}
              type="button"
              className={`kids-checkpoint${checkpoint.goal ? " kids-checkpoint--goal" : ""}`}
              style={{ "--i": index } as CSSProperties}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(checkpoint.id)}
            >
              <span className="kids-checkpoint__gem">
                <span>{index + 1}</span>
              </span>
              <span className="kids-checkpoint__name">{checkpoint.name}</span>
              {checkpoint.goal ? <span className="kids-checkpoint__goal">Goal</span> : null}
            </button>
          );
        })}
        <div className={`kids-trail__reveal${open ? " is-open" : ""}`}>
          <div className="kids-trail__reveal-inner">
            {verse ? (
              <blockquote id={panelId} className="kids-trail__detail" key={verse.id}>
                <p>&ldquo;{verse.scripture.text}&rdquo;</p>
                <cite>{verse.scripture.reference}</cite>
              </blockquote>
            ) : null}
          </div>
        </div>
      </div>

      <div className="kids-squad">
        <aside className="kids-signpost">
          <blockquote>
            <p>&ldquo;{layout.memoryVerse.text}&rdquo;</p>
            <cite>{layout.memoryVerse.reference}</cite>
          </blockquote>
        </aside>
      </div>
    </>
  );
}
