import type { MessageVideo } from "./youtube";

/** Curated shelves can prioritise a series, so choose the hero by publication date. */
export function newestMessage(messages: readonly MessageVideo[]): MessageVideo | undefined {
  return messages.reduce<MessageVideo | undefined>((newest, message) => {
    const published = Date.parse(message.publishedAt ?? "") || 0;
    const previous = Date.parse(newest?.publishedAt ?? "") || 0;
    return !newest || published > previous ? message : newest;
  }, undefined);
}
