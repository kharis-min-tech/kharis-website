"use client";

import type { CSSProperties, MouseEvent } from "react";
import { Icon } from "@/components/Icon";
import {
  CHILDREN_GROUPS,
  CHILDREN_HERO,
  groupAgeLabel,
  type ChildrenGroup,
} from "@/data/children-groups";
import { glideToSection } from "./glide";
import { PlaceholderImage } from "./PlaceholderImage";

/** Bars and ticks share one scale: the oldest age any group reaches. */
const SCALE_MAX = Math.max(...CHILDREN_GROUPS.map((group) => group.ages.to));

function onGlideLink(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  glideToSection(id);
}

function HeroBar({ group, index }: { group: ChildrenGroup; index: number }) {
  const { heroBar } = group;
  const style = {
    "--bar-reach": group.ages.to / SCALE_MAX,
    "--bar-index": index,
    "--bar-tag-bg": group.palette.tokens[heroBar.tagBg],
    "--bar-tag-text": heroBar.tagText,
    "--g-soft": group.palette.tokens[group.palette.roles.soft],
    "--g-ink": group.palette.tokens[group.palette.roles.ink],
  } as CSSProperties;

  return (
    <li className="kids-chart__item" style={style}>
      <a
        href={`#${group.id}`}
        className="kids-chart__bar"
        onClick={(event) => onGlideLink(event, group.id)}
      >
        <span className="kids-chart__tag">
          <strong>{group.name}</strong>
          <span>{groupAgeLabel(group)} years</span>
          <em className="kids-chart__line">{heroBar.line}</em>
        </span>
        <PlaceholderImage slot={heroBar.photo} className="kids-chart__photo" fill compact />
      </a>
    </li>
  );
}

export function ChildrenHero() {
  return (
    <header className="kids-hero">
      <div className="kids-hero__grid kids-wrap">
        <div className="kids-hero__head">
          <p className="kids-eyebrow">{CHILDREN_HERO.eyebrow}</p>
          <h1>{CHILDREN_HERO.title}</h1>
        </div>
        <p className="kids-hero__lead">{CHILDREN_HERO.subtitle}</p>

        <div className="kids-chart">
          <ol className="kids-chart__bars" aria-label="Age groups">
            {CHILDREN_GROUPS.map((group, index) => (
              <HeroBar key={group.id} group={group} index={index} />
            ))}
          </ol>
          <div className="kids-chart__rule" aria-hidden>
            {CHILDREN_GROUPS.map((group) => (
              <span
                key={group.id}
                className="kids-chart__tick"
                style={{ "--bar-reach": group.ages.to / SCALE_MAX } as CSSProperties}
              >
                {group.ages.to}
              </span>
            ))}
          </div>
        </div>

        <div className="kids-hero__actions">
          <a
            href="#age-groups"
            className="life-cta kids-cta"
            onClick={(event) => onGlideLink(event, "age-groups")}
          >
            {CHILDREN_HERO.findLabel}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
