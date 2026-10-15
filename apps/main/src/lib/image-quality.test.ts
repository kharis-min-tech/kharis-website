import { expect, it } from "vitest";
import { getImgProps } from "next/dist/shared/lib/get-img-props";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import defaultLoader from "next/dist/shared/lib/image-loader";
import nextConfig from "../../next.config";

it("accepts the branch carousel's quality for Cloudflare pictures", () => {
  const { props } = getImgProps(
    {
      src: "https://images.kharis.org/site-images/main/example.jpg",
      alt: "Branch photo",
      width: 640,
      height: 480,
      quality: 90,
    },
    { defaultLoader, imgConf: { ...imageConfigDefault, ...nextConfig.images } },
  );
  expect(props.src).toContain("q=90");
});
