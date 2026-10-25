// Builds /llms.txt and /llms-full.txt (https://llmstxt.org): Markdown that
// helps AI assistants describe the site accurately. llms.txt is an index of
// links; llms-full.txt carries the content itself. Both are generated from the
// same config as the sitemap and pages, so they stay in sync.

import { features } from "@/config/features";
import { publicPages, routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

const pageFor = (href: string) => {
  const page = publicPages.find((candidate) => candidate.href === href);
  if (!page) throw new Error(`No public page registered for ${href}`);
  return page;
};

/** Title, summary and notes shared by both files so they never contradict each other. */
function introduction() {
  return `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is operated by ${siteConfig.legal.company} and serves customers in South Africa. Amounts are in South African rand (ZAR).

Important notes:

- Results from the Loan Eligibility Simulator are estimates only, not credit offers. Final approval, amount and interest rate depend on a full credit assessment.
- The spending insights dashboard (${absoluteUrl(routes.insights)}) is a signed-in customer area showing personal financial data. It has no public content.`;
}

export function buildLlmsTxt() {
  const pages = publicPages
    .map((page) => `- [${page.title}](${absoluteUrl(page.href)}): ${page.description}`)
    .join("\n");

  return `${introduction()}

## Pages

${pages}

## Optional

- [Full content](${absoluteUrl("/llms-full.txt")}): All public page content in a single file.
- [Sitemap](${absoluteUrl("/sitemap.xml")}): Machine-readable list of public pages.
`;
}

function pageSection(href: string, body: string) {
  const page = pageFor(href);
  return `## ${page.title}

URL: ${absoluteUrl(page.href)}

${page.description}

${body.trim()}`;
}

function homeSection() {
  const tools = features
    .map((feature) => `- **${feature.title}** (${absoluteUrl(feature.href)}): ${feature.description}`)
    .join("\n");

  return pageSection(
    routes.home,
    `Insights, eligibility and branches, all in one place. The site brings together three tools:

${tools}`,
  );
}

// When the loan and branch locator branches merge, extend these sections with
// generated detail: product limits from `getLoanProducts()` and the branch list
// (addresses, opening hours) from `getBranches()`.
function loanSection() {
  return pageSection(
    routes.loanEligibility,
    `### How it works

1. **About you:** age, employment status and how long you've been in your current job.
2. **Your finances:** monthly income after tax, monthly expenses, total existing debt and, optionally, your credit score.
3. **Your loan:** what the loan is for, the amount and the repayment term in months.

The simulator then estimates:

- Whether you're likely to be eligible, with the main reason.
- Your approval likelihood and risk level.
- A recommended loan amount, interest rate, monthly repayment and total repayment. If the requested amount isn't affordable, it suggests the maximum you may qualify for.
- An affordability summary: disposable income, debt-to-income and loan-to-income ratios.
- A month-by-month repayment schedule.

Checking eligibility does not affect your credit score.`,
  );
}

function branchSection() {
  return pageSection(
    routes.branchLocator,
    `### How it works

- Search branches by name, city or postal code, or filter by province.
- Share your location to list the nearest branches first, with distances.
- Each branch shows its address, opening hours (weekdays, Saturday, Sunday and public holidays), whether it's open now, and a link for directions.`,
  );
}

export function buildLlmsFullTxt() {
  return `${introduction()}

${homeSection()}

${loanSection()}

${branchSection()}

## Legal

© ${siteConfig.legal.copyrightYear} ${siteConfig.legal.company}. All rights reserved. ${siteConfig.legal.trademarkNotice}
`;
}
