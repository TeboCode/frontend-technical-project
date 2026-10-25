import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { directionsUrl, formatDistance } from "@/lib/branches/geo";
import { getOpenStatus, OPENING_HOURS_LABELS } from "@/lib/branches/opening-hours";
import type { Branch, OpeningHours } from "@/lib/branches/types";

type BranchCardProps = {
  branch: Branch;
  distanceKm?: number;
  now: Date | null;
  isSelected: boolean;
  onShowOnMap: (id: string) => void;
};

export function BranchCard({ branch, distanceKm, now, isSelected, onShowOnMap }: BranchCardProps) {
  const headingId = `${branch.id}-name`;
  const status = now ? getOpenStatus(branch.openingHours, now) : null;

  return (
    <article
      id={branch.id}
      aria-labelledby={headingId}
      className={`scroll-mt-6 rounded-md bg-card p-5 shadow-card transition-shadow ${
        isSelected ? "ring-2 ring-brand" : ""
      }`}
    >
      {/* No wrapping: the name takes the remaining width (and wraps itself if
          long), so the badge stays top-right on every card. */}
      <div className="flex items-start justify-between gap-3">
        <h3 id={headingId} className="min-w-0 flex-1 text-base font-semibold text-heading">
          {branch.name}
        </h3>
        {/* Rendered only in the browser: it depends on the current time. */}
        {status && (
          <p
            className={`max-w-[50%] shrink-0 rounded-xl px-2.5 py-0.5 text-center text-xs font-medium ${
              status.isOpen ? "bg-brand/10 text-brand-dark" : "bg-muted text-body"
            }`}
          >
            {status.isOpen ? "Open" : "Closed"} · {status.detail}
          </p>
        )}
      </div>

      <address className="mt-2 flex gap-2 text-sm not-italic text-body">
        <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
        <span>
          {branch.address}
          <br />
          {branch.city}, {branch.province}, {branch.postalCode}
        </span>
      </address>
      {distanceKm !== undefined && (
        <p className="mt-1 pl-6 text-xs font-medium text-heading">{formatDistance(distanceKm)}</p>
      )}

      <details className="group mt-3 text-sm">
        <summary className="cursor-pointer font-medium text-heading">Opening hours</summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body">
          {(Object.keys(OPENING_HOURS_LABELS) as (keyof OpeningHours)[]).map((key) => (
            <div key={key} className="contents">
              <dt>{OPENING_HOURS_LABELS[key]}</dt>
              <dd className="text-heading">{branch.openingHours[key].replace(" - ", " – ")}</dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onShowOnMap(branch.id)}
          aria-pressed={isSelected}
          className="inline-flex items-center gap-1.5 rounded-sm border border-line-strong px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-surface"
        >
          <MapPin aria-hidden="true" className="size-4" />
          Show on map
        </button>
        <a
          href={directionsUrl(branch)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-sm bg-brand-solid px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover"
        >
          <Navigation aria-hidden="true" className="size-4" />
          Directions
          <ExternalLink aria-hidden="true" className="size-3.5" />
          <span className="sr-only">to {branch.name} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
