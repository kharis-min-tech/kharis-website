"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MessageCard } from "@/components/LatestMessages";
import {
  MESSAGE_TOPICS,
  matchesQuery,
  matchesTopic,
  messageYear,
  messageYears,
} from "@/lib/message-filters";
import type { MessageVideo } from "@/lib/youtube";

export function MessageBrowser({ messages }: { messages: MessageVideo[] }) {
  const latest = messages.slice(0, 4);
  const [topic, setTopic] = useState("all");
  const [year, setYear] = useState<number | "all">("all");
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query.trim());
  const years = useMemo(() => messageYears(messages), [messages]);
  const topics = useMemo(
    () =>
      MESSAGE_TOPICS.filter((item) => messages.some((message) => matchesTopic(message, item.id))),
    [messages],
  );
  const filtering = topic !== "all" || year !== "all" || search !== "";
  const visible = useMemo(() => {
    const pool = filtering ? messages : messages.slice(4);
    return pool.filter(
      (message) =>
        (topic === "all" || matchesTopic(message, topic)) &&
        (year === "all" || messageYear(message) === year) &&
        matchesQuery(message, search),
    );
  }, [filtering, messages, search, topic, year]);

  const clear = () => {
    setTopic("all");
    setYear("all");
    setQuery("");
  };

  if (latest.length === 0) return null;

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
          <label className="kp-filters__year">
            <span className="material-symbols-outlined" aria-hidden="true">
              calendar_today
            </span>
            <select
              aria-label="Filter by year"
              value={year}
              onChange={(event) =>
                setYear(event.target.value === "all" ? "all" : Number(event.target.value))
              }
            >
              <option value="all">Year</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
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
              <p>Try another topic, year, or a shorter search.</p>
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
