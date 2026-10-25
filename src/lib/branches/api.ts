// Data access for the branch locator. Currently reads mock GeoJSON; to connect
// the real API, replace the body of `getBranchFeatures` with a fetch.

import { cacheLife } from "next/cache";
import mockBranches from "./mock-branches.json";
import type { Branch, BranchFeature, BranchFeatureCollection } from "./types";

/** Branch locations as GeoJSON. */
export async function getBranchFeatures(): Promise<BranchFeatureCollection> {
  "use cache";
  cacheLife("days");
  // JSON imports widen tuples to number[], so the shape is asserted here.
  return mockBranches as BranchFeatureCollection;
}

export async function getBranches(): Promise<Branch[]> {
  const { features } = await getBranchFeatures();
  return features.map(toBranch);
}

function toBranch({ properties, geometry }: BranchFeature): Branch {
  const [longitude, latitude] = geometry.coordinates;
  return { ...properties, latitude, longitude };
}
