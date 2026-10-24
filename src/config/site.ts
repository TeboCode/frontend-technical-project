export const siteConfig = {
  name: "TeboTec",
  // Public address of the site, used for absolute URLs (sitemap, robots,
  // social previews). Read at build time — set SITE_URL in the build env.
  url: process.env.SITE_URL ?? "http://localhost:3000",
  description:
    "Make informed financial decisions with the right information at your fingertips. Insights, loan eligibility and branch locations, all in one place.",
  legal: {
    company: "TeboTec (Pty) Ltd",
    // Fixed rather than computed: with Cache Components, reading the clock
    // during prerendering would make every page dynamic. Update yearly.
    copyrightYear: 2026,
    trademarkNotice: "TeboTec is a registered trademark.",
  },
} as const;
