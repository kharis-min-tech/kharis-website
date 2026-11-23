import { expect, it } from "vitest";
import { getImgProps } from "next/dist/shared/lib/get-img-props";
import { imageConfigDefault, prepareImageConfig } from "next/dist/shared/lib/image-config";
import defaultLoader from "next/dist/shared/lib/image-loader";
import nextConfig from "../../next.config";

const imgConf = prepareImageConfig({ ...imageConfigDefault, ...nextConfig.images });

it("accepts the branch carousel's quality for Cloudflare pictures", () => {
  const { props } = getImgProps(
    {
      src: "https://images.kharis.org/site-images/main/example.jpg",
      alt: "Branch photo",
      width: 640,
      height: 480,
      quality: 90,
    },
    { defaultLoader, imgConf },
  );
  expect(props.src).toContain("q=90");
});

it("delivers full-width high-resolution candidates at the site's default photo quality", async () => {
  const { default: SiteImage } = await import("../components/SiteImage");
  const element = SiteImage({
    src: "https://images.kharis.org/site-images/main/example.jpg",
    alt: "Full-width event photo",
    fill: true,
    sizes: "100vw",
  });
  const { props } = getImgProps(element.props, {
    defaultLoader,
    imgConf,
  });
  /* 80, down from 95. Roughly half the bytes for a difference that needs a
     magnified crop to see, on a site that is almost entirely photographs -
     and low enough that AVIF encodes quickly, which is why it is back on in
     next.config.ts. See docs/performance/media-quality.md. */
  expect(props.src).toContain("q=80");
  expect(props.srcSet).toContain("3840w");
});

it("offers AVIF ahead of WebP", () => {
  expect(nextConfig.images?.formats).toEqual(["image/avif", "image/webp"]);
});

/* Next rejects any quality not listed in `images.qualities`, so a call site
   asking for one that was never declared silently fails to render. */
it("declares every quality the site asks for", () => {
  for (const quality of [75, 80, 90, 95]) {
    expect(nextConfig.images?.qualities).toContain(quality);
  }
});
