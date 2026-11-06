import { describe, expect, it } from "vitest";
import {
  contactEmail,
  escapeHtml,
  findBranch,
  normaliseBranchName,
  notifyAddress,
  quizEmail,
  visitEmail,
  type BranchContact,
} from "./form-notifications";

const BRANCHES: BranchContact[] = [
  { id: "1", name: "London", contact_email: "london@kharis.org" },
  { id: "2", name: "Chelmesford", contact_email: "chelmsford@kharis.org" },
  { id: "3", name: "KP2 Romford", contact_email: "kp2romford@kharis.org" },
  { id: "4", name: "Bristol", contact_email: null },
];

describe("normaliseBranchName", () => {
  it("ignores case and spacing", () => {
    expect(normaliseBranchName("  KP2   Romford ")).toBe("kp2 romford");
  });

  it("folds the directory's Chelmesford misspelling onto Chelmsford", () => {
    expect(normaliseBranchName("Chelmesford")).toBe(normaliseBranchName("Chelmsford"));
  });
});

describe("findBranch", () => {
  it("matches a quiz or dropdown label to the directory row", () => {
    expect(findBranch(BRANCHES, "kp2 romford")?.id).toBe("3");
  });

  it("matches the misspelled directory row from the correct spelling", () => {
    expect(findBranch(BRANCHES, "Chelmsford")?.id).toBe("2");
  });

  it("returns null for an unknown or empty name", () => {
    expect(findBranch(BRANCHES, "Narnia")).toBeNull();
    expect(findBranch(BRANCHES, "")).toBeNull();
  });
});

describe("notifyAddress", () => {
  it("prefers the branch inbox", () => {
    expect(notifyAddress(BRANCHES, "London", "fallback@kharis.org")).toBe("london@kharis.org");
  });

  it("falls back when no branch was chosen", () => {
    expect(notifyAddress(BRANCHES, "", "fallback@kharis.org")).toBe("fallback@kharis.org");
  });

  it("falls back when the branch has no address on file", () => {
    expect(notifyAddress(BRANCHES, "Bristol", "fallback@kharis.org")).toBe("fallback@kharis.org");
  });

  it("returns empty when there is nowhere to send, so the caller skips the email", () => {
    expect(notifyAddress(BRANCHES, "Bristol")).toBe("");
  });
});

describe("escapeHtml", () => {
  it("neutralises markup from visitor-supplied text", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });
});

describe("message bodies", () => {
  it("escapes the message body rather than embedding raw HTML", () => {
    const mail = contactEmail({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      topic: "Prayer",
      branchName: "London",
      message: "<b>pray</b> for me",
      site: "Main site",
    });
    expect(mail.subject).toBe("Prayer enquiry from Ada Lovelace (London)");
    expect(mail.html).toContain("&lt;b&gt;pray&lt;/b&gt;");
    expect(mail.html).not.toContain("<b>pray</b>");
    expect(mail.text).toContain("<b>pray</b> for me");
  });

  it("says plainly when no branch was chosen", () => {
    const mail = visitEmail({
      name: "Ama",
      email: "ama@example.com",
      children: true,
      site: "KP2",
    });
    expect(mail.subject).toBe("Planning a visit: Ama");
    expect(mail.html).toContain("No branch chosen");
    expect(mail.html).toContain("Yes (ages 0-12)");
  });

  it("names the branch and the matched departments for a quiz result", () => {
    const mail = quizEmail({
      branchName: "KP2 Romford",
      language: "en",
      departments: ["Music", "Media"],
      site: "KP2",
    });
    expect(mail.subject).toBe("Department quiz result (KP2 Romford)");
    expect(mail.html).toContain("Music");
    expect(mail.html).toContain("Media");
  });
});
