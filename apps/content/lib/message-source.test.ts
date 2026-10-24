import { describe, expect, it } from "vitest";
import { messageSource } from "./message-source";

describe("messageSource", () => {
  it("reads the site line written by the contact form", () => {
    expect(messageSource("From: Main site\n\nHello", "kp2")).toBe("Main site");
    expect(messageSource("From: KP2\n\nHello", "kp2")).toBe("KP2");
  });

  it("falls back to the inbox for older messages", () => {
    expect(messageSource("Hello", "kharis")).toBe("Main site");
    expect(messageSource("Hello", "kp2")).toBe("KP2");
    expect(messageSource("Hello", "general")).toBe("");
  });
});
