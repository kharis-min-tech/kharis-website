import { describe, expect, it } from "vitest";
import { contactHandoffUrl } from "./grace-handoff";

describe("contactHandoffUrl", () => {
  it("opens the contact letter with the ticket attached", () => {
    expect(contactHandoffUrl("GR-20261015-AB12")).toBe(
      "/contact?chatTicket=GR-20261015-AB12#write",
    );
  });
});
