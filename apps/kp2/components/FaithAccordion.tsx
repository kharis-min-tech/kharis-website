"use client";

import { useState } from "react";

export function FaithAccordion({ statements }: { statements: { title: string; body: string }[] }) {
  const [expanded, setExpanded] = useState<number[]>([]);
  const allOpen = expanded.length === statements.length;
  return (
    <section className="kp-faith py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-label-md text-primary uppercase tracking-[0.3em] block mb-3">
              Believe
            </span>
            <h2 className="font-display-lg text-headline-lg md:text-display-lg uppercase leading-none">
              Our Statement of Faith
            </h2>
          </div>
          <button
            type="button"
            className="kp-depth-button kp-button-light px-5 py-3 font-label-md text-sm uppercase shrink-0 self-start"
            onClick={() => setExpanded(allOpen ? [] : statements.map((_, i) => i))}
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <div className="space-y-4">
          {statements.map((statement, i) => {
            const open = expanded.includes(i);
            return (
              <div key={statement.title} className={`kp-faith-item ${open ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="kp-faith-question no-accent-fill"
                  aria-expanded={open}
                  aria-controls={`kp-faith-answer-${i}`}
                  id={`kp-faith-question-${i}`}
                  onClick={() =>
                    setExpanded((current) =>
                      open ? current.filter((value) => value !== i) : [...current, i],
                    )
                  }
                >
                  <span className="font-display-lg text-xl text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-headline-md text-headline-md uppercase">
                    {statement.title}
                  </span>
                  <span className="kp-faith-toggle" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </button>
                <div className="kp-faith-answer" aria-hidden={!open} inert={!open}>
                  <div className="kp-faith-inner">
                    <p
                      id={`kp-faith-answer-${i}`}
                      role="region"
                      aria-labelledby={`kp-faith-question-${i}`}
                      className="font-body-lg text-body-lg text-on-surface-variant"
                    >
                      {statement.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
