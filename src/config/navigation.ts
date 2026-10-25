export type NavItem = {
  label: string;
  href: string;
};

export const routes = {
  home: "/",
  insights: "/insights",
  loanEligibility: "/loan-eligibility",
  branchLocator: "/branch-locator",
  legal: "/legal",
} as const;

export const mainNav: NavItem[] = [
  { label: "Insights", href: routes.insights },
  { label: "Loan Eligibility", href: routes.loanEligibility },
  { label: "Branch Locator", href: routes.branchLocator },
];

export type PublicPage = {
  href: string;
  title: string;
  description: string;
};

/**
 * Public pages, listed in sitemap.xml and llms.txt. `insights` is left out on
 * purpose: it shows a customer's personal finances, so it shouldn't appear in
 * search results or AI answers.
 */
export const publicPages: PublicPage[] = [
  {
    href: routes.home,
    title: "Home",
    description: "Overview of TeboTec's spending insights, loan eligibility and branch locator tools.",
  },
  {
    href: routes.loanEligibility,
    title: "Loan Eligibility Simulator",
    description:
      "Enter your income, expenses and desired loan amount to estimate your loan eligibility, interest rate and monthly repayment, without affecting your credit score.",
  },
  {
    href: routes.branchLocator,
    title: "Branch Locator",
    description:
      "Find a TeboTec branch near you, with addresses, opening hours and directions across South Africa.",
  },
  {
    href: routes.legal,
    title: "Legal",
    description:
      "TeboTec's terms of use, privacy policy, cookie policy and loan simulator disclaimer, and how to contact us about them.",
  },
];

/** Section anchors on the legal page that other pages link to. */
export const legalAnchors = {
  cookiePolicy: "cookie-policy",
} as const;

export const footerNav: NavItem[] = [
  { label: "Branch Locator", href: routes.branchLocator },
  { label: "Legal", href: routes.legal },
];
