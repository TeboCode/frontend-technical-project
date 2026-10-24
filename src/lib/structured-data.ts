// schema.org JSON-LD describing the organisation and website, so search
// engines understand who runs the site. Entities reference each other by
// `@id`, so page-level data (e.g. branches) can point back to the organisation.
//
// Validate changes with https://validator.schema.org/ or Google's Rich
// Results Test (https://search.google.com/test/rich-results).

import type { Graph, Organization, WebSite } from "schema-dts";
import { siteConfig } from "@/config/site";

const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

export const organizationId = absoluteUrl("/#organization");
export const websiteId = absoluteUrl("/#website");

// No `logo`: Google requires a logo of at least 112×112px and the current
// wordmark is 137×24. Add one here once a square logo exists.
function organization(): Organization {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legal.company,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    areaServed: { "@type": "Country", name: "South Africa" },
  };
}

function website(): WebSite {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: "en-ZA",
    publisher: { "@id": organizationId },
  };
}

/** Site-wide structured data, rendered once in the root layout. */
export function siteJsonLd(): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [organization(), website()],
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" to prevent script injection. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
