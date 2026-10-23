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
  expect(props.src).toContain("q=95");
  expect(props.srcSet).toContain("3840w");
});
