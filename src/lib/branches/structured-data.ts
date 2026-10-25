// schema.org structured data so search engines can show branch addresses,
// locations and opening hours. Each branch points back to the organisation
// defined in lib/structured-data. Public holiday hours are omitted because
// they need specific dates.

import type { BankOrCreditUnion, DayOfWeek, Graph, OpeningHoursSpecification } from "schema-dts";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { absoluteUrl, organizationId } from "@/lib/structured-data";
import { parseTimeRange } from "./opening-hours";
import type { Branch, OpeningHours } from "./types";

const DAYS: Record<Exclude<keyof OpeningHours, "publicHolidays">, DayOfWeek[]> = {
  mondayToFriday: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  saturday: ["Saturday"],
  sunday: ["Sunday"],
};

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

function openingHoursSpecification(hours: OpeningHours): OpeningHoursSpecification[] {
  return (Object.keys(DAYS) as (keyof typeof DAYS)[]).flatMap((key) => {
    const range = parseTimeRange(hours[key]);
    return range
      ? [{
          "@type": "OpeningHoursSpecification" as const,
          dayOfWeek: DAYS[key],
          opens: toTime(range.open),
          closes: toTime(range.close),
        }]
      : [];
  });
}

function branchEntity(branch: Branch): BankOrCreditUnion {
  // Each card on the page has the branch id as its element id.
  const url = absoluteUrl(`${routes.branchLocator}#${branch.id}`);
  return {
    "@type": "BankOrCreditUnion",
    "@id": url,
    name: `${siteConfig.name} ${branch.name}`,
    url,
    parentOrganization: { "@id": organizationId },
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
  };
}

export function branchesJsonLd(branches: Branch[]): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": branches.map(branchEntity),
  };
}
