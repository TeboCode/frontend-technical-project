export type NavItem = {
  label: string;
  href: string;
};

export const routes = {
  home: "/",
  insights: "/insights",
  loanEligibility: "/loan-eligibility",
  branchLocator: "/branch-locator",
} as const;

export const mainNav: NavItem[] = [
  { label: "Insights", href: routes.insights },
  { label: "Loan Eligibility", href: routes.loanEligibility },
  { label: "Branch Locator", href: routes.branchLocator },
];
