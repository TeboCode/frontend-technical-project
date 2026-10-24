import { renderShareImage } from "@/lib/share-image";

// Same image as opengraph-image, so X/Twitter cards get a large preview too.
// Literal exports: Next.js reads these statically for the twitter:image tags.
export const alt = "TeboTec: Insights, eligibility & branches. All in one place.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return renderShareImage();
}
