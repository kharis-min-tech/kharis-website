import { displayMessageTitle, youtubeWatchUrl, type MessageVideo } from "@/lib/youtube";
import "./latest-messages.css";

export function MessageCard({ message }: { message: MessageVideo }) {
  const year = message.publishedAt
    ? new Date(message.publishedAt).toLocaleDateString("en-GB", {
        year: "numeric",
        timeZone: "Europe/London",
      })
    : null;

  return (
    <a className="kp-msg" href={youtubeWatchUrl(message.id)} target="_blank" rel="noreferrer">
      <span className="kp-msg__poster">
        <img src={message.thumbnail} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="kp-msg__body">
        <span className="kp-msg__title">{displayMessageTitle(message.title)}</span>
        {year ? <span className="kp-msg__year">{year}</span> : null}
        <span className="kp-msg__watch">
          Watch <span aria-hidden="true">→</span>
        </span>
      </span>
    </a>
  );
}

export function LatestMessages({ messages }: { messages: MessageVideo[] }) {
  const row = messages.slice(0, 4);
  if (row.length === 0) return null;

  return (
    <section className="kp-latest" id="latest-messages" aria-label="Latest messages">
      <div className="kp-latest__inner">
        <h2 className="kp-latest__title">Latest messages</h2>
        <div className="kp-latest__row">
          {row.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      </div>
    </section>
  );
}
