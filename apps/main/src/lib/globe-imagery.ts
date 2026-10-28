import siteImageUrls from "./site-image-urls.json";

type CityPhoto = {
  photo: string;
  author: string;
  source: string;
  license: string;
  licenseUrl: string;
};

/** City illustrations for globe callouts, separate from branch building photographs. */
export const globeCityPhotos: Record<string, CityPhoto> = {
  london: {
    photo: siteImageUrls["/images/globe/london-skyline.webp"],
    author: "flapcats",
    source: "https://commons.wikimedia.org/wiki/File:London_Skyline_purple_sunset.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  birmingham: {
    photo: siteImageUrls["/images/globe/birmingham-skyline.webp"],
    author: "MangoBoyy",
    source:
      "https://commons.wikimedia.org/wiki/File:Birmingham_Skyline_towards_South-West_in_the_evening.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  brighton: {
    photo: siteImageUrls["/images/globe/brighton-seafront.webp"],
    author: "BlueandWhiteStripes",
    source: "https://commons.wikimedia.org/wiki/File:Brighton_Panorama.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  bristol: {
    photo: siteImageUrls["/images/globe/bristol-clifton-bridge.webp"],
    author: "Gothick (edited by Nagualdesign)",
    source: "https://commons.wikimedia.org/wiki/File:Clifton_Suspension_Bridge-9350.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  accra: {
    photo: siteImageUrls["/images/globe/accra-independence-arch.webp"],
    author: "George Appiah",
    source: "https://commons.wikimedia.org/wiki/File:Independence_Arch_-_Accra,_Ghana2.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  freetown: {
    photo: siteImageUrls["/images/globe/freetown-harbour.webp"],
    author: "David Hond",
    source: "https://commons.wikimedia.org/wiki/File:Freetown-aerialview.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
};
