"use client";

import { useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

type Props = {
  title?: string;
  items: FaqItem[];
};

export function MessagesFaq({
  title = "Why listen to messages",
  items,
}: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="msg-faq" aria-label={title}>
      <h2 className="msg-faq__title">{title}</h2>
      <div className="msg-faq__list">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className={`msg-faq__item${isOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="msg-faq__q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="msg-faq__icon" aria-hidden>
                  {isOpen ? "×" : "+"}
                </span>
              </button>
              {isOpen && <div className="msg-faq__a">{item.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
