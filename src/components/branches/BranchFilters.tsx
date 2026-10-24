import { LocateFixed, Search } from "lucide-react";

export type LocationStatus = "idle" | "locating" | "located" | "denied" | "unavailable";

type BranchFiltersProps = {
  query: string;
  onQueryChange: (query: string) => void;
  province: string;
  provinces: string[];
  onProvinceChange: (province: string) => void;
  locationStatus: LocationStatus;
  onLocate: () => void;
};

const LOCATION_MESSAGES: Partial<Record<LocationStatus, string>> = {
  locating: "Finding your location…",
  located: "Showing nearest branches first.",
  denied: "Location access was blocked. You can still search by city or postal code.",
  unavailable: "We couldn't find your location. You can still search by city or postal code.",
};

const fieldClass =
  "block w-full min-w-0 rounded-sm border border-black/15 bg-white py-2.5 text-base text-heading focus:border-brand focus:outline-2 focus:outline-brand/30 sm:text-sm";

/** Filters apply as you type; the search landmark helps assistive tech find them. */
export function BranchFilters({
  query,
  onQueryChange,
  province,
  provinces,
  onProvinceChange,
  locationStatus,
  onLocate,
}: BranchFiltersProps) {
  return (
    <search className="block rounded-md bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] sm:p-5">
      <form onSubmit={(event) => event.preventDefault()} className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="branch-search" className="block text-sm font-medium text-heading">
            Search branches
          </label>
          <div className="relative mt-1.5">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body" />
            <input
              id="branch-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Name, city or postal code"
              autoComplete="off"
              className={`${fieldClass} pl-9 pr-3`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="branch-province" className="block text-sm font-medium text-heading">
            Province
          </label>
          <select
            id="branch-province"
            value={province}
            onChange={(event) => onProvinceChange(event.target.value)}
            className={`${fieldClass} mt-1.5 px-3`}
          >
            <option value="">All provinces</option>
            {provinces.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onLocate}
            aria-disabled={locationStatus === "locating"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-brand px-4 py-2.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand/5 aria-disabled:cursor-wait aria-disabled:opacity-70"
          >
            <LocateFixed aria-hidden="true" className="size-4" />
            {locationStatus === "located" ? "Update my location" : "Use my location"}
          </button>
        </div>
      </form>

      {/* Always rendered (even when empty) so status changes are announced. */}
      <p role="status" className="mt-2 text-xs text-body">
        {LOCATION_MESSAGES[locationStatus] ?? ""}
      </p>
    </search>
  );
}
