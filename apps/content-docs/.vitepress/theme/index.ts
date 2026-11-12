import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { onMounted } from "vue";
import Screenshot from "./components/Screenshot.vue";
import { navHoverPill } from "./nav-pill";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Screenshot", Screenshot);
  },
  setup() {
    onMounted(navHoverPill);
  },
} satisfies Theme;
