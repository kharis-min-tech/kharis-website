"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import type { ChildrenGroup, ChildrenLayout } from "@/data/children-groups";
import { ConfirmBadge } from "./ConfirmBadge";
import { PlaceholderImage } from "./PlaceholderImage";

type Bento = Extract<ChildrenLayout, { kind: "bento" }>;

function FlipTile({
  title,
  kicker,
  confirm,
  index,
}: {
  title: string;
  kicker: string;
  confirm: string;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className="kids-bento__tile kids-flip"
      style={{ "--i": index } as CSSProperties}
      aria-pressed={flipped}
      onClick={() => setFlipped((open) => !open)}
    >
      <span className="kids-flip__inner">
        <span className="kids-flip__face kids-flip__face--front" aria-hidden={flipped}>
          <span className="kids-bento__kicker">{kicker}</span>
          <span className="kids-bento__title">{title}</span>
        </span>
        <span className="kids-flip__face kids-flip__face--back" aria-hidden={!flipped}>
          <ConfirmBadge what={confirm} inline />
        </span>
      </span>
    </button>
  );
}

/** Transition: a comic-panel grid. The discussion tiles flip; the rest stay put. */
export function BentoLayout({ group, layout }: { group: ChildrenGroup; layout: Bento }) {
  const [lead, ...shots] = group.photos;
  const talkStart = 2;
  const afterTalks = talkStart + layout.realTalk.length;

  return (
    <>
      <div className="kids-bento">
        {lead ? (
          <figure className="kids-bento__tile kids-bento__photo" style={{ "--i": 0 } as CSSProperties}>
            <PlaceholderImage slot={lead} fill />
          </figure>
        ) : null}

        <div className="kids-bento__tile kids-bento__statement" style={{ "--i": 1 } as CSSProperties}>
          <h3>{group.headline}</h3>
          <p>{group.body}</p>
        </div>

        {layout.realTalk.map((theme, index) => (
          <FlipTile
            key={theme.id}
            title={theme.title}
            kicker={layout.kicker}
            confirm={`The line for ${theme.title}.`}
            index={talkStart + index}
          />
        ))}

        <div className="kids-bento__tile kids-bento__teaching" style={{ "--i": afterTalks } as CSSProperties}>
          <p className="kids-bento__title">{layout.teaching}</p>
        </div>

        <blockquote
          className="kids-bento__tile kids-bento__scripture"
          style={{ "--i": afterTalks + 1 } as CSSProperties}
        >
          <p>&ldquo;{layout.scripture.text}&rdquo;</p>
          <cite>{layout.scripture.reference}</cite>
        </blockquote>

        <div className="kids-bento__tile kids-bento__path" style={{ "--i": afterTalks + 2 } as CSSProperties}>
          <p className="kids-bento__kicker">{layout.pathway.label}</p>
          <ol className="kids-path">
            {layout.pathway.steps.map((step) => (
              <li key={step.label}>
                {step.href ? <Link href={step.href}>{step.label}</Link> : <span>{step.label}</span>}
              </li>
            ))}
          </ol>
        </div>

        {shots.length > 0 ? (
          <div className="kids-bento__shots">
            {shots.map((slot, index) => (
              <figure
                key={slot.id}
                className="kids-bento__tile kids-bento__shot"
                style={{ "--i": afterTalks + 3 + index } as CSSProperties}
              >
                <PlaceholderImage slot={slot} />
              </figure>
            ))}
          </div>
        ) : null}
      </div>

      <ConfirmBadge what={layout.realTalkConfirm} />

      <div className="kids-bento-faq">
        {layout.questions.map((item) => (
          <details key={item.id} className="kids-bento-faq__item">
            <summary>{item.question}</summary>
            <ConfirmBadge what={item.confirm} />
          </details>
        ))}
      </div>
    </>
  );
}
