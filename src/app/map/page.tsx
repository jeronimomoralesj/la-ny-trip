"use client";

import { useMemo, useState } from "react";
import {
  Plane, FerrisWheel, PartyPopper, UtensilsCrossed, Heart, Hotel,
  ParkingSquare, Trophy, Landmark, MapPin, Navigation,
} from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { TripMap, type MapPin as Pin } from "@/components/map/trip-map";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LocationCategory, TripLocation } from "@/lib/types";

const CAT: Record<LocationCategory, { label: string; color: string; icon: any }> = {
  airport: { label: "Airports", color: "#3b82f6", icon: Plane },
  "theme-park": { label: "Theme Parks", color: "#ec4899", icon: FerrisWheel },
  "fan-fest": { label: "Fan Fests", color: "#f5c451", icon: PartyPopper },
  restaurant: { label: "Restaurants", color: "#f97316", icon: UtensilsCrossed },
  family: { label: "Family", color: "#ef4444", icon: Heart },
  hotel: { label: "Hotels", color: "#22d3ee", icon: Hotel },
  parking: { label: "Parking", color: "#94a3b8", icon: ParkingSquare },
  stadium: { label: "Stadiums", color: "#22c55e", icon: Trophy },
  landmark: { label: "Landmarks", color: "#a78bfa", icon: Landmark },
};

// BOG → LAX → JFK → BOG
const ROUTES: [number, number][][] = [
  [[-74.1469, 4.7016], [-118.4085, 33.9416]],
  [[-118.4085, 33.9416], [-73.7781, 40.6413]],
  [[-73.7781, 40.6413], [-74.1469, 4.7016]],
];

export default function MapPage() {
  const { data: locations } = useCollection<TripLocation>("locations");
  const [active, setActive] = useState<Set<LocationCategory>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active.size ? locations.filter((l) => active.has(l.category)) : locations),
    [locations, active],
  );

  const pins: Pin[] = filtered.map((l) => ({
    id: l.id, lng: l.lng, lat: l.lat, title: l.name, subtitle: l.city, color: CAT[l.category].color,
  }));

  const selected = locations.find((l) => l.id === selectedId) ?? null;

  const toggle = (c: LocationCategory) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-electric-400/80">Command Map</div>
          <h1 className="text-2xl font-semibold tracking-tight">Route & Locations</h1>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CAT) as LocationCategory[]).map((c) => {
            const meta = CAT[c];
            const on = active.has(c);
            const Icon = meta.icon;
            return (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                  on || !active.size ? "text-white" : "text-muted-foreground opacity-50",
                )}
                style={{ borderColor: `${meta.color}55`, background: on ? `${meta.color}22` : "transparent" }}
              >
                <Icon className="size-3.5" style={{ color: meta.color }} /> {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <TripMap pins={pins} routes={ROUTES} onSelect={setSelectedId} className="h-[60vh] w-full" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => {
          const meta = CAT[l.category];
          const Icon = meta.icon;
          return (
            <button
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className="glass glass-hover flex items-center gap-3 rounded-xl p-3 text-left"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ background: `${meta.color}22` }}>
                <Icon className="size-4" style={{ color: meta.color }} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{l.name}</div>
                <div className="truncate text-xs text-muted-foreground">{l.city}</div>
              </div>
            </button>
          );
        })}
      </div>

      <Drawer open={!!selected} onClose={() => setSelectedId(null)} eyebrow={selected ? CAT[selected.category].label : ""} title={selected?.name}>
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default"><MapPin className="size-3" /> {selected.city}</Badge>
              <Badge variant="muted">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="loc-map"
                className="h-56 w-full"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.02}%2C${selected.lat - 0.015}%2C${selected.lng + 0.02}%2C${selected.lat + 0.015}&marker=${selected.lat}%2C${selected.lng}`}
              />
            </div>
            <Button variant="glass" className="w-full"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`, "_blank")}>
              <Navigation className="size-4" /> Directions
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
