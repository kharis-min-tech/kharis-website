"use client";

import { useState, type CSSProperties } from "react";
import type { ChildrenGroup, ChildrenLayout } from "@/data/children-groups";
import { BringFriendButton } from "./BringFriendButton";
import { ConfirmBadge } from "./ConfirmBadge";
import { PlaceholderImage } from "./PlaceholderImage";

type Trail = Extract<ChildrenLayout, { kind: "trail" }>;

/** Super: a dashed route through four checkpoints, then the squad and the month's verse. */
export function TrailLayout({ group, layout }: { group: ChildrenGroup; layout: Trail }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <div className="kids-group__copy kids-trail-intro">
        <h3>{group.headline}</h3>
        <p>{group.body}</p>
        <BringFriendButton groupId={group.id} groupName={group.name} label={layout.invite} />
      </div>

      <div className="kids-trail">
        <svg className="kids-trail__line" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
          <line pathLength="1" x1="0" y1="5" x2="100" y2="5" />
        </svg>
        {layout.checkpoints.map((checkpoint, index) => {
          const panelId = `${group.id}-${checkpoint.id}`;
          const expanded = open === checkpoint.id;
          return (
            <button
              key={checkpoint.id}
              type="button"
              className={`kids-checkpoint${checkpoint.goal ? " kids-checkpoint--goal" : ""}`}
              style={{ "--i": index } as CSSProperties}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? null : checkpoint.id)}
            >
              <span className="kids-checkpoint__gem">
                <span>{index + 1}</span>
              </span>
              <span className="kids-checkpoint__name">{checkpoint.name}</span>
              {checkpoint.goal ? <span className="kids-checkpoint__goal">Goal</span> : null}
            </button>
          );
        })}
        {layout.checkpoints.map((checkpoint) => (
          <div
            key={`${checkpoint.id}-panel`}
            id={`${group.id}-${checkpoint.id}`}
            className="kids-trail__detail"
            hidden={open !== checkpoint.id}
          >
            <p className="kids-trail__detail-title">{checkpoint.name}</p>
            <ConfirmBadge what={`The verse and the one line for ${checkpoint.name}.`} />
          </div>
        ))}
      </div>

      <div className="kids-squad">
        <div className="kids-squad__photos">
          {group.photos.map((slot) => (
            <PlaceholderImage key={slot.id} slot={slot} />
          ))}
        </div>
        <aside className="kids-signpost">
          <p className="kids-signpost__label">{layout.memoryVerse.label}</p>
          <blockquote>
            <p>&ldquo;{layout.memoryVerse.text}&rdquo;</p>
            <cite>{layout.memoryVerse.reference}</cite>
          </blockquote>
        </aside>
      </div>
    </>
  );
}
