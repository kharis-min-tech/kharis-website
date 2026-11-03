import type { CSSProperties } from "react";
import type { ChildrenGroup, ChildrenLayout } from "@/data/children-groups";

type Bento = Extract<ChildrenLayout, { kind: "bento" }>;

/** Transition: a comic-panel grid. */
export function BentoLayout({ group, layout }: { group: ChildrenGroup; layout: Bento }) {
  return (
    <div className="kids-bento">
      <div className="kids-bento__tile kids-bento__statement" style={{ "--i": 0 } as CSSProperties}>
        <h3>{group.headline}</h3>
        <p>{group.body}</p>
      </div>

      <div className="kids-bento__tile kids-bento__teaching" style={{ "--i": 1 } as CSSProperties}>
        <p className="kids-bento__title">{layout.teaching}</p>
      </div>

      <blockquote
        className="kids-bento__tile kids-bento__scripture"
        style={{ "--i": 2 } as CSSProperties}
      >
        <p>&ldquo;{layout.scripture.text}&rdquo;</p>
        <cite>{layout.scripture.reference}</cite>
      </blockquote>
    </div>
  );
}
