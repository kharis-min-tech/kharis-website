/** Character / value slides for the homepage carousel (not locations). */

export type BranchSlide = {
  name: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
};

/** Campaign yellow and white: both read over photography. */
const ACCENTS = ["#ffde59", "#ffffff"] as const;

/**
 * This is Kharis — character words with the original branch-carousel photos
 * (branch-slide-1…5). No branch CTAs.
 */
export const CHARACTER_SLIDES: BranchSlide[] = [
  {
    name: "joyful",
    title: "Joyful",
    subtitle: "The joy of the LORD is your strength.",
    image: "https://images.kharis.org/site-images/main/850b7f32a7f6712c/joyful-worship.jpg",
    accent: ACCENTS[0],
  },
  {
    name: "christ-centred",
    title: "Christ Exalting",
    subtitle: "That in all things Christ may have the preeminence.",
    image: "https://images.kharis.org/site-images/main/79f53822455f01b0/branch-slide-2.jpg",
    accent: ACCENTS[1],
  },
  {
    name: "biblical",
    title: "Biblical",
    subtitle: "Your word is a lamp to my feet.",
    image: "https://images.kharis.org/site-images/main/b65991e38ead9ab1/biblical-open-bible.jpg",
    accent: ACCENTS[0],
  },
  {
    name: "love",
    title: "Love",
    subtitle:
      "Because He laid down His life for us, we also ought to lay down our lives for the brethren.",
    image: "https://images.kharis.org/site-images/main/6cecd6b024bd301a/love-greeting.jpg",
    accent: ACCENTS[1],
  },
  {
    name: "grace-filled",
    title: "Grace-filled",
    subtitle: "Grace and peace be multiplied to you in the knowledge of God and of Jesus our Lord.",
    image: "https://images.kharis.org/site-images/main/16b531253b8a325e/grace-filled-prayer.jpg",
    accent: ACCENTS[0],
  },
];

export async function fetchBranchSlides(): Promise<BranchSlide[]> {
  return CHARACTER_SLIDES;
}
