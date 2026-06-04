"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapPin {
  id: string;
  lng: number;
  lat: number;
  title: string;
  subtitle?: string;
  color?: string;
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function TripMap({
  pins, routes = [], onSelect, className, initialCenter = [-100, 30], initialZoom = 2.4,
}: {
  pins: MapPin[];
  routes?: [number, number][][];
  onSelect?: (id: string) => void;
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!TOKEN || !ref.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      routes.forEach((coords, i) => {
        map.addSource(`route-${i}`, {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } },
        });
        map.addLayer({
          id: `route-${i}`,
          type: "line",
          source: `route-${i}`,
          paint: { "line-color": "#3b82f6", "line-width": 2.5, "line-dasharray": [2, 1.5], "line-opacity": 0.8 },
        });
      });
    });

    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers: mapboxgl.Marker[] = [];
    pins.forEach((p) => {
      const el = document.createElement("div");
      el.style.cssText = "cursor:pointer;width:18px;height:18px;border-radius:9999px;border:2px solid white;box-shadow:0 0 0 4px rgba(0,0,0,.3),0 0 14px var(--c);";
      el.style.background = p.color ?? "#3b82f6";
      el.style.setProperty("--c", (p.color ?? "#3b82f6") + "cc");
      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
        `<div style="font-family:system-ui;padding:2px 4px"><div style="font-weight:600;color:#0c1024">${p.title}</div>${p.subtitle ? `<div style="font-size:12px;color:#475569">${p.subtitle}</div>` : ""}</div>`,
      );
      const m = new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map);
      el.addEventListener("mouseenter", () => m.togglePopup());
      el.addEventListener("mouseleave", () => m.togglePopup());
      el.addEventListener("click", () => onSelect?.(p.id));
      markers.push(m);
    });
    return () => markers.forEach((m) => m.remove());
  }, [pins, onSelect]);

  if (!TOKEN) {
    return (
      <div className={className}>
        <div className="grid h-full place-items-center rounded-2xl border border-dashed border-white/15 bg-navy-800/40 p-8 text-center">
          <div>
            <p className="font-medium">Mapbox token not set</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Add <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code> to
              <code className="rounded bg-white/10 px-1">.env.local</code> to light up the command-center map. Pins are listed below in the meantime.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={ref} className={className} />;
}
