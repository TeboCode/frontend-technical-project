"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useEffectEvent, useRef } from "react";
import { BRANCH_ZOOM, defaultMapView, mapTiles } from "@/config/map";
import { directionsUrl } from "@/lib/branches/geo";
import type { Branch, Coordinates } from "@/lib/branches/types";

type BranchMapProps = {
  branches: Branch[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userLocation: Coordinates | null;
};

const PIN_COLOR = "#43a047";
const PIN_COLOR_SELECTED = "#1b5e20";

/** SVG pin as a div icon — avoids Leaflet's default image icons, which break under bundlers. */
function pinIcon(selected: boolean) {
  const [width, height] = selected ? [36, 50] : [28, 40];
  const fill = selected ? PIN_COLOR_SELECTED : PIN_COLOR;
  return L.divIcon({
    className: "",
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 4],
    html: `<svg width="${width}" height="${height}" viewBox="0 0 28 40" aria-hidden="true" style="filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.3))">
      <path d="M14 0C6.3 0 0 6.2 0 13.9 0 24.3 14 40 14 40s14-15.7 14-26.1C28 6.2 21.7 0 14 0z" fill="${fill}"/>
      <circle cx="14" cy="14" r="5.5" fill="#fff"/>
    </svg>`,
  });
}

/** Popup built with DOM text nodes so branch data can never inject markup. */
function popupContent(branch: Branch) {
  const root = document.createElement("div");
  root.className = "text-sm";

  const name = document.createElement("p");
  name.className = "font-semibold text-heading";
  name.textContent = branch.name;

  const address = document.createElement("p");
  address.className = "text-body";
  address.textContent = `${branch.address}, ${branch.city}`;

  const link = document.createElement("a");
  link.href = directionsUrl(branch);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "mt-1 inline-block font-medium text-brand-dark underline";
  link.textContent = "Get directions";

  root.append(name, address, link);
  return root;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BranchMap({ branches, selectedId, onSelect, userLocation }: BranchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const previousSelectedRef = useRef<string | null>(null);
  const handleSelect = useEffectEvent(onSelect);

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: defaultMapView.center,
      zoom: defaultMapView.zoom,
      // Only zoom with the scroll wheel once the map has focus, so scrolling
      // the page past the map doesn't hijack it.
      scrollWheelZoom: false,
    });
    L.tileLayer(mapTiles.url, { attribution: mapTiles.attribution, maxZoom: mapTiles.maxZoom }).addTo(map);
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Rebuild markers and fit the view whenever the visible branches change.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersRef.current.clear();

    for (const branch of branches) {
      const marker = L.marker([branch.latitude, branch.longitude], {
        icon: pinIcon(false),
        title: branch.name,
        alt: branch.name,
        riseOnHover: true,
      })
        .bindPopup(popupContent(branch))
        .on("click", () => handleSelect(branch.id))
        .addTo(layer);
      markersRef.current.set(branch.id, marker);
    }

    if (userLocation) {
      L.circleMarker([userLocation.latitude, userLocation.longitude], {
        radius: 8,
        color: "#fff",
        weight: 3,
        fillColor: "#1a73e8",
        fillOpacity: 1,
      })
        .bindTooltip("You are here")
        .addTo(layer);
    }

    const points: L.LatLngTuple[] = branches.map((b) => [b.latitude, b.longitude]);
    if (userLocation) points.push([userLocation.latitude, userLocation.longitude]);

    if (points.length === 0) {
      map.setView(defaultMapView.center, defaultMapView.zoom);
    } else if (points.length === 1) {
      map.setView(points[0], BRANCH_ZOOM);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 13 });
    }
    // Rebuilt markers start unselected; the selection effect below restyles
    // them without moving the map again.
  }, [branches, userLocation]);

  // Highlight the selected branch, and move to it when the selection changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const [id, marker] of markersRef.current) {
      const selected = id === selectedId;
      marker.setIcon(pinIcon(selected));
      marker.setZIndexOffset(selected ? 1000 : 0);
    }

    const marker = selectedId ? markersRef.current.get(selectedId) : undefined;
    if (marker && selectedId !== previousSelectedRef.current) {
      const target = marker.getLatLng();
      if (prefersReducedMotion()) map.setView(target, BRANCH_ZOOM);
      else map.flyTo(target, BRANCH_ZOOM, { duration: 0.6 });
      marker.openPopup();
    }
    previousSelectedRef.current = selectedId;
  }, [selectedId, branches, userLocation]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Map of branch locations"
      // `isolate` keeps Leaflet's high z-indexes from covering the header menu.
      className="isolate h-full w-full"
    />
  );
}
