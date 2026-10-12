import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Admin previews are user-supplied Supabase and pasted URLs.
      "@next/next/no-img-element": "off",
      // Maven Pro and DM Sans are loaded from a layout <link>. next/font
      // fetches Google at build time, which this environment cannot verify.
      "@next/next/no-page-custom-font": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".open-next/**",
      ".wrangler/**",
    ],
  },
];

export default eslintConfig;
