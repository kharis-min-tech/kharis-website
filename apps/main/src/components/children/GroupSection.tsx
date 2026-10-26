import type { CSSProperties } from "react";
import { groupAgeLabel, groupTone, type ChildrenGroup } from "@/data/children-groups";
import { CHILDREN_HEADING_FONTS } from "./fonts";
import { BentoLayout } from "./BentoLayout";
import { PictureBookLayout } from "./PictureBookLayout";
import { TrailLayout } from "./TrailLayout";

/** Exposes a group's palette and type as CSS variables scoped to its section. */
function groupStyle(group: ChildrenGroup): CSSProperties {
  const style: Record<string, string | number> = {
    "--g-bg": groupTone(group, "bg"),
    "--g-ink": groupTone(group, "ink"),
    "--g-numeral": groupTone(group, "numeral"),
    "--g-accent": groupTone(group, "accent"),
    "--g-soft": groupTone(group, "soft"),
    "--g-heading-font": CHILDREN_HEADING_FONTS[group.font.heading],
    "--g-heading-weight": group.font.headingWeight,
    "--g-label-weight": group.font.labelWeight,
  };
  for (const [token, value] of Object.entries(group.palette.tokens)) {
    style[`--g-${token}`] = value;
  }
  return style as CSSProperties;
}

function GroupHeader({ group }: { group: ChildrenGroup }) {
  return (
    <header className="kids-group__header">
      <p className="kids-group__numeral">
        <span className="sr-only">Ages </span>
        {groupAgeLabel(group)}
        <span className="kids-group__years"> years</span>
      </p>
      <h2 id={`${group.id}-title`}>{group.name}</h2>
      {group.promise ? <p className="kids-group__promise">{group.promise}</p> : null}
    </header>
  );
}

function GroupBody({ group }: { group: ChildrenGroup }) {
  switch (group.layout.kind) {
    case "picture-book":
      return <PictureBookLayout group={group} layout={group.layout} />;
    case "trail":
      return <TrailLayout group={group} layout={group.layout} />;
    case "bento":
      return <BentoLayout group={group} layout={group.layout} />;
  }
}

export function GroupSection({ group }: { group: ChildrenGroup }) {
  return (
    <section
      id={group.id}
      className={`kids-group kids-group--${group.id}`}
      aria-labelledby={`${group.id}-title`}
      tabIndex={-1}
      style={groupStyle(group)}
    >
      <div className="kids-wrap">
        <GroupHeader group={group} />
        <GroupBody group={group} />
      </div>
    </section>
  );
}
