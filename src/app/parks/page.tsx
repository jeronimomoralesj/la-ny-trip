"use client";

import { useMemo, useState } from "react";
import {
  Check, Star, Trophy, FerrisWheel, Rocket, Clock, MapPin, Timer,
  UtensilsCrossed, ListChecks, Map as MapIcon,
} from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { Progress, SectionTitle } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PARKS_DATA, ATTRACTION_LABEL, type AttractionType } from "@/lib/parks-data";
import type { Ride, Park } from "@/lib/types";

const PARKS: { id: Park; label: string; icon: any }[] = [
  { id: "disneyland", label: "Disneyland", icon: FerrisWheel },
  { id: "six-flags", label: "Six Flags", icon: Rocket },
];

const TYPE_COLOR: Record<AttractionType, string> = {
  coaster: "#ef4444", dark: "#a78bfa", family: "#22d3ee",
  water: "#3b82f6", thrill: "#f97316", show: "#f5c451", transport: "#94a3b8",
};

function waitColor(min: number) {
  if (min >= 60) return "text-red-400";
  if (min >= 35) return "text-gold-400";
  return "text-emerald-400";
}

export default function ParksPage() {
  const { user } = useAuth();
  const { data: rides, add, update } = useCollection<Ride>("rides");
  const [park, setPark] = useState<Park>("disneyland");
  const [tab, setTab] = useState("rides");

  const info = PARKS_DATA[park];
  const rideById = useMemo(() => {
    const m = new Map<string, Ride>();
    rides.forEach((r) => m.set(r.id, r));
    return m;
  }, [rides]);

  const done = info.attractions.filter((a) => rideById.get(a.id)?.completed).length;
  const pct = info.attractions.length ? (done / info.attractions.length) * 100 : 0;

  // Agrupar por área
  const byLand = useMemo(() => {
    const groups: Record<string, typeof info.attractions> = {};
    info.attractions.forEach((a) => { (groups[a.land] ??= []).push(a); });
    return Object.entries(groups);
  }, [info]);

  const toggle = (attractionId: string, name: string) => {
    const existing = rideById.get(attractionId);
    const completedBy = new Set(existing?.completedBy ?? []);
    const willComplete = !existing?.completed;
    if (user) willComplete ? completedBy.add(user.id) : completedBy.delete(user.id);
    if (existing) {
      update.mutate({ id: attractionId, patch: { completed: willComplete, completedBy: Array.from(completedBy) } });
    } else {
      add.mutate({ id: attractionId, park, name, completed: true, completedBy: Array.from(completedBy) } as any);
    }
  };

  const rate = (attractionId: string, name: string, rating: number) => {
    const existing = rideById.get(attractionId);
    if (existing) update.mutate({ id: attractionId, patch: { rating } });
    else add.mutate({ id: attractionId, park, name, completed: false, rating, completedBy: [] } as any);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Escuadrón"
        title="Rastreador de Parques"
        action={<Tabs value={park} onChange={(v) => setPark(v as Park)} tabs={PARKS.map((p) => ({ id: p.id, label: p.label, icon: p.icon }))} />}
      />

      {/* Cabecera del parque */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-6" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${info.accent}22, transparent 55%)` }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">{info.name}</h2>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="size-3.5" /> {info.hours}</span>
              <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {info.address}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="board-font text-3xl font-bold" style={{ color: info.accent }}>
                {done}<span className="text-lg text-muted-foreground">/{info.attractions.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">atracciones completadas</div>
              {pct === 100 && <Trophy className="size-7 text-gold-400" />}
            </div>
          </div>
          <div className="board-font text-3xl font-bold" style={{ color: info.accent }}>{Math.round(pct)}%</div>
        </div>
        <Progress value={pct} className="mt-4 h-2.5" barClassName="bg-gradient-to-r from-pink-500 to-gold-400" />
      </div>

      <Tabs
        value={tab} onChange={setTab}
        tabs={[
          { id: "rides", label: "Atracciones", icon: ListChecks },
          { id: "food", label: "Comida", icon: UtensilsCrossed },
          { id: "map", label: "Mapa", icon: MapIcon },
        ]}
      />

      {/* ATRACCIONES */}
      {tab === "rides" && (
        <div className="space-y-6">
          {byLand.map(([land, attractions]) => (
            <div key={land}>
              {land !== "—" && (
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-electric-400">{land}</div>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                {attractions.map((a) => {
                  const ride = rideById.get(a.id);
                  const completed = ride?.completed ?? false;
                  return (
                    <div key={a.id} className={cn("glass rounded-xl p-3", completed && "ring-1 ring-gold-500/40")}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggle(a.id, a.name)}
                          className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border transition", completed ? "border-gold-500 bg-gold-500 text-navy-950" : "border-white/20 hover:border-white/40")}
                        >
                          {completed && <Check className="size-4" strokeWidth={3} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className={cn("text-sm font-medium leading-tight", completed && "text-gold-300")}>{a.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: `${TYPE_COLOR[a.type]}22`, color: TYPE_COLOR[a.type] }}>
                              {ATTRACTION_LABEL[a.type]}
                            </span>
                            <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", waitColor(a.avgWait))}>
                              <Timer className="size-3" /> ~{a.avgWait} min
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => rate(a.id, a.name, s)}>
                                <Star className={cn("size-3.5 transition", (ride?.rating ?? 0) >= s ? "fill-gold-400 text-gold-400" : "text-white/20 hover:text-white/40")} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground/60">
            Esperas promedio históricas (referencia). Las esperas reales varían según el día y la temporada.
          </p>
        </div>
      )}

      {/* COMIDA */}
      {tab === "food" && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {info.dining.map((d) => (
            <div key={d.name} className="glass flex items-center justify-between gap-3 rounded-xl p-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{d.name}</div>
                <div className="truncate text-xs text-muted-foreground">{d.type}</div>
              </div>
              <Badge variant="gold">{d.price}</Badge>
            </div>
          ))}
        </div>
      )}

      {/* MAPA */}
      {tab === "map" && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <iframe
            title="park-map"
            className="h-[60vh] w-full"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${info.lng - 0.012}%2C${info.lat - 0.009}%2C${info.lng + 0.012}%2C${info.lat + 0.009}&layer=mapnik&marker=${info.lat}%2C${info.lng}`}
          />
          <div className="flex items-center justify-between bg-navy-800/60 px-4 py-2 text-xs text-muted-foreground">
            <span>{info.address}</span>
            <a className="text-electric-400 hover:text-electric-300" target="_blank" rel="noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${info.lat},${info.lng}`}>
              Abrir en Google Maps →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
