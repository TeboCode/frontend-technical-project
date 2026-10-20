import type { StaticImageData } from "next/image";
import insightsImage from "@/assets/images/insights.webp";
import loanEligibilityImage from "@/assets/images/loan-eligibility.webp";
import branchLocatorImage from "@/assets/images/branch-locator.webp";
import { routes } from "./navigation";

export type Feature = {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  ctaLabel: string;
  href: string;
};

export const features: Feature[] = [
  {
    title: "Insights",
    description:
      "Understand your spending habits through clear visual analytics that help you track expenses and identify financial trends.",
    image: insightsImage,
    imageAlt:
      "Printed financial charts and graphs on a desk with a magnifying glass and coloured pencils",
    ctaLabel: "View Insights",
    href: routes.insights,
  },
  {
    title: "Loan Eligibility",
    description:
      "Explore your potential loan eligibility by entering your financial details and estimating what you may qualify for.",
    image: loanEligibilityImage,
    imageAlt:
      "Calculator and pen resting on a printed investment and loan repayment table",
    ctaLabel: "Check Eligibility",
    href: routes.loanEligibility,
  },
  {
    title: "Branch Locator",
    description:
      "Find a nearby branch to access in-person banking services and get the assistance you need.",
    image: branchLocatorImage,
    imageAlt: "Green location pin marking a place on a city street map",
    ctaLabel: "Find a Branch",
    href: routes.branchLocator,
  },
];
