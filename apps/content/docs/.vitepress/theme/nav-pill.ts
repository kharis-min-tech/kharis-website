const TARGETS = ".VPNavBarMenuLink, .VPNavBarMenu .VPFlyout > .button";

/** A soft highlight that glides between top-nav items, as on the Kairos docs. */
export function navHoverPill() {
  if (document.getElementById("nav-hover-pill")) return;
  const pill = document.createElement("div");
  pill.id = "nav-hover-pill";
  pill.setAttribute("aria-hidden", "true");
  document.body.appendChild(pill);

  document.addEventListener("mouseover", (event) => {
    const target = (event.target as Element | null)?.closest?.(TARGETS);
    if (!target) {
      if (!(event.target as Element | null)?.closest?.(".VPNavBarMenu")) pill.style.opacity = "0";
      return;
    }
    const rect = target.getBoundingClientRect();
    const height = 36;
    pill.style.width = `${rect.width + 8}px`;
    pill.style.transform = `translate(${rect.left - 4}px, ${rect.top + (rect.height - height) / 2}px)`;
    pill.style.opacity = "1";
  });

  window.addEventListener("scroll", () => (pill.style.opacity = "0"), { passive: true });
}
