// Content for the /legal page, kept as data so the page, its table of
// contents and llms-full.txt are built from one source.
//
// MOCK CONTENT: placeholder wording for development. It must be replaced with
// text approved by legal counsel before launch. The cookie policy's storage
// table does reflect what the site currently stores — keep it up to date.

import { legalAnchors } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; caption: string; columns: string[]; rows: string[][] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

const { company, copyrightYear, trademarkNotice } = siteConfig.legal;

/** ISO date (YYYY-MM-DD) the legal content was last changed. */
export const legalLastUpdated = "2026-10-01";

export const legalContact = {
  email: "legal@tebotec.co.za",
  privacyEmail: "privacy@tebotec.co.za",
  address: "TeboTec House, 1 Example Street, Sandton, Johannesburg, 2196",
};

export const legalSections: LegalSection[] = [
  {
    id: "terms-of-use",
    title: "Terms of use",
    blocks: [
      {
        type: "paragraph",
        text: `These terms apply to your use of the ${siteConfig.name} website, operated by ${company}. By using the website you agree to them. If you do not agree, please do not use the website.`,
      },
      {
        type: "list",
        items: [
          "You may use the website for your own personal, non-commercial purposes.",
          "You must not misuse the website, for example by trying to gain unauthorised access, interfering with its operation or introducing malicious code.",
          "Information on the website is provided for general information only and may change without notice.",
          "We may update these terms from time to time. The date at the top of this page shows when they last changed.",
        ],
      },
      {
        type: "paragraph",
        text: "These terms are governed by the laws of the Republic of South Africa.",
      },
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy policy",
    blocks: [
      {
        type: "paragraph",
        text: `${company} is committed to protecting your personal information in line with the Protection of Personal Information Act, 2013 (POPIA).`,
      },
      {
        type: "paragraph",
        text: "We may process the following personal information:",
      },
      {
        type: "list",
        items: [
          "Details you enter into the Loan Eligibility Simulator, such as your age, employment status, income, expenses and existing debt. These are used only to calculate your estimate and are not stored after your session.",
          "Your location, only if you choose to share it in the Branch Locator. It is used in your browser to sort branches by distance and is not sent to us.",
          "Account and transaction information shown in your Spending Insights dashboard when you are signed in.",
        ],
      },
      {
        type: "paragraph",
        text: "We do not sell your personal information. We share it only with service providers who help us run the website, under agreements that require them to protect it, or where the law requires us to.",
      },
      {
        type: "paragraph",
        text: `You have the right to ask what personal information we hold about you, to have it corrected or deleted, and to object to its processing. Contact our Information Officer at ${legalContact.privacyEmail}. You may also lodge a complaint with the Information Regulator of South Africa.`,
      },
    ],
  },
  {
    id: legalAnchors.cookiePolicy,
    title: "Cookie policy",
    blocks: [
      {
        type: "paragraph",
        text: `The ${siteConfig.name} website does not use advertising or analytics cookies. It stores a small amount of information in your browser's local storage so it can remember your choices:`,
      },
      {
        type: "table",
        caption: "Information stored in your browser",
        columns: ["Name", "Purpose", "How long it's kept"],
        rows: [
          ["tebotec-cookie-consent", "Remembers that you accepted the cookie notice, so it isn't shown again.", "Until you clear your browser data"],
          ["tebotec-theme", "Remembers whether you chose light or dark mode.", "Until you clear your browser data"],
        ],
      },
      {
        type: "paragraph",
        text: "The Branch Locator map loads map images from OpenStreetMap. Your browser requests these images directly, so OpenStreetMap receives your IP address under its own privacy policy.",
      },
      {
        type: "paragraph",
        text: "You can clear stored information at any time in your browser settings. The website will still work, but it will ask about cookies again and return to light mode.",
      },
    ],
  },
  {
    id: "loan-simulator-disclaimer",
    title: "Loan simulator disclaimer",
    blocks: [
      {
        type: "paragraph",
        text: "Results from the Loan Eligibility Simulator are estimates only. They are not a credit offer, a pre-approval or financial advice.",
      },
      {
        type: "list",
        items: [
          "Final approval, the loan amount and the interest rate depend on a full credit assessment, including a credit bureau check and verification of your income and expenses.",
          "Using the simulator does not affect your credit score.",
          "Interest rates and fees shown are indicative and may change. All amounts are in South African rand (ZAR).",
        ],
      },
      {
        type: "paragraph",
        text: "Credit is provided in terms of the National Credit Act, 2005. If you are struggling with debt, you can contact the National Credit Regulator for guidance.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Trademarks and copyright",
    blocks: [
      {
        type: "paragraph",
        text: `© ${copyrightYear} ${company}. All rights reserved. ${trademarkNotice}`,
      },
      {
        type: "paragraph",
        text: `The content, design, logos and images on this website belong to ${company} or its licensors. You may not copy, reproduce or distribute them without our written permission. Map data is © OpenStreetMap contributors.`,
      },
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    blocks: [
      {
        type: "paragraph",
        text: "If you have any questions about these terms or how we handle your information, please contact us:",
      },
      {
        type: "list",
        items: [
          `Legal queries: ${legalContact.email}`,
          `Privacy and POPIA requests: ${legalContact.privacyEmail}`,
          `Postal address: ${legalContact.address}`,
        ],
      },
    ],
  },
];
