import { Archivo_Black, Fredoka, Rubik } from "next/font/google";
import type { ChildrenFontKey } from "@/data/children-groups";

/** Group heading faces for /life/children only. Body copy stays on Plus Jakarta Sans. */
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-kids-fredoka",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-kids-rubik",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-kids-archivo-black",
});

export const CHILDREN_FONT_CLASSES = [fredoka.variable, rubik.variable, archivoBlack.variable].join(
  " ",
);

export const CHILDREN_HEADING_FONTS: Record<ChildrenFontKey, string> = {
  fredoka: "var(--font-kids-fredoka)",
  rubik: "var(--font-kids-rubik)",
  "archivo-black": "var(--font-kids-archivo-black)",
};
