// Map tile provider. OpenStreetMap's public tiles are fine for development and
// light use but are not meant for production traffic
// (https://operations.osmfoundation.org/policies/tiles/). Before launch, point
// this at a hosted provider (MapTiler, Stadia, Carto…) and keep its attribution.
export const mapTiles = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
} as const;

/** Initial view: the whole of South Africa. */
export const defaultMapView = {
  center: [-28.8, 25.5] as [number, number],
  zoom: 5,
};

/** Zoom used when focusing on a single branch. */
export const BRANCH_ZOOM = 15;
