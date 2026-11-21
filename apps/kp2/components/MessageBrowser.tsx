"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MessageCard } from "@/components/LatestMessages";
import { VisitInstead } from "@/components/VisitInstead";
import { MESSAGE_TOPICS, matchesQuery, matchesTopic } from "@/lib/message-filters";
import { buildMessageShelves } from "@/lib/message-shelves";
import type { MessageVideo } from "@/lib/youtube";

export function MessageBrowser({
  messages,
  latest,
}: {
  messages: MessageVideo[];
  latest: MessageVideo[];
}) {
  const [topic, setTopic] = useState("all");
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query.trim());
  const topics = useMemo(
    () =>
      MESSAGE_TOPICS.filter((item) => messages.some((message) => matchesTopic(message, item.id))),
    [messages],
  );
  const filtering = topic !== "all" || search !== "";
  const visible = useMemo(() => {
    return messages.filter(
      (message) =>
        (topic === "all" || matchesTopic(message, topic)) && matchesQuery(message, search),
    );
  }, [messages, search, topic]);
  const visibleRows = useMemo(() => {
    const rows: MessageVideo[][] = [];
    for (let index = 0; index < visible.length; index += 4) {
      rows.push(visible.slice(index, index + 4));
    }
    return rows;
  }, [visible]);
  const shelves = useMemo(() => {
    const latestIds = new Set(latest.map((message) => message.id));
    return buildMessageShelves(messages.filter((message) => !latestIds.has(message.id)));
  }, [latest, messages]);
  const topicLabel = MESSAGE_TOPICS.find((item) => item.id === topic)?.label;
  const filterHeading = [
    search ? `“${search}”` : null,
    topicLabel ?? (search ? null : "All messages"),
  ]
    .filter(Boolean)
    .join(" · ");

  const clear = () => {
    setTopic("all");
    setQuery("");
  };

  if (messages.length === 0 && latest.length === 0) {
    return (
      <section className="kp-latest" id="latest-messages" aria-label="Latest messages">
        <div className="kp-latest__inner">
          <h2 className="kp-latest__title">Latest messages</h2>
          <VisitInstead title="No messages just yet">
            Teachings show up here after they are preached. Until then, find a branch and come to
            Sunday service.
          </VisitInstead>
        </div>
      </section>
    );
  }

  return (
    <section className="kp-latest" id="latest-messages" aria-label="Latest messages">
      <div className="kp-latest__inner">
        <h2 className="kp-latest__title">Latest messages</h2>
        <div className="kp-latest__row">
          {latest.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>

        <div className="kp-filters" aria-label="Filter messages">
          <div className="kp-filters__topics" role="group" aria-label="Filter by topic">
            <button
              type="button"
              className="kp-filters__chip"
              aria-pressed={topic === "all"}
              onClick={() => setTopic("all")}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                grid_view
              </span>
              All
            </button>
            {topics.map((item) => (
              <button
                key={item.id}
                type="button"
                className="kp-filters__chip"
                aria-pressed={topic === item.id}
                onClick={() => setTopic(item.id)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          <label className="kp-filters__search">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messages"
              aria-label="Search messages"
              autoComplete="off"
            />
          </label>
        </div>

        <div className="kp-browse">
          {filtering && visible.length > 0 ? (
            <div className="kp-browse__results">
              <div className="kp-browse__results-head">
                <h3>{filterHeading}</h3>
                <p aria-live="polite">
                  {visible.length === 1 ? "1 message" : `${visible.length} messages`}
                </p>
                <button type="button" onClick={clear}>
                  Clear
                </button>
              </div>
              <div className="kp-browse__rows">
                {visibleRows.map((row, rowIndex) => (
                  <div key={`filtered-${rowIndex}`} className="kp-browse__grid">
                    {row.map((message) => (
                      <MessageCard key={message.id} message={message} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : filtering ? (
            <div className="kp-browse__empty">
              <h3>No messages match that</h3>
              <p>Try another topic or a shorter search.</p>
              <button type="button" onClick={clear}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="kp-browse__shelves">
              {shelves.map((shelf) => (
                <section key={shelf.id} aria-label={shelf.title}>
                  <h3 className="mb-5 border-b-2 border-on-background pb-3 font-display-lg text-2xl uppercase tracking-tight text-on-background sm:text-3xl">
                    {shelf.title}
                  </h3>
                  <div className="kp-browse__rows">
                    {shelf.rows.map((row, rowIndex) => (
                      <div key={`${shelf.id}-${rowIndex}`} className="kp-browse__grid">
                        {row.map((message) => (
                          <MessageCard key={message.id} message={message} />
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
