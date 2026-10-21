import { describe, it, expect } from "vitest";
import { GIVING_BRANCHES, withStudioLinks } from "./giving";

const find = (list: ReturnType<typeof withStudioLinks>, name: string) =>
  list.find((b) => b.name === name)!;

describe("withStudioLinks", () => {
  it("keeps the built-in links when the studio has none", () => {
    const list = withStudioLinks(GIVING_BRANCHES, [{ slug: "london", giving_link: null }]);
    expect(list).toEqual(GIVING_BRANCHES);
  });

  it("uses a studio link in place of the built-in one", () => {
    const url = "https://give.tithe.ly/?formId=new-london";
    const london = find(
      withStudioLinks(GIVING_BRANCHES, [{ slug: "london", giving_link: url }]),
      "Kharis Church London",
    );
    expect(london.url).toBe(url);
  });

  it("matches the studio's misspelt Chelmsford slug", () => {
    const url = "https://give.tithe.ly/?formId=chelmsford";
    const branch = find(
      withStudioLinks(GIVING_BRANCHES, [{ slug: "chelmesford", giving_link: url }]),
      "Kharis Church Chelmsford",
    );
    expect(branch.url).toBe(url);
  });

  it("turns Accra into an online gift once the studio gives it a link", () => {
    const url = "https://example.org/accra-give";
    const accra = find(
      withStudioLinks(GIVING_BRANCHES, [{ slug: "accra", giving_link: url }]),
      "Kharis Church Accra",
    );
    expect(accra).toMatchObject({ kind: "online", url });
  });

  it("ignores links that are not https", () => {
    for (const bad of ["javascript:alert(1)", "http://insecure.example", "   ", "/giving"]) {
      const london = find(
        withStudioLinks(GIVING_BRANCHES, [{ slug: "london", giving_link: bad }]),
        "Kharis Church London",
      );
      expect(london.url).toBe(find(GIVING_BRANCHES, "Kharis Church London").url);
    }
  });

  it("gives every online branch an https link", () => {
    for (const b of GIVING_BRANCHES.filter((b) => b.kind === "online")) {
      expect(b.url).toMatch(/^https:\/\//);
    }
  });
});
