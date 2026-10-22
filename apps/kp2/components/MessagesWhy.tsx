"use client";

import { useState } from "react";
import "./messages-why.css";

const ITEMS = [
  {
    q: "Why should I listen to messages?",
    a: "The Bible says faith comes by hearing, and hearing by the Word of God. This shows that faith is not a one-time event but a continuous process. Good preaching does not just build faith. It also helps spiritual maturity, guarding believers against being led astray by false teaching.",
  },
  {
    q: "What makes Kharis messages different?",
    a: "Text-driven, Christ exalting and gospel-saturated.",
  },
  {
    q: "Where can I watch?",
    a: "Watch on this Messages page or YouTube. Prefer audio? Listen on the Kharis App, SoundCloud, Apple Podcasts, Spotify and more.",
  },
  {
    q: "How often are new messages added?",
    a: "New messages are added weekly from Sunday services and series. Browse the rows above for the newest and older archive messages.",
  },
  {
    q: "Can I go deeper in the Word at home?",
    a: "Yes. Keep the Word on your lips and in your heart (Joshua 1:8). Replay messages until truth settles, then share what God is saying.",
  },
  {
    q: "Is Scripture really for my situation?",
    a: "“All Scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness,” 2 Timothy 3:16. “For the word of God is living and powerful” Hebrews 4:12.",
  },
];

export function MessagesWhy() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="kp-why" aria-labelledby="kp-why-title">
      <div className="kp-why__wrap">
        <p className="kp-why__narration">Faith comes by hearing</p>
        <h2 id="kp-why-title" className="kp-why__title">
          Why listen to messages
        </h2>
        <ul className="kp-why__list">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className={`kp-why__item${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="kp-why__q"
                  aria-expanded={isOpen}
                  aria-controls={`kp-why-a-${i}`}
                  id={`kp-why-q-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="kp-why__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="kp-why__ask">{item.q}</span>
                  <span className="kp-why__plus" aria-hidden="true">
                    +
                  </span>
                </button>
                <div className="kp-why__a" aria-hidden={!isOpen} inert={!isOpen}>
                  <div className="kp-why__a-inner">
                    <p id={`kp-why-a-${i}`} role="region" aria-labelledby={`kp-why-q-${i}`}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
