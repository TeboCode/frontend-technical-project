// schema.org structured data so search engines can show branch addresses,
// locations and opening hours. Public holiday hours are omitted because they
// need specific dates.

import { siteConfig } from "@/config/site";
import { parseTimeRange } from "./opening-hours";
import type { Branch, OpeningHours } from "./types";

const DAYS: Record<Exclude<keyof OpeningHours, "publicHolidays">, string[]> = {
  mondayToFriday: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  saturday: ["Saturday"],
  sunday: ["Sunday"],
};

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

function openingHoursSpecification(hours: OpeningHours) {
  return (Object.keys(DAYS) as (keyof typeof DAYS)[]).flatMap((key) => {
    const range = parseTimeRange(hours[key]);
    return range
      ? [{
          "@type": "OpeningHoursSpecification",
          dayOfWeek: DAYS[key],
          opens: toTime(range.open),
          closes: toTime(range.close),
        }]
      : [];
  });
}

export function branchesJsonLd(branches: Branch[]) {
  return {
    "@context": "https://schema.org",
    "@graph": branches.map((branch) => ({
      "@type": "BankOrCreditUnion",
      "@id": `#${branch.id}`,
      name: `${siteConfig.name} ${branch.name}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.address,
        addressLocality: branch.city,
        addressRegion: branch.province,
        postalCode: branch.postalCode,
        addressCountry: "ZA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: branch.latitude,
        longitude: branch.longitude,
      },
      openingHoursSpecification: openingHoursSpecification(branch.openingHours),
    })),
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" to prevent script injection. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
