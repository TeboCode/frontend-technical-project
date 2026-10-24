import type { Branch, Coordinates } from "./types";

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Straight-line (great-circle) distance in kilometres. */
export function distanceKm(from: Coordinates, to: Coordinates) {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  const value = new Intl.NumberFormat("en-ZA", { maximumFractionDigits: km < 10 ? 1 : 0 }).format(km);
  return `${value} km away`;
}

/** Opens turn-by-turn directions in Google Maps (app on phones, web elsewhere). */
export function directionsUrl({ latitude, longitude }: Coordinates) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export function matchesQuery(branch: Branch, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [branch.name, branch.address, branch.city, branch.province, branch.postalCode].some(
    (field) => field.toLowerCase().includes(needle),
  );
}
