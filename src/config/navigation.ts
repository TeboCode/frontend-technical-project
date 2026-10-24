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

export const footerNav: NavItem[] = [
  { label: "Branch Locator", href: routes.branchLocator },
  { label: "Legal", href: routes.legal },
];
