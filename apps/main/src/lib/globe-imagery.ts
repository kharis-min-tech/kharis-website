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
  chatham: {
    photo: siteImageUrls["/images/globe/chatham-dockyard.webp"],
    author: "Michael Coppins",
    source: "https://commons.wikimedia.org/wiki/File:Chatham_Dockyard%2C_Clock_Tower_Building.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  chelmesford: {
    photo: siteImageUrls["/images/globe/chelmsford-cathedral.webp"],
    author: "David Iliff",
    source:
      "https://commons.wikimedia.org/wiki/File:Chelmsford_Cathedral_Exterior%2C_Essex%2C_UK_-_Diliff.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  coventry: {
    photo: siteImageUrls["/images/globe/coventry-cathedral.webp"],
    author: "DeFacto",
    source: "https://commons.wikimedia.org/wiki/File:Coventry_Cathedral_2018.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  croydon: {
    photo: siteImageUrls["/images/globe/croydon-town-hall.webp"],
    author: "Tadie88 from Wallington Surrey",
    source:
      "https://commons.wikimedia.org/wiki/File:P1490912_The_Old_Town_Hall%2CKatherine_Street.._Croydon...jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  luton: {
    photo: siteImageUrls["/images/globe/luton-town-hall.webp"],
    author: "Doyle of London",
    source: "https://commons.wikimedia.org/wiki/File:Luton_Town_Hall_and_War_Memorial_(01).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  northampton: {
    photo: siteImageUrls["/images/globe/northampton-guildhall.webp"],
    author: "Immanuel Giel",
    source: "https://commons.wikimedia.org/wiki/File:Northampton_Guildhall_01.jpg",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  },
  nottingham: {
    photo: siteImageUrls["/images/globe/nottingham-council-house.webp"],
    author: "John Sutton",
    source:
      "https://commons.wikimedia.org/wiki/File:Nottingham_Council_House_on_Coronation_Day_-_geograph.org.uk_-_7477109.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  orpington: {
    photo: siteImageUrls["/images/globe/orpington-war-memorial.webp"],
    author: "Marathon",
    source:
      "https://commons.wikimedia.org/wiki/File:Orpington_War_Memorial_-_geograph.org.uk_-_2539672.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  reading: {
    photo: siteImageUrls["/images/globe/reading-town-hall.webp"],
    author: "Smuconlaw",
    source: "https://commons.wikimedia.org/wiki/File:Reading_Town_Hall%2C_UK_-_20150707.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  manchester: {
    photo: siteImageUrls["/images/globe/manchester-skyline.webp"],
    author: "David Dixon",
    source:
      "https://commons.wikimedia.org/wiki/File:Tower_Blocks_over_Knott_Mill%2C_geograph_6866152_by_David_Dixon.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  "kp2-barking": {
    photo: siteImageUrls["/images/globe/barking-abbey.webp"],
    author: "MRSC at English Wikipedia",
    source: "https://commons.wikimedia.org/wiki/File:Barking_abbey_curfew_tower_london.jpg",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
  },
  "kp2-peterborough": {
    photo: siteImageUrls["/images/globe/peterborough-skyline.webp"],
    author: "Fourinmybarn",
    source: "https://commons.wikimedia.org/wiki/File:Peterborough_skyline_with_Cathedral.webp",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  },
  "kp2-romford": {
    photo: siteImageUrls["/images/globe/romford-market-place.webp"],
    author: "John Salmon",
    source:
      "https://commons.wikimedia.org/wiki/File:St_Edward_the_Confessor%2C_Market_Place%2C_Romford_-_geograph.org.uk_-_3157858.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  "kp2-southampton": {
    photo: siteImageUrls["/images/globe/southampton-marina.webp"],
    author: "David Martin",
    source:
      "https://commons.wikimedia.org/wiki/File:View_across_Ocean_Village_Marina_(geograph_5432669).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
};

/** KP2 branches in the same city share its skyline photograph. */
export function globeCityPhoto(slug: string): CityPhoto | undefined {
  return globeCityPhotos[slug] ?? globeCityPhotos[slug.replace(/^kp2-/, "")];
}
