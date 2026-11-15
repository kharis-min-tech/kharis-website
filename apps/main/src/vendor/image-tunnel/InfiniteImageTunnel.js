/* eslint-disable */
// @ts-nocheck
/*
 * InfiniteImageTunnel - vendored Framer community component.
 *
 * NOT OUR CODE. Copyright remains with its creator (Framerstacks).
 *   Licence: Framer Community Terms, "Limited" (free content)
 *            https://www.framer.com/legal/community-terms
 *
 * The licence permits using and modifying it in our own projects, including
 * commercial ones. It does NOT permit reselling it, offering it on another
 * marketplace, publishing it as a standalone asset, or claiming it as our
 * own. The licence is revocable; if it is withdrawn, every copy must be
 * deleted.
 *
 * Source:  https://framer.com/m/InfiniteImageTunnel-SK1BQY.js@al6yucrFJM9FTwK1PmPJ
 * Resolves to:
 *   https://framerusercontent.com/modules/cVig2MojhKjPHxOU24h9/al6yucrFJM9FTwK1PmPJ/InfiniteImageTunnel.js
 *
 * Vendored rather than imported from the URL at runtime so visitors never
 * fetch third-party JavaScript and the build does not depend on Framer's CDN
 * staying up. Kept in the shape it shipped in - minified, one long line - so
 * that re-fetching the source and re-applying our edits stays a readable
 * diff. .prettierignore covers this folder for the same reason.
 *
 * This one is DOM and CSS perspective, not WebGL. That is why it was chosen:
 * the photographs are ordinary <img> elements, so there is no canvas texture
 * to fall foul of the image host's missing CORS header, no GPU texture
 * budget, and every tile is a real hit target rather than something that has
 * to be raycast.
 *
 * What it already did, unpatched: press-to-start, a long-press speed boost,
 * click-to-pause, mouse parallax, a reduced-motion mode, an
 * IntersectionObserver so it stops off screen, a rAF loop that halts itself
 * when nothing is moving, and contain:layout paint.
 *
 * Our edits are marked inline with "KHARIS PATCH":
 *
 *   1. `framer` imports -> ./framer-shim (three editor-only constants).
 *   2. `items` and `onSelectItem`: the tunnel carries activities rather
 *      than bare pictures.
 *   3. A tile renders its activity's clip when it has one, captions itself,
 *      and can be clicked to open that activity.
 *
 * It renders nothing meaningful on the server; mount it from a client
 * component.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addPropertyControls, ControlType, useIsStaticRenderer } from "./framer-shim";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
/* ========================== DEFAULT DATA ========================= */ /**
 * A deliberately asymmetric, editorial composition.
 * Depths are normalised (0 = at the camera, 1 = far end) so the layout
 * scales with the Tunnel Depth property control.
 */ const LAYOUT = [
  // ---------------------------- LEFT WALL ----------------------------
  { surface: "left", offset: -0.34, cross: 0.3, span: 0.62, depth: 0.045, index: 0 },
  { surface: "left", offset: 0.36, cross: 0.22, span: 0.3, depth: 0.075, index: 8 },
  { surface: "left", offset: 0.06, cross: 0.4, span: 0.7, depth: 0.145, index: 1 },
  { surface: "left", offset: -0.52, cross: 0.18, span: 0.42, depth: 0.205, index: 9 },
  { surface: "left", offset: 0.44, cross: 0.26, span: 0.52, depth: 0.255, index: 2 },
  { surface: "left", offset: -0.18, cross: 0.34, span: 0.44, depth: 0.335, index: 10 },
  { surface: "left", offset: 0.2, cross: 0.3, span: 0.66, depth: 0.395, index: 3 },
  { surface: "left", offset: -0.46, cross: 0.24, span: 0.36, depth: 0.475, index: 4 },
  { surface: "left", offset: 0.3, cross: 0.2, span: 0.3, depth: 0.535, index: 11 },
  { surface: "left", offset: -0.1, cross: 0.36, span: 0.58, depth: 0.605, index: 5 },
  { surface: "left", offset: 0.48, cross: 0.22, span: 0.4, depth: 0.695, index: 2 },
  { surface: "left", offset: -0.36, cross: 0.28, span: 0.5, depth: 0.775, index: 6 },
  { surface: "left", offset: 0.14, cross: 0.24, span: 0.34, depth: 0.865, index: 6 },
  { surface: "left", offset: -0.28, cross: 0.3, span: 0.46, depth: 0.935, index: 7 }, // --------------------------- RIGHT WALL ----------------------------
  { surface: "right", offset: 0.32, cross: 0.26, span: 0.44, depth: 0.03, index: 4 },
  { surface: "right", offset: -0.24, cross: 0.36, span: 0.68, depth: 0.095, index: 8 },
  { surface: "right", offset: 0.5, cross: 0.18, span: 0.28, depth: 0.17, index: 2 },
  { surface: "right", offset: -0.06, cross: 0.42, span: 0.56, depth: 0.23, index: 9 },
  { surface: "right", offset: 0.38, cross: 0.24, span: 0.38, depth: 0.31, index: 10 },
  { surface: "right", offset: -0.44, cross: 0.22, span: 0.46, depth: 0.37, index: 0 },
  { surface: "right", offset: 0.1, cross: 0.34, span: 0.64, depth: 0.445, index: 11 },
  { surface: "right", offset: -0.34, cross: 0.28, span: 0.34, depth: 0.52, index: 3 },
  { surface: "right", offset: 0.44, cross: 0.2, span: 0.42, depth: 0.585, index: 1 },
  { surface: "right", offset: -0.14, cross: 0.32, span: 0.52, depth: 0.665, index: 4 },
  { surface: "right", offset: 0.26, cross: 0.24, span: 0.3, depth: 0.74, index: 1 },
  { surface: "right", offset: -0.48, cross: 0.26, span: 0.48, depth: 0.82, index: 6 },
  { surface: "right", offset: 0.06, cross: 0.3, span: 0.4, depth: 0.9, index: 5 }, // ----------------------------- CEILING -----------------------------
  { surface: "ceiling", offset: -0.22, cross: 0.4, span: 0.7, depth: 0.115, index: 2 },
  { surface: "ceiling", offset: 0.34, cross: 0.28, span: 0.44, depth: 0.29, index: 4 },
  { surface: "ceiling", offset: -0.06, cross: 0.46, span: 0.8, depth: 0.43, index: 5 },
  { surface: "ceiling", offset: 0.4, cross: 0.24, span: 0.36, depth: 0.61, index: 6 },
  { surface: "ceiling", offset: -0.3, cross: 0.36, span: 0.6, depth: 0.78, index: 9 },
  { surface: "ceiling", offset: 0.18, cross: 0.3, span: 0.42, depth: 0.925, index: 2 }, // ------------------------------ FLOOR ------------------------------
  { surface: "floor", offset: 0.3, cross: 0.26, span: 0.4, depth: 0.06, index: 1 },
  { surface: "floor", offset: -0.34, cross: 0.3, span: 0.52, depth: 0.16, index: 3 },
  { surface: "floor", offset: 0.08, cross: 0.22, span: 0.3, depth: 0.245, index: 5 },
  { surface: "floor", offset: 0.42, cross: 0.24, span: 0.44, depth: 0.355, index: 7 },
  { surface: "floor", offset: -0.2, cross: 0.34, span: 0.58, depth: 0.47, index: 10 },
  { surface: "floor", offset: 0.24, cross: 0.2, span: 0.28, depth: 0.56, index: 3 },
  { surface: "floor", offset: -0.44, cross: 0.26, span: 0.46, depth: 0.68, index: 0 },
  { surface: "floor", offset: 0.12, cross: 0.3, span: 0.5, depth: 0.8, index: 8 },
  { surface: "floor", offset: -0.16, cross: 0.24, span: 0.34, depth: 0.89, index: 4 },
  { surface: "floor", offset: 0.36, cross: 0.28, span: 0.42, depth: 0.96, index: 11 },
];
/** Mobile keeps every surface represented but thins the composition out. */ const MOBILE_KEEP_EVERY = 3;
/**
 * Tiles read as thin slivers if their depth extent is only one bay - this
 * stretches them along the travel axis so they feel like real panels.
 */ const DEPTH_SPAN_SCALE = 2.2;
