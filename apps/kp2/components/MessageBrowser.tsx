"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MessageCard } from "@/components/LatestMessages";
import { VisitInstead } from "@/components/VisitInstead";
import { MESSAGE_TOPICS, matchesQuery, matchesTopic } from "@/lib/message-filters";
import type { MessageVideo } from "@/lib/youtube";

export function MessageBrowser({ messages }: { messages: MessageVideo[] }) {
  const latest = messages.slice(0, 4);
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
    const pool = filtering ? messages : messages.slice(4);
    return pool.filter(
      (message) =>
        (topic === "all" || matchesTopic(message, topic)) && matchesQuery(message, search),
    );
  }, [filtering, messages, search, topic]);

  const clear = () => {
    setTopic("all");
    setQuery("");
  };

  if (latest.length === 0) {
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
          <p className="kp-browse__count" aria-live="polite">
            {visible.length === 1 ? "1 message" : `${visible.length} messages`}
            {filtering ? (
              <button type="button" onClick={clear}>
                Clear
              </button>
            ) : null}
          </p>
          {visible.length > 0 ? (
            <div className="kp-browse__grid">
              {visible.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <div className="kp-browse__empty">
              <h3>No messages match that</h3>
              <p>Try another topic or a shorter search.</p>
              <button type="button" onClick={clear}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
