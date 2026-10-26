import { describe, expect, it } from "vitest";
import { visitorInsert } from "./visit-submission";

describe("visitorInsert", () => {
  it("files a KP2 visit under the branch, with consent on the message", () => {
    const result = visitorInsert({
      name: "Ama Mensah",
      email: "ama@example.com",
      phone: "",
      branch: "KP2 London",
      gathering: "Sunday service",
      children: false,
      consent: true,
      site: "KP2",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.row.branch_name).toBe("KP2 London");
      expect(result.row.phone).toBeNull();
      expect(result.row.message).toContain("Site: KP2");
      expect(result.row.message).toContain("May contact: yes");
    }
  });

  it("refuses to store details when they have not agreed to be contacted", () => {
    expect(
      visitorInsert({
        name: "Ama",
        email: "ama@example.com",
        phone: "",
        branch: "KP2 London",
        gathering: "",
        children: false,
        consent: false,
        site: "KP2",
      }).ok,
    ).toBe(false);
  });
});
