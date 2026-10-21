import { describe, expect, it } from "vitest";
import { readTheme, THEME_STORAGE_KEY, writeTheme } from "./theme";

describe("shared Kharis theme", () => {
  it("prefers the main site's explicit light choice over the legacy dark choice", () => {
    const values: Record<string, string> = {
      [THEME_STORAGE_KEY]: "light",
      "kharis-theme": "dark",
    };
    expect(readTheme({ getItem: (key) => values[key] ?? null })).toBe("light");
  });

  it("preserves a KP2 choice until the shared preference is saved", () => {
    const values = new Map([["kharis-theme", "dark"]]);
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => void values.set(key, value),
    };
    expect(readTheme(storage)).toBe("dark");
    writeTheme(storage, "light");
    expect(readTheme(storage)).toBe("light");
  });

  it("survives storage restrictions", () => {
    const storage = {
      getItem: () => {
        throw new Error("Storage blocked");
      },
      setItem: () => {
        throw new Error("Storage blocked");
      },
    };
    expect(readTheme(storage)).toBeNull();
    expect(() => writeTheme(storage, "dark")).not.toThrow();
  });
});
