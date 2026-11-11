"use client";

import type { MouseEvent } from "react";
import { Icon } from "@/components/Icon";
import { CHILDREN_HERO } from "@/data/children-groups";
import { glideToSection } from "./glide";

function onGlideLink(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  glideToSection(id);
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
