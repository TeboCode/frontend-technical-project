// Shapes for the branch locator. The API returns GeoJSON; the UI works with
// the flattened `Branch`.

export type OpeningHours = {
  mondayToFriday: string;
  saturday: string;
  sunday: string;
  publicHolidays: string;
};

export type BranchProperties = {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  openingHours: OpeningHours;
};

/** GeoJSON point: coordinates are [longitude, latitude]. */
export type BranchFeature = {
  type: "Feature";
  properties: BranchProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
};

export type BranchFeatureCollection = {
  type: "FeatureCollection";
  features: BranchFeature[];
};

export type Branch = BranchProperties & {
  latitude: number;
  longitude: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
