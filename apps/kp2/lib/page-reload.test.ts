import { describe, expect, it } from "vitest";
import { pageReloadAction, pageReloadStorageKey } from "./page-reload";

describe("pageReloadAction", () => {
  it("reloads once when this address has not failed yet", () => {
    expect(pageReloadAction(null, "stamp-a")).toBe("reload");
  });

  it("waits when this document already started a reload", () => {
    expect(pageReloadAction("stamp-a", "stamp-a")).toBe("wait");
  });

  it("shows the message when a full load already failed", () => {
    expect(pageReloadAction("stamp-a", "stamp-b")).toBe("show");
    expect(pageReloadAction("manual", "stamp-b")).toBe("show");
  });
});

describe("pageReloadStorageKey", () => {
  it("includes the path and query so each address recovers on its own", () => {
    expect(pageReloadStorageKey("/kp2/events", "?when=sunday")).toBe(
      "kp-page-reload:/kp2/events?when=sunday",
    );
  });
});
