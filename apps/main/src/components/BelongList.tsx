"use client";

import { useState } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { LIFE_CHILDREN_IMAGE } from "@/lib/life-content";

type BelongItem = {
  id: "baptism" | "departments" | "fasting" | "children";
  tag: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  alt?: string;
  placeholder?: string;
  panel?: { eyebrow: string; title: string };
};

const ITEMS: BelongItem[] = [
  {
    id: "baptism",
    tag: "BELONG",
    title: "Baptism",
    description:
      "A public declaration that you identify with Jesus Christ's death, burial and resurrection, walking in newness of life.",
    href: "/life/baptism",
    image: "/images/baptism-illustration.jpeg",
    alt: "Illustration of two people being baptised beneath a dove",
  },
  {
    id: "departments",
    tag: "SERVE",
    title: "Departments",
    description:
      "Serving is part of our worship. From ushers to music to hospitality, every believer has a role in God's house.",
    href: "/life/departments",
    placeholder: "Serving with purpose in the Kharis family",
    panel: { eyebrow: "SERVE", title: "WITH PURPOSE" },
  },
  {
    id: "fasting",
    tag: "FASTING",
    title: "Fasting",
    description:
      "We abstain from food to signal dependence on God, fasting joined with prayer, as a church family seeking His purpose.",
    href: "/life/fasting",
    image: "/images/life-fasting.jpg",
    alt: "A Kharis worshipper praising during a church service",
    panel: { eyebrow: "SEEK GOD", title: "WITH PURPOSE" },
  },
  {
    id: "children",
    tag: "KIDS",
    title: "Children's department",
    description:
      "Fun, vibrant, and full of life. We partner with parents to help children discover who God is through Bible teaching, worship, and friendship.",
    href: "/life/children",
    image: LIFE_CHILDREN_IMAGE,
    alt: "Children reading a Bible together",
  },
];

function PreviewImage({ item, priority = false }: { item: BelongItem; priority?: boolean }) {
  return (
    <div
      className={`life-belong__image${item.placeholder ? " life-belong__image--type" : ""}${
        item.id === "children" ? " life-belong__image--children" : ""
      }`}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.alt ?? ""}
          fill
          priority={priority}
          loading="eager"
          sizes="(max-width: 760px) 100vw, 48vw"
          className={item.id === "children" ? "object-contain" : "object-cover"}
        />
      ) : item.panel ? (
        <div className="life-belong__type-panel" role="img" aria-label={item.placeholder}>
          <span>{item.panel.eyebrow}</span>
          <strong>{item.panel.title}</strong>
          <i aria-hidden="true" />
        </div>
      ) : null}
    </div>
  );
}

function ActionLink({
  item,
  onLearnMore,
}: {
  item: BelongItem;
  onLearnMore: (id: "baptism" | "fasting") => void;
}) {
  const id = item.id;
  if (id === "baptism" || id === "fasting") {
    return (
      <button
        type="button"
        className="life-refresh__button life-belong__action"
        onClick={() => onLearnMore(id)}
      >
        LEARN MORE
        <Icon name="arrow" className="h-4 w-4" />
      </button>
    );
  }
  return (
    <Link href={item.href} className="life-refresh__button life-belong__action">
      LEARN MORE
      <Icon name="arrow" className="h-4 w-4" />
    </Link>
  );
}

export function BelongList({ onLearnMore }: { onLearnMore: (id: "baptism" | "fasting") => void }) {
  const [activeId, setActiveId] = useState(ITEMS[0].id);
  const [expandedId, setExpandedId] = useState<string | null>(ITEMS[0].id);
  const active = ITEMS.find((item) => item.id === activeId) ?? ITEMS[0];

  return (
    <div className="life-belong">
      <div className="life-belong__desktop">
        <div className="life-belong__list" role="list" aria-label="Ways to belong at Kharis">
          {ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              role="listitem"
              className={`life-belong__row${activeId === item.id ? " is-active" : ""}`}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              onClick={(event) => {
                if (item.id === "baptism" || item.id === "fasting") {
                  event.preventDefault();
                  onLearnMore(item.id);
                }
              }}
            >
              <span className="life-belong__row-tag">{item.tag}</span>
              <span className="life-belong__row-title">{item.title}</span>
              <Icon name="arrow" className="life-belong__row-arrow h-5 w-5" />
            </Link>
          ))}
        </div>
        <div className="life-belong__preview" aria-live="polite">
          <div className="life-belong__visual">
            {ITEMS.map((item) => (
              <div
                key={item.id}
                className={`life-belong__visual-image${item.id === active.id ? " is-active" : ""}`}
                aria-hidden={item.id !== active.id}
              >
                <PreviewImage item={item} priority={item.id === ITEMS[0].id} />
              </div>
            ))}
          </div>
          <div className="life-belong__details">
            <p className="life-belong__details-tag">{active.tag}</p>
            <h3>{active.title}</h3>
            <p className="life-belong__description">{active.description}</p>
            <ActionLink item={active} onLearnMore={onLearnMore} />
          </div>
        </div>
      </div>

      <div className="life-belong__mobile" aria-label="Ways to belong at Kharis">
        {ITEMS.map((item) => {
          const expanded = expandedId === item.id;
          return (
            <article
              className={`life-belong__accordion${expanded ? " is-open" : ""}`}
              key={item.id}
            >
              <button
                type="button"
                className="life-belong__accordion-trigger"
                aria-expanded={expanded}
                aria-controls={`life-belong-${item.id}`}
                onClick={() => {
                  setExpandedId(expanded ? null : item.id);
                  setActiveId(item.id);
                }}
              >
                <span className="life-belong__row-tag">{item.tag}</span>
                <span className="life-belong__row-title">{item.title}</span>
                <span className="life-belong__accordion-icon" aria-hidden="true">
                  {expanded ? "−" : "+"}
                </span>
              </button>
              {expanded ? (
                <div className="life-belong__accordion-content" id={`life-belong-${item.id}`}>
                  <PreviewImage item={item} priority={item.id === ITEMS[0].id} />
                  <p className="life-belong__description">{item.description}</p>
                  <ActionLink item={item} onLearnMore={onLearnMore} />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
