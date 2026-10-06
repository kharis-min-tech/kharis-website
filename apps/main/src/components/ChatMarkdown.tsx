"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the small, safe markdown subset Grace may produce (bold, italics,
 * lists, inline code, links) as React elements. Never injects raw HTML.
 */

const SITE_PATHS = [
  "life",
  "locations",
  "messages",
  "contact",
  "give",
  "about",
  "events",
  "governance",
];

const SITE_PATH = `/(?:${SITE_PATHS.join("|")})(?:/[a-z0-9-]+)*(?:\\?[\\w=&%-]+)?`;
const SITE_PATH_EXACT = new RegExp(`^${SITE_PATH}$`, "i");
const URL_EXACT = /^(?:https?:\/\/|mailto:)\S+$/i;

type Ctx = {
  onContactClick?: () => void;
  onNavigate?: () => void;
};

type Rule = {
  re: RegExp;
  render: (m: RegExpExecArray, key: string, ctx: Ctx) => ReactNode;
};

function cleanText(text: string): string {
  return text.replace(/\*\*|__|`/g, "");
}

function shortUrl(url: string): string {
  const bare = url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
  return bare.length > 34 ? `${bare.slice(0, 32)}…` : bare;
}

function SiteLink({
  href,
  label,
  ctx,
}: {
  href: string;
  label?: ReactNode;
  ctx: Ctx;
}) {
  const text = label ?? href.split("?")[0];
  if (/^\/contact(\?|$)/i.test(href) && ctx.onContactClick) {
    return (
      <button
        type="button"
        className="life-chat__link life-chat__link--button"
        onClick={ctx.onContactClick}
      >
        {text}
      </button>
    );
  }
  return (
    <Link href={href} className="life-chat__link" onClick={ctx.onNavigate}>
      {text}
    </Link>
  );
}

function ExternalLink({ href, label }: { href: string; label: ReactNode }) {
  const isMail = href.toLowerCase().startsWith("mailto:");
  return (
    <a
      href={href}
      className="life-chat__link"
      {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {label}
    </a>
  );
}

function linkFor(href: string, label: ReactNode, key: string, ctx: Ctx) {
  if (SITE_PATH_EXACT.test(href)) {
    return <SiteLink key={key} href={href} label={label} ctx={ctx} />;
  }
  if (URL_EXACT.test(href)) {
    return <ExternalLink key={key} href={href} label={label} />;
  }
  return <span key={key}>{label}</span>;
}

/** Order matters: earlier rules win when two match at the same index. */
const RULES: Rule[] = [
  {
    re: /\[([^\]\n]+)\]\(([^)\s]+)\)/,
    render: (m, key, ctx) =>
      linkFor(m[2], renderInline(m[1], ctx, key), key, ctx),
  },
  {
    re: /`([^`\n]+)`/,
    render: (m, key, ctx) => {
      const inner = m[1].trim();
      if (SITE_PATH_EXACT.test(inner) || URL_EXACT.test(inner)) {
        return linkFor(
          inner,
          SITE_PATH_EXACT.test(inner) ? undefined : shortUrl(inner),
          key,
          ctx,
        );
      }
      return (
        <span key={key} className="life-chat__code">
          {inner}
        </span>
      );
    },
  },
  {
    re: /\*\*(?!\s)([^\n]+?)\*\*|__(?!\s)([^\n]+?)__/,
    render: (m, key, ctx) => (
      <strong key={key}>{renderInline(m[1] ?? m[2], ctx, key)}</strong>
    ),
  },
  {
    re: /(^|[^\w*])\*(?![\s*])([^*\n]+?)\*(?![\w*])/,
    render: (m, key, ctx) => (
      <span key={key}>
        {m[1]}
        <em>{renderInline(m[2], ctx, key)}</em>
      </span>
    ),
  },
  {
    re: /https?:\/\/[^\s<>()[\]]*[^\s<>()[\].,;:!?'"]/i,
    render: (m, key) => (
      <ExternalLink key={key} href={m[0]} label={shortUrl(m[0])} />
    ),
  },
  {
    re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/,
    render: (m, key) => (
      <ExternalLink key={key} href={`mailto:${m[0]}`} label={m[0]} />
    ),
  },
  {
    re: new RegExp(`(^|[\\s("'])(${SITE_PATH})(?=$|[\\s.,;:!?)"'])`, "i"),
    render: (m, key, ctx) => (
      <span key={key}>
        {m[1]}
        <SiteLink href={m[2]} ctx={ctx} />
      </span>
    ),
  },
];

function renderInline(text: string, ctx: Ctx, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let i = 0;
  while (rest) {
    let best: { m: RegExpExecArray; rule: Rule } | null = null;
    for (const rule of RULES) {
      const m = rule.re.exec(rest);
      if (m && (!best || m.index < best.m.index)) best = { m, rule };
    }
    if (!best) {
      out.push(cleanText(rest));
      break;
    }
    if (best.m.index > 0) out.push(cleanText(rest.slice(0, best.m.index)));
    out.push(best.rule.render(best.m, `${keyPrefix}-${i++}`, ctx));
    rest = rest.slice(best.m.index + best.m[0].length);
  }
  return out;
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[]; start: number };

const UL_ITEM = /^[-*•·]\s+(.*)$/;
const OL_ITEM = /^(\d+)[.)]\s+(.*)$/;

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  /** Whether the next line may continue the last block (no blank line between). */
  let open = false;

  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const indented = /^\s{2,}\S/.test(raw);
    let line = raw.trim();
    if (!line || /^([-*_])\1{2,}$/.test(line)) {
      open = false;
      continue;
    }
    line = line.replace(/^#{1,6}\s+/, "").replace(/^>\s?/, "");

    const ul = UL_ITEM.exec(line);
    const ol = ul ? null : OL_ITEM.exec(line);
    const prev = blocks[blocks.length - 1];
    const last = open ? prev : undefined;

    if (ul) {
      if (prev?.type === "ul") prev.items.push(ul[1]);
      else blocks.push({ type: "ul", items: [ul[1]] });
    } else if (ol) {
      if (prev?.type === "ol") prev.items.push(ol[2]);
      else {
        blocks.push({ type: "ol", items: [ol[2]], start: Number(ol[1]) || 1 });
      }
    } else if (last && last.type !== "p" && indented) {
      last.items[last.items.length - 1] += ` ${line}`;
    } else if (last?.type === "p") {
      last.lines.push(line);
    } else {
      blocks.push({ type: "p", lines: [line] });
    }
    open = true;
  }
  return blocks;
}

export function ChatMarkdown({
  text,
  onContactClick,
  onNavigate,
}: {
  text: string;
  onContactClick?: () => void;
  onNavigate?: () => void;
}) {
  const ctx: Ctx = { onContactClick, onNavigate };
  const blocks = parseBlocks(text);
  if (!blocks.length) return null;

  return (
    <div className="life-chat__md">
      {blocks.map((block, bi) => {
        const key = `b${bi}`;
        if (block.type === "p") {
          return (
            <p key={key} className="life-chat__p">
              {block.lines.map((line, li) => (
                <span key={li}>
                  {li > 0 ? <br /> : null}
                  {renderInline(line, ctx, `${key}-${li}`)}
                </span>
              ))}
            </p>
          );
        }
        const items = block.items.map((item, li) => (
          <li key={li}>{renderInline(item, ctx, `${key}-${li}`)}</li>
        ));
        return block.type === "ol" ? (
          <ol
            key={key}
            className="life-chat__list life-chat__list--ol"
            start={block.start}
          >
            {items}
          </ol>
        ) : (
          <ul key={key} className="life-chat__list">
            {items}
          </ul>
        );
      })}
    </div>
  );
}
