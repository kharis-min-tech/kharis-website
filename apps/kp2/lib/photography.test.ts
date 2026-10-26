import { describe, expect, it } from "vitest";
import { KP2_PHOTOS } from "./photography";

describe("KP2 photography delivery", () => {
  it("serves every selected KOffice photograph from Cloudflare", () => {
    for (const photo of Object.values(KP2_PHOTOS)) {
      expect(photo.src).toMatch(
        /^https:\/\/images\.kharis\.org\/site-images\/kp2\/[a-f0-9]{16}\/photography\//,
      );
    }
  });
});
