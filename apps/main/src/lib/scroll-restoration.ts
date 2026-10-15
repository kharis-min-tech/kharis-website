export type ScrollSnapshot = {
  x: number;
  y: number;
  anchorId?: string;
  anchorOffset?: number;
};

export function parseScrollSnapshot(value: string | null): ScrollSnapshot | null {
  if (!value) return null;
  try {
    const saved = JSON.parse(value);
    if (!saved || !Number.isFinite(saved.x) || !Number.isFinite(saved.y)) return null;
    if (saved.x < 0 || saved.y < 0) return null;
    return {
      x: saved.x,
      y: saved.y,
      ...(typeof saved.anchorId === "string" && Number.isFinite(saved.anchorOffset)
        ? { anchorId: saved.anchorId, anchorOffset: saved.anchorOffset }
        : {}),
    };
  } catch {
    return null;
  }
}

export function getRestoredPosition(saved: ScrollSnapshot, anchorTop?: number) {
  return {
    left: saved.x,
    top: Math.max(0, anchorTop !== undefined ? anchorTop + (saved.anchorOffset ?? 0) : saved.y),
  };
}
