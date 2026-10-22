import { describe, expect, it } from "vitest";
import { getRestoredPosition, parseScrollSnapshot } from "./scroll-restoration";

describe("reload reading position", () => {
  it("restores the saved position when there is no section anchor", () => {
    const saved = parseScrollSnapshot('{"x":0,"y":1840}');
    expect(saved && getRestoredPosition(saved)).toEqual({ left: 0, top: 1840 });
  });

  it("stays at the same point within a section after content above it changes height", () => {
    const saved = parseScrollSnapshot('{"x":0,"y":1800,"anchorId":"faith","anchorOffset":200}');
    expect(saved && getRestoredPosition(saved, 1900)).toEqual({ left: 0, top: 2100 });
  });

  it("uses the saved position until the section is available", () => {
    const saved = parseScrollSnapshot(
      '{"x":0,"y":1800,"anchorId":"about-panel-leadership","anchorOffset":200}',
    );
    expect(saved && getRestoredPosition(saved)).toEqual({ left: 0, top: 1800 });
  });

  it.each([null, "broken", "null", '{"x":0}', '{"x":0,"y":-3}', '{"x":"0","y":20}'])(
    "ignores invalid saved state: %s",
    (value) => {
      expect(parseScrollSnapshot(value)).toBeNull();
    },
  );
});
