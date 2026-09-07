"use client";

import { useId } from "react";

const TEASER_CHARS = 160;

function excerpt(text: string, max = TEASER_CHARS) {
  const clean = text.replace(/^["“]|["”]$/g, "").trim();
  if (clean.length <= max) return { teaser: clean, truncated: false };
  const cut = clean.slice(0, max).replace(/\s+\S*$/, "").trim();
  return { teaser: `${cut}…`, truncated: true };
}

export function TestimonyQuote({
  quote,
  name,
  meta,
  className = "font-body-lg italic text-on-surface leading-relaxed",
  moreClassName = "mt-3 font-label-md uppercase tracking-widest text-primary hover:underline",
}: {
  quote: string;
  name: string;
  meta?: string;
  className?: string;
  moreClassName?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const reactId = useId().replace(/:/g, "");
  const dialogId = `testimony-${reactId}`;
  const { teaser, truncated } = excerpt(quote);
  const body = quote.replace(/^["“]|["”]$/g, "");

  return (
    <>
      <p className={className}>{teaser}</p>
      {truncated ? (
        <>
          <button
            type="button"
            data-ui="open-dialog"
            data-dialog={dialogId}
            className={moreClassName}
          >
            Read more
          </button>
          <dialog
            id={dialogId}
            className="ui-dialog testimony-dialog w-[min(42rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-3xl border border-on-background/10 bg-[#f5f7ff] p-6 sm:p-8"
          >
            <button
              type="button"
              data-ui="close-dialog"
              className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber text-[#1a0b00]"
              aria-label="Close testimony"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <span className="material-symbols-outlined text-4xl text-primary">format_quote</span>
            <p className="mt-2 pr-10 font-body-lg italic leading-relaxed whitespace-pre-wrap">
              {body}
            </p>
            <h3 className="mt-6 font-headline-md text-2xl uppercase">— {name}</h3>
            {meta ? <p className="mt-1 font-label-sm uppercase text-primary">{meta}</p> : null}
            <form method="dialog" className="mt-6">
              <button
                type="submit"
                className="rounded-2xl bg-amber px-6 py-3 font-label-md uppercase text-[#1a0b00]"
              >
                Close
              </button>
            </form>
          </dialog>
        </>
      ) : null}
    </>
  );
}
