import Link from "next/link";
import { routes } from "@/config/navigation";
import { buildHref, type RawSearchParams } from "@/lib/insights/search-params";
import type { DateRangePreset, Period } from "@/lib/insights/types";

type PeriodFilterProps = {
  presets: DateRangePreset[];
  activePeriod: Period;
  searchParams: RawSearchParams;
};

/** "Last 30 days" → "30 days", "Last year" → "1 year" — fits four tabs across a phone. */
function shortLabel(label: string) {
  const short = label.replace(/^Last\s+/i, "");
  return /^\d/.test(short) ? short : `1 ${short}`;
}

/** Period selector built from links, so it works without JavaScript and is shareable. */
export function PeriodFilter({ presets, activePeriod, searchParams }: PeriodFilterProps) {
  return (
    <nav aria-label="Reporting period" className="w-full sm:w-auto">
      <ul className="grid grid-cols-4 gap-1 rounded-md bg-white p-1 shadow-[0_2px_10px_rgba(0,0,0,0.06)] sm:inline-flex">
        {presets.map((preset) => {
          const isActive = preset.value === activePeriod;
          return (
            <li key={preset.value}>
              <Link
                href={buildHref(routes.insights, searchParams, { period: preset.value })}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                className={`block whitespace-nowrap rounded-sm px-2 py-2 text-center text-sm transition-colors sm:px-3 sm:py-1.5 ${
                  isActive
                    ? "bg-brand font-medium text-white"
                    : "text-heading hover:bg-surface"
                }`}
              >
                <span className="sm:hidden">{shortLabel(preset.label)}</span>
                <span className="hidden sm:inline">{preset.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
