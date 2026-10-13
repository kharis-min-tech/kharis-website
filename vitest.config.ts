import { defineConfig } from "vitest/config";

// Root config for the whole monorepo. Tests live next to the code they cover
// (apps/<app>/**/*.test.ts). Pure logic only for now — Node environment, no DOM.
export default defineConfig({
  test: {
    include: ["apps/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/.open-next/**", "**/.wrangler/**"],
    environment: "node",
  },
});
