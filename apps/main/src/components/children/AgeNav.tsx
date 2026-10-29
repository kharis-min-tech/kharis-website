"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CHILDREN_GROUPS, groupAgeLabel, groupTone } from "@/data/children-groups";
import { glideToSection } from "./glide";

/** Fixed site header height (h-[4.5rem]). */
const HEADER_HEIGHT_PX = 72;

/** Sticky three-way switcher; the group under the navigator is underlined in its own colour. */
export function AgeNav() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const sections = CHILDREN_GROUPS.map((group) => document.getElementById(group.id)).filter(
      (section): section is HTMLElement => section !== null,
    );
    const visible = new Set<string>();

    /* A thin band just below the navigator: whichever group crosses it is the one being read. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(sections.find((section) => visible.has(section.id))?.id ?? null);
      },
      { rootMargin: `-${HEADER_HEIGHT_PX + nav.offsetHeight + 1}px 0px -60% 0px` },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav ref={navRef} className="kids-agenav" aria-label="Age groups">
      <ul className="kids-agenav__list kids-wrap">
        {CHILDREN_GROUPS.map((group) => (
          <li key={group.id}>
            <a
              href={`#${group.id}`}
              className="kids-agenav__link"
              aria-current={active === group.id ? "location" : undefined}
              style={{ "--agenav-mark": groupTone(group, "numeral") } as CSSProperties}
              onClick={(event) => {
                event.preventDefault();
                setActive(group.id);
                glideToSection(group.id);
              }}
            >
              <span className="kids-agenav__name">{group.name}</span>
              <span className="kids-agenav__ages">{groupAgeLabel(group)}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
