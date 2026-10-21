import { describe, expect, it } from "vitest";
import { visitorPayload, visitorToDraft } from "./visitors";

describe("visitorPayload", () => {
  it("saves the live visitors columns, trimmed, with blanks as null", () => {
    expect(
      visitorPayload(
        {
          name: "  Ama Mensah ",
          email: " ama@example.com ",
          phone: "",
          branch_name: "Reading",
          message: "  ",
        },
        "abc",
      ),
    ).toEqual({
      name: "Ama Mensah",
      email: "ama@example.com",
      phone: null,
      branch_name: "Reading",
      message: null,
      id: "abc",
    });
  });

  it("leaves the id out for a new visitor", () => {
    const payload = visitorPayload({ ...visitorToDraft({}), name: "Kofi" });
    expect(payload).not.toHaveProperty("id");
  });

  it("needs a name", () => {
    expect(() => visitorPayload(visitorToDraft({}))).toThrow("A visitor needs a name.");
  });
});

describe("visitorToDraft", () => {
  it("fills every field, turning nulls into empty text", () => {
    expect(visitorToDraft({ name: "Ama", email: null, branch_name: "Luton" })).toEqual({
      name: "Ama",
      email: "",
      phone: "",
      branch_name: "Luton",
      message: "",
    });
  });
});
