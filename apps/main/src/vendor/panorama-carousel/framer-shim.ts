/**
 * Minimal stand-in for the four `framer` runtime exports the vendored
 * AtomicGlobe module imports. Outside the Framer editor none of them need to
 * do anything real:
 *
 * - addPropertyControls / ControlType only describe the editor's sidebar.
 * - RenderTarget tells the component whether it is on the Framer canvas; we
 *   are always a live page, so it reports "preview" and never "canvas".
 * - useIsStaticRenderer is true during Framer's static export; in Next the
 *   component is client-only, so it is always false.
 *
 * Pulling in the real `framer` package instead would drag the whole Framer
 * runtime into the bundle for four constants.
 */

export const ControlType = {
  Array: "array",
  Boolean: "boolean",
  Color: "color",
  ComponentInstance: "componentinstance",
  Date: "date",
  Enum: "enum",
  EventHandler: "eventhandler",
  File: "file",
  FusedNumber: "fusednumber",
  Image: "image",
  Link: "link",
  Number: "number",
  Object: "object",
  PageScope: "pagescope",
  Padding: "padding",
  BorderRadius: "borderradius",
  ResponsiveImage: "responsiveimage",
  RichText: "richtext",
  ScrollSectionRef: "scrollsectionref",
  String: "string",
  Transition: "transition",
} as const;

/** No-op: there is no editor sidebar to describe. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function addPropertyControls(...args: unknown[]): void {}

export const RenderTarget = {
  canvas: "CANVAS",
  export: "EXPORT",
  thumbnail: "THUMBNAIL",
  preview: "PREVIEW",
  current: () => "PREVIEW",
} as const;

/** Always a live client render here, never Framer's static export pass. */
export function useIsStaticRenderer(): boolean {
  return false;
}
