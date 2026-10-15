import { defineConfig } from "vitest/config";

// Root config for the whole monorepo. Tests live next to the code they cover
// (apps/<app>/**/*.test.ts). Pure logic only for now — Node environment, no DOM.
export default defineConfig({
  // The Next apps' tsconfigs set `jsx: "preserve"` for Next's own compiler;
  // tests importing components need Vite to compile the JSX itself.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["apps/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/.open-next/**", "**/.wrangler/**"],
    environment: "node",
  },
});
