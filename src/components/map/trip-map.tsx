"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export interface MapPin {
  id: string;
  lng: number;
  lat: number;
  title: string;
  subtitle?: string;
  color?: string;
}

/**
 * Keyless map — Leaflet + OpenStreetMap/CARTO tiles. No token required.
 * Leaflet touches `window`, so it's imported dynamically inside the effect.
 */
export function TripMap({
  pins, routes = [], onSelect, onPick, className, initialCenter = [-90, 25], initialZoom = 3, tiles = "dark",
}: {
  pins: MapPin[];
  routes?: [number, number][][];
  onSelect?: (id: string) => void;
  onPick?: (lng: number, lat: number) => void;
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  tiles?: "dark" | "satellite";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;
  const [ready, setReady] = useState(0);

  // Init once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(ref.current, { attributionControl: true, scrollWheelZoom: true })
        .setView([initialCenter[1], initialCenter[0]], initialZoom);
      mapRef.current = map;

      if (tiles === "satellite") {
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          attribution: "&copy; Esri, Maxar, Earthstar Geographics",
          maxZoom: 19,
        }).addTo(map);
      } else {
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);
      }

      // Static routes (dashed lines between cities)
      routes.forEach((coords) => {
        const latlngs = coords.map(([lng, lat]) => [lat, lng]) as [number, number][];
        L.polyline(latlngs, { color: "#3b82f6", weight: 2.5, dashArray: "6 7", opacity: 0.85 }).addTo(map);
      });

      map.on("click", (e: any) => onPickRef.current?.(e.latlng.lng, e.latlng.lat));

      layerRef.current = L.layerGroup().addTo(map);
      setReady((n) => n + 1);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render / refresh markers when pins change
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    const pts: [number, number][] = [];
    pins.forEach((p) => {
      const m = L.circleMarker([p.lat, p.lng], {
        radius: 8, color: "#0b1020", weight: 2, fillColor: p.color ?? "#3b82f6", fillOpacity: 1,
      }).addTo(layer);
      m.bindTooltip(
        `<strong>${p.title}</strong>${p.subtitle ? `<br/><span style="color:#94a3b8">${p.subtitle}</span>` : ""}`,
        { direction: "top", offset: [0, -6] },
      );
      m.on("click", () => onSelectRef.current?.(p.id));
      pts.push([p.lat, p.lng]);
    });
    if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40], maxZoom: 12 });
    else if (pts.length === 1) map.setView(pts[0], initialZoom);
  }, [pins, ready]);

  return <div ref={ref} className={className} style={{ background: "#0c1024" }} />;
}
