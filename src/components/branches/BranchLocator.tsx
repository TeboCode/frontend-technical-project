"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { distanceKm, matchesQuery } from "@/lib/branches/geo";
import type { Branch, Coordinates } from "@/lib/branches/types";
import { BranchCard } from "./BranchCard";
import { BranchFilters, type LocationStatus } from "./BranchFilters";

// Leaflet needs `window`, so the map only loads in the browser. The branch list
// is server-rendered and carries the same information.
const BranchMap = dynamic(() => import("./BranchMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-black/5" />,
});

type BranchLocatorProps = {
  branches: Branch[];
};

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

export function BranchLocator({ branches }: BranchLocatorProps) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const mapRef = useRef<HTMLDivElement>(null);
  const now = useNow();

  const provinces = useMemo(
    () => [...new Set(branches.map((branch) => branch.province))].sort(),
    [branches],
  );

  const results = useMemo(() => {
    const filtered = branches
      .filter((branch) => !province || branch.province === province)
      .filter((branch) => matchesQuery(branch, query))
      .map((branch) => ({
        branch,
        distance: userLocation ? distanceKm(userLocation, branch) : undefined,
      }));
    return userLocation
      ? filtered.toSorted((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
      : filtered;
  }, [branches, province, query, userLocation]);

  const visibleBranches = useMemo(() => results.map((result) => result.branch), [results]);
  const activeId = visibleBranches.some((branch) => branch.id === selectedId) ? selectedId : null;

  const locate = () => {
    if (locationStatus === "locating") return;
    if (!("geolocation" in navigator)) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationStatus("located");
      },
      (error) => setLocationStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  // From the list: bring the map into view if it has scrolled away (phones).
  const showOnMap = (id: string) => {
    setSelectedId(id);
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect && (rect.bottom < 80 || rect.top > window.innerHeight)) {
      mapRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }
  };

  // From the map: on desktop the map is sticky, so reveal the matching card.
  const selectFromMap = (id: string) => {
    setSelectedId(id);
    if (isDesktop()) {
      document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
    }
  };

  const clearFilters = () => {
    setQuery("");
    setProvince("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-6">
      <div className="lg:col-start-1 lg:row-start-1">
        <BranchFilters
          query={query}
          onQueryChange={setQuery}
          province={province}
          provinces={provinces}
          onProvinceChange={setProvince}
          locationStatus={locationStatus}
          onLocate={locate}
        />
      </div>

      <div
        ref={mapRef}
        className="h-72 scroll-mt-4 overflow-hidden rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] sm:h-96 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[calc(100vh-8rem)] lg:min-h-[28rem] lg:self-start"
      >
        <BranchMap
          branches={visibleBranches}
          selectedId={activeId}
          onSelect={selectFromMap}
          userLocation={userLocation}
        />
      </div>

      <section aria-labelledby="branch-results-heading" className="lg:col-start-1 lg:row-start-2">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 id="branch-results-heading" className="text-lg font-semibold text-heading">
            Branches
          </h2>
          <p role="status" className="text-sm text-body">
            {results.length === 1 ? "1 branch" : `${results.length} branches`}
            {userLocation && results.length > 1 ? ", nearest first" : ""}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-md bg-white p-6 text-center text-sm text-body shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <p>No branches match your search.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 font-medium text-brand-dark underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="space-y-4">
            {results.map(({ branch, distance }) => (
              <li key={branch.id}>
                <BranchCard
                  branch={branch}
                  distanceKm={distance}
                  now={now}
                  isSelected={branch.id === activeId}
                  onShowOnMap={showOnMap}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