/** How much faster the tunnel travels while the scene is long-pressed. */ const BOOST_MAX = 2.6;
/** Ramp rate for the boost multiplier - lower is a slower, smoother build. */ const BOOST_EASE = 1.4;
/* =========================== UTILITIES =========================== */ function clamp(
  v,
  min,
  max,
) {
  return v < min ? min : v > max ? max : v;
}
/** Framer's ResponsiveImage value or a plain URL string -> full image entry. */ function resolveImage(
  value,
) {
  if (!value) return { src: "", srcSet: "", alt: "" };
  if (typeof value === "string") return { src: value, srcSet: "", alt: "" };
  return {
    src: typeof value.src === "string" ? value.src : "", // Carrying the srcSet through is what lets the browser download and
    // decode a panel-sized image instead of the full-resolution upload.
    srcSet: typeof value.srcSet === "string" ? value.srcSet : "",
    alt: typeof value.alt === "string" ? value.alt : "",
  };
}
/**
 * Framer colour controls hand back hex, rgb(), rgba() or hsl() strings -
 * normalise any of them into a colour value carrying our own alpha.
 */ function withAlpha(color, alpha) {
  const c = (color || "#FFFFFF").trim();
  const a = clamp(alpha, 0, 1);
  if (c.startsWith("rgb")) {
    const parts = c
      .slice(c.indexOf("(") + 1, c.lastIndexOf(")"))
      .split(/[,\s/]+/)
      .filter(Boolean)
      .map(Number);
    const [r = 255, g = 255, b = 255] = parts;
    const baseAlpha = parts.length > 3 && !Number.isNaN(parts[3]) ? parts[3] : 1;
    return `rgba(${r}, ${g}, ${b}, ${a * baseAlpha})`;
  }
  if (c.startsWith("hsl")) {
    const inner = c.slice(c.indexOf("(") + 1, c.lastIndexOf(")")).split("/")[0];
    return `hsl(${inner.trim()} / ${a})`;
  }
  const clean = c.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : clean.slice(0, 6);
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) return `rgba(255, 255, 255, ${a})`;
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${a})`;
}
/**
 * Perceived luminance (0 = black, 1 = white) of a colour string, used to
 * decide whether the theme reads as light or dark.
 */ function luminanceOf(color) {
  const c = (color || "#000000").trim();
  let r = 0;
  let g = 0;
  let b = 0;
  if (c.startsWith("rgb")) {
    const parts = c
      .slice(c.indexOf("(") + 1, c.lastIndexOf(")"))
      .split(/[,\s/]+/)
      .filter(Boolean)
      .map(Number);
    [r = 0, g = 0, b = 0] = parts;
  } else {
    const clean = c.replace("#", "");
    const full =
      clean.length === 3
        ? clean
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : clean.slice(0, 6);
    const int = parseInt(full, 16);
    if (!Number.isNaN(int)) {
      r = (int >> 16) & 255;
      g = (int >> 8) & 255;
      b = int & 255;
    }
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
/** Base (depth-less) transform that glues an element to a tunnel plane. */ function surfaceTransform(
  surface,
  geo,
  offset,
) {
  switch (surface) {
    case "left":
      return `translate3d(${-geo.halfWidth}px, ${offset * geo.halfHeight}px, 0px) rotateY(90deg)`;
    case "right":
      return `translate3d(${geo.halfWidth}px, ${offset * geo.halfHeight}px, 0px) rotateY(-90deg)`;
    case "ceiling":
      return `translate3d(${offset * geo.halfWidth}px, ${-geo.halfHeight}px, 0px) rotateX(-90deg)`;
    case "floor":
    default:
      return `translate3d(${offset * geo.halfWidth}px, ${geo.halfHeight}px, 0px) rotateX(90deg)`;
  }
}
/** Pixel footprint of a tile on its plane, in local (pre-rotation) space. */ function tileSize(
  spec,
  geo,
  scale,
  gap,
) {
  const isWall = spec.surface === "left" || spec.surface === "right";
  const acrossExtent = isWall ? geo.halfHeight * 2 : geo.halfWidth * 2;
  const across = acrossExtent * spec.cross * scale;
  const along = geo.bay * spec.span * scale * DEPTH_SPAN_SCALE; // Walls: local width runs along depth. Floor/ceiling: local height does.
  const width = isWall ? along : across;
  const height = isWall ? across : along;
  return { width: Math.max(8, width - gap), height: Math.max(8, height - gap) };
}
function TunnelTile({
  spec,
  geo,
  scale,
  gap,
  image,
  placeholderColor,
  registerRef,
  onSelect,
  onHover,
}) {
  const { width, height } = tileSize(spec, geo, scale, gap);
  const style = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width,
    height,
    marginLeft: -width / 2,
    marginTop: -height / 2,
    transformStyle: "preserve-3d",
    overflow: "hidden",
    backgroundColor: placeholderColor,
  }; // Tiles near the camera are magnified by the perspective projection, so
  // ask for a slightly larger candidate than the layout width.
  const sizes = `${Math.max(16, Math.round(width * 1.6))}px`; /* KHARIS PATCH - a tile is an activity.
   *
   * Three changes from the original, which rendered a bare <img>:
   *
   *   1. A clip, when the activity has one. This tunnel is DOM rather than
   *      WebGL, so a <video> is simply another element - no canvas slicing is
   *      needed to make it sit on the wall like a photograph.
   *   2. A caption, so you can read what you are flying past.
   *   3. A hit target. The scene above is pointerEvents:none; the tile turns
   *      them back on for itself so the activity can be opened. The click is
   *      stopped from reaching the container, whose own click toggles pause -
   *      choosing an activity should not also freeze the tunnel.
   */
  const media = image.video
    ? /*#__PURE__*/ _jsx("video", {
        src: image.video,
        poster: image.src || undefined,
        muted: true,
        loop: true,
        autoPlay: true,
        playsInline: true,
        preload: "metadata",
        tabIndex: -1,
        "aria-hidden": true,
        draggable: false,
        ref: (el) => {
          if (!el) return;
          el.muted = true;
          el.defaultMuted = true;
          el.setAttribute("muted", "");
          el.setAttribute("playsinline", "");
          const p = el.play();
          if (p && p.catch) p.catch(() => {});
        },
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        },
      })
    : image.src
      ? /*#__PURE__*/ _jsx("img", {
          src: image.src,
          srcSet: image.srcSet || undefined,
          sizes: image.srcSet ? sizes : undefined,
          alt: image.alt,
          draggable: false,
          loading: "lazy",
          decoding: "async",
          style: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: 0,
            pointerEvents: "none",
            userSelect: "none",
          },
        })
      : null;
  const caption = image.title
    ? /*#__PURE__*/ _jsx("span", {
        className: "tunnel-tile__label",
        "aria-hidden": true,
        children: image.title,
      })
    : null;
  const selectable = Boolean(onSelect && image.item);
  const interactive = selectable
    ? {
        role: "button",
        tabIndex: -1,
        "aria-label": image.title || image.alt || undefined,
        onClick: (e) => {
          e.stopPropagation();
          onSelect(image.item);
        },
        onPointerEnter: () => {
          if (onHover) onHover(image.item);
        },
        onPointerLeave: () => {
          if (onHover) onHover(null);
        },
        style: { ...style, pointerEvents: "auto", cursor: "pointer" },
      }
    : { style: style };
  return /*#__PURE__*/ _jsxs("div", {
    ref: registerRef,
    className: "tunnel-tile" + (selectable ? " tunnel-tile--selectable" : ""),
    ...interactive,
    children: [media, caption],
  });
}
/**
 * One wireframe ring. Drawn as four thin strips rather than a bordered
 * full-size box: visually identical to a border-box border, but the
 * compositor only ever rasterises the strips instead of a viewport-sized
 * texture per ring.
 */ function TunnelFrame({ geo, lineColor, thickness, registerRef }) {
  const w = geo.halfWidth * 2;
  const h = geo.halfHeight * 2;
  const t = thickness;
  const sideHeight = Math.max(0, h - t * 2);
  const bar = (extra) => ({ position: "absolute", backgroundColor: lineColor, ...extra });
  return /*#__PURE__*/ _jsxs("div", {
    ref: registerRef,
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: w,
      height: h,
      marginLeft: -w / 2,
      marginTop: -h / 2,
      transformStyle: "preserve-3d",
      pointerEvents: "none",
    },
    children: [
      /*#__PURE__*/ _jsx("div", { style: bar({ left: 0, top: 0, width: w, height: t }) }),
      /*#__PURE__*/ _jsx("div", { style: bar({ left: 0, bottom: 0, width: w, height: t }) }),
      /*#__PURE__*/ _jsx("div", { style: bar({ left: 0, top: t, width: t, height: sideHeight }) }),
      /*#__PURE__*/ _jsx("div", { style: bar({ right: 0, top: t, width: t, height: sideHeight }) }),
    ],
  });
}
/** One longitudinal line running from the camera plane to the far end. */ function TunnelSurfaceLine({
  surface,
  offset,
  geo,
  lineColor,
  thickness,
}) {
  const isWall = surface === "left" || surface === "right";
  const width = isWall ? geo.depth : thickness;
  const height = isWall ? thickness : geo.depth;
  const base = surfaceTransform(surface, geo, offset); // After the plane rotation, local +x (walls) / +y (floor & ceiling) points
  // either into or out of the screen - flip the shift so every strip runs
  // away from the camera.
  const dir = surface === "left" || surface === "ceiling" ? 1 : -1;
  const shift = isWall
    ? `translate3d(${(dir * geo.depth) / 2}px, 0px, 0px)`
    : `translate3d(0px, ${(dir * geo.depth) / 2}px, 0px)`;
  return /*#__PURE__*/ _jsx("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width,
      height,
      marginLeft: -width / 2,
      marginTop: -height / 2,
      backgroundColor: lineColor,
      transform: `${base} ${shift}`,
      transformStyle: "preserve-3d",
      pointerEvents: "none",
    },
  });
}
function TunnelGrid({ geo, frameCount, lineColor, thickness, registerFrame }) {
  const frames = useMemo(() => Array.from({ length: frameCount }, (_, i) => i), [frameCount]);
  const lines = useMemo(
    () => [
      { surface: "left", offset: -1 },
      { surface: "left", offset: -0.34 },
      { surface: "left", offset: 0.34 },
      { surface: "left", offset: 1 },
      { surface: "right", offset: -1 },
      { surface: "right", offset: -0.34 },
      { surface: "right", offset: 0.34 },
      { surface: "right", offset: 1 },
      { surface: "ceiling", offset: -0.5 },
      { surface: "ceiling", offset: 0.5 },
      { surface: "floor", offset: -0.5 },
      { surface: "floor", offset: 0.5 },
    ],
    [],
  );
  return /*#__PURE__*/ _jsxs("div", {
    style: { position: "absolute", inset: 0, transformStyle: "preserve-3d" },
    children: [
      lines.map((l, i) =>
        /*#__PURE__*/ _jsx(
          TunnelSurfaceLine,
          {
            surface: l.surface,
            offset: l.offset,
            geo: geo,
            lineColor: lineColor,
            thickness: thickness,
          },
          `line-${i}`,
        ),
      ),
      frames.map((i) =>
        /*#__PURE__*/ _jsx(
          TunnelFrame,
          { geo: geo, lineColor: lineColor, thickness: thickness, registerRef: registerFrame(i) },
          `frame-${i}`,
        ),
      ),
    ],
  });
}
function StartButton({ label, visible, onStart, compact, invert }) {
  return /*#__PURE__*/ _jsx("button", {
    type: "button",
    onClick: onStart,
    "aria-hidden": !visible,
    tabIndex: visible ? 0 : -1,
    style: {
      position: "absolute",
      left: "50%",
      top: compact ? "34%" : "31%",
      width: compact ? 168 : 220,
      height: compact ? 54 : 70,
      transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.92})`,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
      transition:
        "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
      borderRadius: 999,
      border: invert ? "1px solid rgba(0,0,0,0.12)" : "none",
      outline: "none",
      background: invert ? "#000000" : "#FFFFFF",
      color: invert ? "#FFFFFF" : "#000000",
      fontFamily:
        'Inter, "Helvetica Neue", Helvetica, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: compact ? 18 : 24,
      fontWeight: 450,
      letterSpacing: "-0.01em",
      cursor: "pointer",
      padding: 0,
      zIndex: 10,
      WebkitTapHighlightColor: "transparent",
    },
    children: label,
  });
}
/* ========================== MAIN COMPONENT ======================= */ /**
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 700
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerDisableUnlink
 */ export default function InfiniteImageTunnel(props) {
  const {
    /* KHARIS PATCH - the tunnel carries activities, not bare pictures.
     * `items` is [{ id, title, src, srcSet, alt, video }]. Each tile becomes
     * the activity it is showing: it captions itself and it can be clicked.
     * `onSelectItem` receives that activity. The original `images` prop still
     * works when neither is supplied. */
    items,
    onSelectItem,
    onHoverItem,
    onNearestItem,
    frozen,
    startSignal,
    images,
    startText,
    showStartButton,
    autoStart,
    animationSpeed,
    pauseOnHover,
    reducedMotion,
    clickToToggle,
    mouseParallax,
    perspective,
    tunnelDepth,
    backgroundColor,
    showGrid,
    gridColor,
    gridOpacity,
    gridThickness,
    tileGap,
    imageTileScale,
    style,
  } = props;
  const isStatic = useIsStaticRenderer();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const tileRefs = useRef([]);
  const frameRefs = useRef([]);
  const [size, setSize] = useState({ width: 1200, height: 700 });
  const [started, setStarted] = useState(autoStart);
  const [paused, setPaused] = useState(false);
  /* KHARIS PATCH: the page can freeze the tunnel without disturbing its own
   * paused state - used while an activity panel is open, so nothing moves
   * behind the sheet and no frames are drawn for a scene nobody can see. */
  const frozenRef = useRef(false);
  frozenRef.current = Boolean(frozen);
  /* KHARIS PATCH: holds the latest layout, tile list and callback so the
   * per-frame writer can name the nearest activity without this component
   * having to rebuild its frame callback whenever any of them change. */
  const nearestRef = useRef({
    key: -1,
    layout: null,
    list: null,
    cb: null,
  }); /* ---------------------- measurement ---------------------- */ // Cached container rect, invalidated on scroll/resize so pointer moves
  // don't force a layout flush against the whole 3D tree every event.
  const rectRef = useRef(null);
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || isStatic || typeof ResizeObserver === "undefined") return;
    const apply = () => {
      const rect = el.getBoundingClientRect();
      rectRef.current = rect;
      if (rect.width > 0 && rect.height > 0) {
        setSize((prev) =>
          Math.abs(prev.width - rect.width) < 1 && Math.abs(prev.height - rect.height) < 1
            ? prev
            : { width: rect.width, height: rect.height },
        );
      }
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    const invalidate = () => {
      rectRef.current = null;
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [isStatic]);
  const isCompact = size.width < 640;
  /* ------------------------ geometry ----------------------- */ const depth = clamp(
    tunnelDepth,
    1e3,
    1e4,
  );
  const frameCount = isCompact ? 14 : 20;
  const geo = useMemo(
    () => ({
      halfWidth: Math.max(120, size.width / 2),
      halfHeight: Math.max(90, size.height / 2),
      depth,
      bay: depth / frameCount,
    }),
    [size.width, size.height, depth, frameCount],
  );
  const effectivePerspective = useMemo(() => {
    const base = clamp(perspective, 500, 3e3); // Narrow viewports need a tighter perspective to keep the vanishing
    // point readable without crushing the walls.
    const ratio = clamp(size.width / 1400, 0.55, 1);
    return Math.round(base * ratio);
  }, [perspective, size.width]);
  /* ------------------------ tile data ---------------------- */ const layout = useMemo(
    () => (isCompact ? LAYOUT.filter((_, i) => i % MOBILE_KEEP_EVERY !== 1) : LAYOUT),
    [isCompact],
  );
  const imageList = useMemo(() => {
    /* KHARIS PATCH: activities take precedence over the plain image array, and
     * carry their title and any clip through to the tile. */
    if (Array.isArray(items) && items.length) {
      return items
        .filter((it) => it && (it.src || it.video))
        .map((it, i) => ({
          src: it.src || "",
          srcSet: it.srcSet || "",
          alt: it.alt || it.title || "",
          title: it.title || "",
          video: it.video || "",
          item: it,
          itemIndex: i,
        }));
    }
    return (images || []).map(resolveImage).filter((e) => Boolean(e.src));
  }, [images, items]);
  const emptyImage = useMemo(() => ({ src: "", srcSet: "", alt: "" }), []);
  nearestRef.current.layout = layout;
  nearestRef.current.list = imageList;
  nearestRef.current.cb =
    onNearestItem; /* --------------------- animated state -------------------- */ // Depth values live in refs so frames never trigger React renders.
  const tileZ = useRef(new Float64Array(0));
  const frameZ = useRef(new Float64Array(0));
  const baseTransforms = useRef([]);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const rampRef = useRef(autoStart ? 1 : 0);
  const boostRef = useRef(1);
  const holdRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerTargetRef = useRef({ x: 0, y: 0 }); // Last values actually written to the DOM, so identical styles are never
  // re-assigned (each assignment dirties a compositor layer).
  const lastTileStyle = useRef([]);
  const lastFrameStyle = useRef([]);
  const lastSceneTransform = useRef({ x: Number.NaN, y: Number.NaN });
  const startedRef = useRef(started);
  const pausedRef = useRef(paused);
  const hoverRef = useRef(false);
  const visibleRef = useRef(true); // Set by the animation effect; lets observers restart a torn-down loop.
  const wakeRef = useRef(() => {});
  startedRef.current = started;
  pausedRef.current = paused;
  /* Seed / reseed depths whenever the composition changes. */ const seedDepths =
    useCallback(() => {
      const t = new Float64Array(layout.length);
      for (let i = 0; i < layout.length; i++) t[i] = layout[i].depth * depth;
      tileZ.current = t;
      const f = new Float64Array(frameCount);
      for (let i = 0; i < frameCount; i++) f[i] = (i / frameCount) * depth;
      frameZ.current = f;
      lastTileStyle.current = [];
      lastFrameStyle.current = [];
    }, [layout, depth, frameCount]);
  useEffect(() => {
    seedDepths();
  }, [seedDepths]);
  /* Cache the static part of every tile transform. */ useEffect(() => {
    baseTransforms.current = layout.map((spec) => {
      const base = surfaceTransform(spec.surface, geo, spec.offset);
      const spin = spec.rotate ? ` rotateZ(${spec.rotate}deg)` : "";
      return `${base}${spin}`;
    });
    lastTileStyle.current = [];
  }, [layout, geo]);
  /* ----------------------- visibility ---------------------- */ useEffect(() => {
    const el = containerRef.current;
    if (!el || isStatic || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const next = entries.some((e) => e.isIntersecting);
        const was = visibleRef.current;
        visibleRef.current = next; // Coming back into view has to restart the loop, because
        // leaving the viewport tears it down completely.
        if (next && !was) wakeRef.current();
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isStatic]);
  /* --------------------- pointer parallax ------------------ */ useEffect(() => {
    if (!mouseParallax || isStatic) return;
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      let rect = rectRef.current;
      if (!rect) {
        rect = el.getBoundingClientRect();
        rectRef.current = rect;
      }
      if (rect.width === 0 || rect.height === 0) return;
      pointerTargetRef.current = {
        x: clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5),
        y: clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5),
      };
    };
    const onLeave = () => {
      pointerTargetRef.current = { x: 0, y: 0 };
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mouseParallax, isStatic]);
  /* ---------------------- long-press boost ------------------ */ useEffect(() => {
    const el = containerRef.current;
    if (!el || isStatic) return;
    const release = () => {
      holdRef.current = false;
    };
    const onDown = () => {
      holdRef.current = true;
    };
    const opts = { passive: true };
    el.addEventListener("pointerdown", onDown, opts);
    el.addEventListener("pointerup", release, opts);
    el.addEventListener("pointercancel", release, opts);
    el.addEventListener("pointerleave", release, opts);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("pointerleave", release);
    };
  }, [isStatic]);
  /* ---------------------- animation loop ------------------- */ const writeFrame =
    useCallback(() => {
      const scene = sceneRef.current;
      if (scene && mouseParallax) {
        const p = pointerRef.current;
        const last = lastSceneTransform.current; // ±3.5° horizontal, ±2.5° vertical - cinematic, not gamey.
        // Skip the write once the easing has effectively settled.
        if (
          Number.isNaN(last.x) ||
          Math.abs(p.x - last.x) > 5e-4 ||
          Math.abs(p.y - last.y) > 5e-4
        ) {
          scene.style.transform = `rotateY(${p.x * 7}deg) rotateX(${-p.y * 5}deg)`;
          last.x = p.x;
          last.y = p.y;
        }
      }
      const z = tileZ.current;
      const fadeStart = depth * 0.72;
      const fadeSpan = depth * 0.28;
      const tileCache = lastTileStyle.current;
      for (let i = 0; i < z.length; i++) {
        const el = tileRefs.current[i];
        if (!el) continue;
        const zi = z[i];
        const transform = `translate3d(0px, 0px, ${-zi}px) ${baseTransforms.current[i] || ""}`;
        const opacity =
          zi > fadeStart
            ? String(clamp(1 - (zi - fadeStart) / fadeSpan, 0, 1))
            : "1"; /* KHARIS PATCH: 1 at the camera, 0 by the time a tile is half way down
         * the tunnel. CSS reads it to fade the caption in as the tile arrives,
         * which is what lets you see what is coming rather than guessing. */
        const near = clamp(1 - zi / (depth * 0.45), 0, 1).toFixed(2);
        const prev = tileCache[i];
        if (!prev) {
          el.style.transform = transform;
          el.style.opacity = opacity;
          el.style.setProperty("--near", near);
          tileCache[i] = { t: transform, o: opacity, n: near };
          continue;
        }
        if (prev.n !== near) {
          el.style.setProperty("--near", near);
          prev.n = near;
        }
        if (prev.t !== transform) {
          el.style.transform = transform;
          prev.t = transform;
        }
        if (prev.o !== opacity) {
          el.style.opacity = opacity;
          prev.o = opacity;
        }
      } /* KHARIS PATCH: whichever tile is closest to the camera is the one the
       * page names. Only reported when it actually changes, so this is a
       * comparison per frame and a React update about once a second. */
      const nr = nearestRef.current;
      if (nr.cb && nr.layout && nr.list && nr.list.length) {
        /* The one you are about to pass: the smallest depth still in front of the
         * camera. Taking the global minimum instead names whatever has already
         * gone by, and that only changes when the tile recycles. */
        let best = -1,
          bestZ = Infinity,
          fallback = -1,
          fallbackZ = Infinity;
        for (let i = 0; i < z.length; i++) {
          const zi = z[i];
          if (zi > 0 && zi < bestZ) {
            bestZ = zi;
            best = i;
          }
          if (zi < fallbackZ) {
            fallbackZ = zi;
            fallback = i;
          }
        }
        if (best < 0) best = fallback;
        if (best >= 0) {
          const spec = nr.layout[best];
          const entry = spec ? nr.list[spec.index % nr.list.length] : null;
          const key = entry && entry.item ? entry.itemIndex : -1;
          if (key !== nr.key) {
            nr.key = key;
            nr.cb(entry ? entry.item : null);
          }
        }
      }
      const fz = frameZ.current;
      const frameCache = lastFrameStyle.current;
      for (let i = 0; i < fz.length; i++) {
        const el = frameRefs.current[i];
        if (!el) continue;
        const zi = fz[i];
        const transform = `translate3d(0px, 0px, ${-zi}px)`;
        const opacity = zi > fadeStart ? String(clamp(1 - (zi - fadeStart) / fadeSpan, 0, 1)) : "1";
        const prev = frameCache[i];
        if (!prev) {
          el.style.transform = transform;
          el.style.opacity = opacity;
          frameCache[i] = { t: transform, o: opacity };
          continue;
        }
        if (prev.t !== transform) {
          el.style.transform = transform;
          prev.t = transform;
        }
        if (prev.o !== opacity) {
          el.style.opacity = opacity;
          prev.o = opacity;
        }
      }
    }, [depth, mouseParallax]);
  useEffect(() => {
    if (isStatic) {
      // Canvas / thumbnail render: paint one static frame, no RAF.
      writeFrame();
      return;
    }
    const NEAR = -Math.max(200, geo.halfWidth * 0.4);
    const speedBase = 320 * clamp(animationSpeed, 0.1, 5);
    /**
     * Whether the loop is worth scheduling at all. Off-screen or in a
     * hidden tab we draw nothing - this is what stops the component
     * burning GPU for the whole lifetime of the page.
     */ const shouldSchedule = () => {
      if (typeof document !== "undefined" && document.hidden) return false;
      if (!visibleRef.current) return false;
      if (reducedMotion) {
        // Keep ticking only until the ramp / boost / pointer easing
        // has settled, then idle completely.
        const p = pointerRef.current;
        const t = pointerTargetRef.current;
        return (
          rampRef.current > 0.001 ||
          Math.abs(boostRef.current - 1) > 0.001 ||
          Math.abs(p.x - t.x) > 0.001 ||
          Math.abs(p.y - t.y) > 0.001
        );
      }
      return true;
    };
    const stop = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = 0;
    };
    const tick = (time) => {
      const last = lastTimeRef.current || time;
      lastTimeRef.current = time;
      const dt = Math.min(0.05, (time - last) / 1e3);
      const hoverPause = pauseOnHover && hoverRef.current;
      const running =
        startedRef.current &&
        !pausedRef.current &&
        !hoverPause &&
        !reducedMotion &&
        visibleRef.current &&
        !frozenRef.current; // Ease from the near-static idle drift into full travel.
      const target = running ? 1 : 0;
      rampRef.current += (target - rampRef.current) * Math.min(1, dt * 2.4); // Ease the long-press speed boost in and back out smoothly.
      const boostTarget = running && holdRef.current ? BOOST_MAX : 1;
      boostRef.current += (boostTarget - boostRef.current) * Math.min(1, dt * BOOST_EASE);
      const idle = reducedMotion ? 0 : 0.035;
      const factor = idle + (1 - idle) * rampRef.current;
      const delta = speedBase * factor * boostRef.current * dt;
      if (delta > 0) {
        const z = tileZ.current;
        for (let i = 0; i < z.length; i++) {
          let v = z[i] - delta;
          if (v < NEAR) v += depth;
          z[i] = v;
        }
        const fz = frameZ.current;
        for (let i = 0; i < fz.length; i++) {
          let v = fz[i] - delta;
          if (v < NEAR) v += depth;
          fz[i] = v;
        }
      } // Smoothed pointer easing.
      const p = pointerRef.current;
      const t = pointerTargetRef.current;
      p.x += (t.x - p.x) * Math.min(1, dt * 3);
      p.y += (t.y - p.y) * Math.min(1, dt * 3);
      writeFrame();
      if (shouldSchedule()) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        stop();
      }
    };
    const wake = () => {
      if (rafRef.current !== null) return;
      if (!shouldSchedule()) return;
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    };
    wakeRef.current = wake; // Paint the current state once even if we're off-screen, so the
    // scene is correct the moment it scrolls into view.
    writeFrame();
    wake();
    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else wake();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      wakeRef.current = () => {};
      stop();
    };
  }, [isStatic, animationSpeed, depth, geo.halfWidth, pauseOnHover, reducedMotion, writeFrame]);
  /* --------------- external / prop-driven controls ---------- */ useEffect(() => {
    setStarted(autoStart);
    if (!autoStart) rampRef.current = 0;
  }, [autoStart]);
  const handleStart = useCallback(() => {
    setStarted(true);
    setPaused(false);
    wakeRef.current();
  }, []); /* KHARIS PATCH: a page that renders its own start control flips this and
   * the tunnel begins, instead of relying on the built-in button. */
  useEffect(() => {
    if (startSignal) setStarted(true);
  }, [startSignal]);
  const handleSceneClick = useCallback(() => {
    if (!clickToToggle || !startedRef.current) return;
    setPaused((p) => !p);
    wakeRef.current();
  }, [clickToToggle]);
  /* ------------------------- styling ------------------------ */ const lineColor = withAlpha(
    gridColor,
    gridOpacity,
  );
  const thickness = clamp(gridThickness, 0.5, 3); // Everything below adapts to the chosen background instead of assuming
  // a black scene, so a light/white theme doesn't show a stray dark disc
  // or a washed-out grid.
  const isLightTheme = luminanceOf(backgroundColor) > 0.6;
  const vignetteColor = withAlpha(backgroundColor, 0.92);
  const vignetteTransparent = withAlpha(backgroundColor, 0);
  const tilePlaceholderColor = isLightTheme ? "#EDEDED" : "#050505";
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: backgroundColor,
    perspective: `${effectivePerspective}px`,
    perspectiveOrigin: "50% 50%",
    touchAction: "manipulation", // Keeps the tunnel's paint and layout work from leaking into the
    // rest of the page.
    contain: "layout paint",
    ...style,
  };
  return /*#__PURE__*/ _jsxs("div", {
    ref: containerRef,
    style: containerStyle,
    onPointerEnter: () => {
      hoverRef.current = true;
    },
    onPointerLeave: () => {
      hoverRef.current = false;
      wakeRef.current();
    },
    onClick: handleSceneClick,
    children: [
      /*#__PURE__*/ _jsxs("div", {
        ref: sceneRef,
        style: {
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          willChange: "transform",
          pointerEvents: "none",
        },
        children: [
          /*#__PURE__*/ _jsx("div", {
            style: {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: geo.halfWidth * 2,
              height: geo.halfHeight * 2,
              marginLeft: -geo.halfWidth,
              marginTop: -geo.halfHeight,
              transform: `translate3d(0px, 0px, ${-depth}px)`,
              backgroundColor: backgroundColor,
              transformStyle: "preserve-3d",
            },
          }),
          showGrid
            ? /*#__PURE__*/ _jsx(TunnelGrid, {
                geo: geo,
                frameCount: frameCount,
                lineColor: lineColor,
                thickness: thickness,
                registerFrame: (i) => (el) => {
                  frameRefs.current[i] = el;
                },
              })
            : null,
          /*#__PURE__*/ _jsx("div", {
            style: { position: "absolute", inset: 0, transformStyle: "preserve-3d" },
            children: layout.map((spec, i) =>
              /*#__PURE__*/ _jsx(
                TunnelTile,
                {
                  spec: spec,
                  geo: geo,
                  scale: clamp(imageTileScale, 0.5, 2),
                  gap: clamp(tileGap, 0, 100),
                  image:
                    imageList.length > 0 ? imageList[spec.index % imageList.length] : emptyImage,
                  placeholderColor: tilePlaceholderColor,
                  onSelect: onSelectItem,
                  onHover: onHoverItem,
                  registerRef: (el) => {
                    tileRefs.current[i] = el;
                  },
                },
                `${spec.surface}-${i}`,
              ),
            ),
          }),
        ],
      }),
      /*#__PURE__*/ _jsx("div", {
        style: {
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at 50% 50%, ${vignetteColor} 0%, ${vignetteTransparent} 20%)`,
        },
      }),
      showStartButton
        ? /*#__PURE__*/ _jsx(StartButton, {
            label: startText,
            visible: !started,
            onStart: handleStart,
            compact: isCompact,
            invert: isLightTheme,
          })
        : null,
    ],
  });
}
/* ====================== PROPERTY CONTROLS ======================== */ addPropertyControls(
  InfiniteImageTunnel,
  {
    images: {
      type: ControlType.Array,
      title: "Images",
      control: { type: ControlType.ResponsiveImage },
      defaultValue: [],
      maxCount: 24,
    },
    startText: {
      type: ControlType.String,
      title: "Start Text",
      defaultValue: "Press to Start",
      placeholder: "Press to Start",
      hidden: (fields) => !fields.showStartButton,
    },
    showStartButton: { type: ControlType.Boolean, title: "Start Button", defaultValue: true },
    autoStart: { type: ControlType.Boolean, title: "Auto Start", defaultValue: false },
    animationSpeed: {
      type: ControlType.Number,
      title: "Animation Speed",
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
      displayStepper: false,
    },
    pauseOnHover: { type: ControlType.Boolean, title: "Pause On Hover", defaultValue: false },
    clickToToggle: { type: ControlType.Boolean, title: "Click To Pause", defaultValue: true },
    mouseParallax: { type: ControlType.Boolean, title: "Mouse Parallax", defaultValue: true },
    reducedMotion: { type: ControlType.Boolean, title: "Reduced Motion", defaultValue: false },
    perspective: {
      type: ControlType.Number,
      title: "Perspective",
      min: 500,
      max: 3e3,
      step: 10,
      defaultValue: 1800,
      unit: "px",
      displayStepper: false,
    },
    tunnelDepth: {
      type: ControlType.Number,
      title: "Tunnel Depth",
      min: 1e3,
      max: 1e4,
      step: 100,
      defaultValue: 5e3,
      unit: "px",
      displayStepper: false,
    },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#000000" },
    showGrid: { type: ControlType.Boolean, title: "Show Grid", defaultValue: true },
    gridColor: {
      type: ControlType.Color,
      title: "Grid Color",
      defaultValue: "#FFFFFF",
      hidden: (fields) => !fields.showGrid,
    },
    gridOpacity: {
      type: ControlType.Number,
      title: "Grid Opacity",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.25,
      displayStepper: false,
      hidden: (fields) => !fields.showGrid,
    },
    gridThickness: {
      type: ControlType.Number,
      title: "Grid Width",
      min: 0.5,
      max: 3,
      step: 0.1,
      defaultValue: 1,
      unit: "px",
      displayStepper: false,
      hidden: (fields) => !fields.showGrid,
    },
    tileGap: {
      type: ControlType.Number,
      title: "Tile Gap",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 12,
      unit: "px",
      displayStepper: false,
    },
    imageTileScale: {
      type: ControlType.Number,
      title: "Tile Scale",
      min: 0.5,
      max: 2,
      step: 0.05,
      defaultValue: 1,
      displayStepper: false,
      description: "Get more components from [Framerstacks](https://www.framerstacks.com/)",
    },
  },
);
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "InfiniteImageTunnel",
      slots: [],
      annotations: {
        framerSupportedLayoutWidth: "any",
        framerIntrinsicHeight: "700",
        framerDisableUnlink: "",
        framerSupportedLayoutHeight: "any",
        framerIntrinsicWidth: "1200",
        framerContractVersion: "1",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./InfiniteImageTunnel.map
