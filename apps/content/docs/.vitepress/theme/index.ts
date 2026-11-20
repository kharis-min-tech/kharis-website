import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h, onMounted } from "vue";
import Screenshot from "./components/Screenshot.vue";
import { navHoverPill } from "./nav-pill";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Full page load to the studio (outside /documentation/), not a VitePress route.
      "home-hero-actions-after": () =>
        h(
          "a",
          {
            class: "VPButton medium brand",
            href: "/",
            target: "_self",
          },
          "Open Content Studio",
        ),
    });
  },
  enhanceApp({ app }) {
    app.component("Screenshot", Screenshot);
  },
  setup() {
    onMounted(navHoverPill);
  },
} satisfies Theme;
