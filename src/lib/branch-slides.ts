/** Character / value slides for the homepage carousel (not locations). */

export type BranchSlide = {
  name: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
};

const ACCENTS = ["#FD7F20", "#800654"] as const;

/**
 * How Kharis Looks — character words with the original branch-carousel photos
 * (branch-slide-1…5). No branch CTAs.
 */
export const CHARACTER_SLIDES: BranchSlide[] = [
  {
    name: "joyful",
    title: "Joyful",
    subtitle: "Full of life, worship and praise",
    image: "/images/branch-slide-1.jpg",
    accent: ACCENTS[0],
  },
  {
    name: "christ-centred",
    title: "Christ-centred",
    subtitle: "Jesus at the heart of everything we do",
    image: "/images/branch-slide-2.jpg",
    accent: ACCENTS[1],
  },
  {
    name: "biblical",
    title: "Biblical",
    subtitle: "Grounded in the Word, shaped by truth",
    image: "/images/branch-slide-3.jpg",
    accent: ACCENTS[0],
  },
  {
    name: "love",
    title: "Love",
    subtitle: "A caring family where people belong",
    image: "/images/branch-slide-4.jpg",
    accent: ACCENTS[1],
  },
  {
    name: "grace-filled",
    title: "Grace-filled",
    subtitle: "Changing the world with a touch of His grace",
    image: "/images/branch-slide-5.jpg",
    accent: ACCENTS[0],
  },
];

export async function fetchBranchSlides(): Promise<BranchSlide[]> {
  return CHARACTER_SLIDES;
}
