import { describe, expect, it } from "vitest";
import { advanceDoveGame, createDoveGame, doveHitsTower, DOVE_GAME, nextGap } from "./dove-game";

describe("404 dove game", () => {
  it("keeps consecutive gaps different, reachable and within the play area", () => {
    let previous = 81;
    for (let i = 0; i < 100; i++) {
      const next = nextGap(previous, () => (i % 3) / 2);
      expect(next).not.toBe(previous);
      expect(Math.abs(next - previous)).toBeLessThanOrEqual(DOVE_GAME.maxGapShift);
      expect(next).toBeGreaterThanOrEqual(DOVE_GAME.gapMargin);
      expect(next + DOVE_GAME.gapSize).toBeLessThanOrEqual(DOVE_GAME.ground - DOVE_GAME.gapMargin);
      previous = next;
    }
  });

  it("only hits when the inset dove hitbox overlaps a tower", () => {
    const tower = { id: 1, x: DOVE_GAME.doveX, gapTop: 80, passed: false };
    const halfHeight =
      (DOVE_GAME.spriteHeight * DOVE_GAME.spriteScale * (1 - 2 * DOVE_GAME.hitboxInset)) / 2;
    expect(doveHitsTower(80 + halfHeight, tower)).toBe(false);
    expect(doveHitsTower(80 + halfHeight - 0.01, tower)).toBe(true);
    expect(doveHitsTower(80 + DOVE_GAME.gapSize - halfHeight, tower)).toBe(false);
    expect(doveHitsTower(80 + DOVE_GAME.gapSize - halfHeight + 0.01, tower)).toBe(true);
    expect(doveHitsTower(0, { ...tower, x: 500 })).toBe(false);
  });

  it("scores once after passing a tower and ends at the ground", () => {
    const game = createDoveGame();
    game.y = 150;
    game.velocity = 0;
    game.towers = [
      { id: 0, x: DOVE_GAME.doveX - DOVE_GAME.towerWidth - 20, gapTop: 81, passed: false },
    ];
    const scored = advanceDoveGame(game, 1 / 60);
    expect(scored.score).toBe(1);
    expect(advanceDoveGame(scored, 1 / 60).score).toBe(1);
    expect(
      advanceDoveGame(
        { ...game, y: DOVE_GAME.ground, towers: [{ id: 0, x: 600, gapTop: 81, passed: false }] },
        1 / 60,
      ).over,
    ).toBe(true);
  });

  it("moves consistently at 60 and 120 frames per second", () => {
    const initial = { ...createDoveGame(), y: 150, velocity: 0 };
    let slow = initial;
    let fast = initial;
    for (let i = 0; i < 12; i++) slow = advanceDoveGame(slow, 1 / 60);
    for (let i = 0; i < 24; i++) fast = advanceDoveGame(fast, 1 / 120);
    expect(slow.y).toBeCloseTo(fast.y, 6);
    expect(slow.towers[0]!.x).toBeCloseTo(fast.towers[0]!.x, 6);
  });
});
