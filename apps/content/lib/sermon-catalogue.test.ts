import { describe, expect, it } from "vitest";
import { catalogueFromPayload, searchCatalogue } from "./sermon-catalogue";

const payload = {
  messages: [
    {
      id: "101897",
      title: "Christ: The Eternally Blessed God",
      speaker: "David Antwi",
      date_preached: "2026-09-27",
      scripture_refs: ["1 Timothy 3:16"],
      series: { id: "4", name: "1 Timothy" },
    },
    {
      id: "100",
      title: "Grace upon grace",
      speaker: "David Antwi",
      date_preached: "2024-01-02",
      scripture_refs: ["John 1:16"],
      series: null,
    },
  ],
};

describe("sermon catalogue", () => {
  it("reads the Cloudflare messages.json shape", () => {
    expect(catalogueFromPayload(payload)[0]).toMatchObject({
      id: "101897",
      speaker: "David Antwi",
      scripture: "1 Timothy 3:16",
      series: "1 Timothy",
    });
  });

  it("finds a sermon by title words", () => {
    const found = searchCatalogue(catalogueFromPayload(payload), "eternally blessed");
    expect(found.map((sermon) => sermon.id)).toEqual(["101897"]);
  });
});
