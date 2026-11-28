export const DOVE_GAME = {
  width: 640,
  ceiling: 0,
  ground: 272,
  doveX: 112,
  startY: 150,
  spriteScale: 0.5,
  spriteWidth: 85,
  spriteHeight: 56,
  hitboxInset: 0.23,
  gravity: 720,
  flapVelocity: -270,
  maxFallSpeed: 360,
  gapSize: 120,
  gapMargin: 40,
  maxGapShift: 55,
  towerWidth: 46,
  towerSpacing: 320,
  initialSpeed: 135,
  speedIncrease: 4,
  pointsPerSpeedIncrease: 5,
  maxSpeed: 165,
  maxFrameTime: 0.05,
  maxStep: 1 / 120,
  minTilt: -25,
  maxTilt: 65,
  tiltVelocityDivisor: 9,
} as const;

export type Tower = { id: number; x: number; gapTop: number; passed: boolean };
export type DoveState = {
  y: number;
  velocity: number;
  score: number;
  towers: Tower[];
  nextId: number;
  over: boolean;
};

export function createDoveGame(): DoveState {
  const gapTop = (DOVE_GAME.ground - DOVE_GAME.gapSize) / 2;
  return {
    y: DOVE_GAME.startY,
    velocity: DOVE_GAME.flapVelocity,
    score: 0,
    towers: [{ id: 0, x: DOVE_GAME.width, gapTop, passed: false }],
    nextId: 1,
    over: false,
  };
}

export function nextGap(previous: number, random = Math.random): number {
  const low = Math.max(DOVE_GAME.ceiling + DOVE_GAME.gapMargin, previous - DOVE_GAME.maxGapShift);
  const high = Math.min(
    DOVE_GAME.ground - DOVE_GAME.gapMargin - DOVE_GAME.gapSize,
    previous + DOVE_GAME.maxGapShift,
  );
  let gap = low + random() * (high - low);
  if (Math.abs(gap - previous) < 1) gap = previous < (low + high) / 2 ? high : low;
  return gap;
}

// Inset the hitbox inside the scaled sprite so the wings, tail and transparent edges do not count.
export function doveHitsTower(y: number, tower: Tower): boolean {
  const width = DOVE_GAME.spriteWidth * DOVE_GAME.spriteScale * (1 - 2 * DOVE_GAME.hitboxInset);
  const height = DOVE_GAME.spriteHeight * DOVE_GAME.spriteScale * (1 - 2 * DOVE_GAME.hitboxInset);
  const left = DOVE_GAME.doveX - width / 2;
  const right = DOVE_GAME.doveX + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;
  const overlapX = left < tower.x + DOVE_GAME.towerWidth && right > tower.x;
  return overlapX && (top < tower.gapTop || bottom > tower.gapTop + DOVE_GAME.gapSize);
}

export function advanceDoveGame(
  state: DoveState,
  seconds: number,
  random = Math.random,
): DoveState {
  const next = { ...state, towers: state.towers.map((tower) => ({ ...tower })) };
  let remaining = Math.min(Math.max(seconds, 0), DOVE_GAME.maxFrameTime);
  while (remaining > 0 && !next.over) {
    const dt = Math.min(remaining, DOVE_GAME.maxStep);
    remaining -= dt;
    const velocity = Math.min(DOVE_GAME.maxFallSpeed, next.velocity + DOVE_GAME.gravity * dt);
    next.y += (next.velocity + velocity) * 0.5 * dt;
    next.velocity = velocity;
    const speed = Math.min(
      DOVE_GAME.maxSpeed,
      DOVE_GAME.initialSpeed +
        Math.floor(next.score / DOVE_GAME.pointsPerSpeedIncrease) * DOVE_GAME.speedIncrease,
    );
    for (const tower of next.towers) tower.x -= speed * dt;
    const last = next.towers[next.towers.length - 1]!;
    if (last.x <= DOVE_GAME.width - DOVE_GAME.towerSpacing) {
      next.towers.push({
        id: next.nextId++,
        x: last.x + DOVE_GAME.towerSpacing,
        gapTop: nextGap(last.gapTop, random),
        passed: false,
      });
    }
    const hitHeight =
      DOVE_GAME.spriteHeight * DOVE_GAME.spriteScale * (1 - 2 * DOVE_GAME.hitboxInset);
    next.over =
      next.y - hitHeight / 2 < DOVE_GAME.ceiling ||
      next.y + hitHeight / 2 > DOVE_GAME.ground ||
      next.towers.some((tower) => doveHitsTower(next.y, tower));
    if (!next.over) {
      const hitLeft =
        DOVE_GAME.doveX -
        (DOVE_GAME.spriteWidth * DOVE_GAME.spriteScale * (1 - 2 * DOVE_GAME.hitboxInset)) / 2;
      for (const tower of next.towers) {
        if (!tower.passed && tower.x + DOVE_GAME.towerWidth < hitLeft) {
          tower.passed = true;
          next.score += 1;
        }
      }
    }
    next.towers = next.towers.filter((tower) => tower.x + DOVE_GAME.towerWidth >= 0);
  }
  return next;
}
