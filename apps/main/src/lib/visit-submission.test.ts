import { describe, expect, it } from "vitest";
import { visitorInsert } from "./visit-submission";

const fields = {
  name: "  Sarah Jenkins ",
  email: " sarah@example.com ",
  phone: " 07000 000000 ",
  branch: " Reading ",
  gathering: " Next Sunday ",
  children: true,
  consent: true,
  site: "Main site" as const,
};

describe("visitorInsert", () => {
  it("saves a visit the content studio can read, with consent recorded", () => {
    expect(visitorInsert(fields)).toEqual({
      ok: true,
      row: {
        name: "Sarah Jenkins",
        email: "sarah@example.com",
        phone: "07000 000000",
        branch_name: "Reading",
        message: [
          "May contact: yes",
          "Site: Main site",
          "Plan your visit for Reading.",
          "Gathering: Next Sunday.",
          "Bringing children (ages 0-12).",
        ].join("\n"),
      },
    });
  });

  it("refuses to store details when they have not agreed to be contacted", () => {
    const result = visitorInsert({ ...fields, consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/contact you/);
    }
  });

  it("needs a name and a real email", () => {
    expect(visitorInsert({ ...fields, name: "  " }).ok).toBe(false);
    expect(visitorInsert({ ...fields, email: "not-an-email" }).ok).toBe(false);
  });

  it("keeps an empty phone empty and names the site when no branch was chosen", () => {
    const result = visitorInsert({ ...fields, phone: " ", branch: " ", children: false });
    expect(result.ok && result.row.phone).toBeNull();
    expect(result.ok && result.row.branch_name).toBe("Main site");
    expect(result.ok && result.row.message).toContain("No children noted.");
  });
});
