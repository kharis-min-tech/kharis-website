import { describe, expect, it } from "vitest";
import { publicTransportInfo } from "../../../../shared/public-transport";

describe("public transport guidance", () => {
  it.each(["Brighton", "Croydon", "Birmingham", "Freetown", "Kensington High Street"])(
    "removes the imported five-minute claim about %s Station",
    (station) => {
      const text = publicTransportInfo(
        `The venue is approximately five minutes from ${station} Station.`,
      );
      expect(text).not.toMatch(/five minutes|Station/);
      expect(text).toContain("Check live public transport routes");
    },
  );
  it("preserves specific branch travel guidance", () => {
    const text = "Nearest Bus Stops: St Peter’s Church (S), North Road East (S)";
    expect(publicTransportInfo(text)).toBe(text);
  });
  it.each([null, undefined, "", "  "])("handles missing guidance", (text) => {
    expect(publicTransportInfo(text)).toContain("contact the branch");
  });
});
