import { renderShareImage } from "@/lib/share-image";

// Literal exports: Next.js reads these statically for the og:image tags.
export const alt = "TeboTec: Insights, eligibility & branches. All in one place.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderShareImage();
}
