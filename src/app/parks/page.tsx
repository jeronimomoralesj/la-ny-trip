"use client";

import { useMemo, useState } from "react";
import {
  Check, Star, Trophy, FerrisWheel, Rocket, Clock, MapPin, Timer, Sparkles,
  UtensilsCrossed, ListChecks, Map as MapIcon, Route, Radio, ExternalLink, Navigation, ChevronDown, Hourglass,
} from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useParkWaits } from "@/hooks/use-park-waits";
import { useAuth } from "@/lib/auth-context";
import { TripMap } from "@/components/map/trip-map";
import { Progress, SectionTitle } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PARKS_DATA, ATTRACTION_LABEL, rideKey, yelpSearchUrl, type AttractionType } from "@/lib/parks-data";
import type { Ride, Park } from "@/lib/types";

const PARKS: { id: Park; label: string; icon: any }[] = [
  { id: "disneyland", label: "Disneyland", icon: FerrisWheel },
  { id: "disney-california-adventure", label: "California Adv.", icon: Sparkles },
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

interface DisplayRide { key: string; name: string; land: string; wait: number; isOpen: boolean; type: AttractionType; live: boolean }

export default function ParksPage() {
  const { user } = useAuth();
  const { data: rides, add, update } = useCollection<Ride>("rides");
  const [park, setPark] = useState<Park>("disneyland");
  const [tab, setTab] = useState("rides");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const info = PARKS_DATA[park];
  const { data: liveData, isLoading: liveLoading } = useParkWaits(park);

  const ridesMap = useMemo(() => {
    const m = new Map<string, Ride>();
    rides.forEach((r) => m.set(r.id, r));
    return m;
  }, [rides]);

  // Tipo de atracción por nombre (desde el catálogo) para enriquecer los datos en vivo
  const typeByName = useMemo(() => {
    const m = new Map<string, AttractionType>();
    info.attractions.forEach((a) => m.set(a.name.toLowerCase(), a.type));
    return m;
  }, [info]);

  // Lista a mostrar: datos en vivo si están disponibles (completos y reales), si no el catálogo.
  const display: DisplayRide[] = useMemo(() => {
    const live = liveData?.rides ?? [];
    if (live.length) {
      return live.map((r) => ({
        key: rideKey(park, r.name),
        name: r.name,
        land: r.land || "Atracciones",
        wait: r.wait ?? 0,
        isOpen: r.isOpen,
        type: typeByName.get(r.name.toLowerCase()) ?? (park === "six-flags" ? "coaster" : "family"),
        live: true,
      }));
    }
    return info.attractions.map((a) => ({
      key: rideKey(park, a.name), name: a.name, land: a.land, wait: a.avgWait, isOpen: true, type: a.type, live: false,
    }));
  }, [liveData, info, park, typeByName]);

  const isLive = Boolean(liveData?.source && (liveData?.rides?.length ?? 0) > 0);
  const done = display.filter((d) => ridesMap.get(d.key)?.completed).length;
  const pct = display.length ? (done / display.length) * 100 : 0;

  const byLand = useMemo(() => {
    const groups: Record<string, DisplayRide[]> = {};
    display.forEach((d) => { (groups[d.land] ??= []).push(d); });
    return Object.entries(groups);
  }, [display]);

  const toggle = (d: DisplayRide) => {
    const existing = ridesMap.get(d.key);
    const completedBy = new Set(existing?.completedBy ?? []);
    const willComplete = !existing?.completed;
    if (user) willComplete ? completedBy.add(user.id) : completedBy.delete(user.id);
    if (existing) update.mutate({ id: d.key, patch: { completed: willComplete, completedBy: Array.from(completedBy) } });
    else add.mutate({ id: d.key, park, name: d.name, completed: true, completedBy: Array.from(completedBy) } as any);
  };

  const rate = (d: DisplayRide, rating: number) => {
    const existing = ridesMap.get(d.key);
    if (existing) update.mutate({ id: d.key, patch: { rating } });
    else add.mutate({ id: d.key, park, name: d.name, completed: false, rating, completedBy: [] } as any);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Escuadrón"
        title="Rastreador de Parques"
        action={<Tabs value={park} onChange={(v) => setPark(v as Park)} tabs={PARKS.map((p) => ({ id: p.id, label: p.label, icon: p.icon }))} />}
      />

      {/* Aviso de park hopping */}
      <div className="flex items-start gap-3 rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4 text-sm">
        <Route className="mt-0.5 size-4 shrink-0 text-pink-400" />
        <p className="text-pink-100">
          <strong>Park hop (16 jun):</strong> empezamos en <strong>Disneyland Park</strong> con la apertura (rope drop) y a la 1:30 pm cruzamos a <strong>Disney California Adventure</strong> (están uno frente al otro). <strong>Six Flags es otro día (14 jun)</strong>. Mira la pestaña <strong>Ruta</strong> en cada parque para el orden más eficiente.
        </p>
      </div>

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
                {done}<span className="text-lg text-muted-foreground">/{display.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">atracciones completadas</div>
              {pct === 100 && display.length > 0 && <Trophy className="size-7 text-gold-400" />}
            </div>
          </div>
          <div className="text-right">
            <div className="board-font text-3xl font-bold" style={{ color: info.accent }}>{Math.round(pct)}%</div>
            {isLive ? (
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <Radio className="size-3" /> Esperas en vivo
              </span>
            ) : (
              <span className="mt-1 block text-[11px] text-muted-foreground">{liveLoading ? "Cargando esperas…" : "Promedio histórico"}</span>
            )}
          </div>
        </div>
        <Progress value={pct} className="mt-4 h-2.5" barClassName="bg-gradient-to-r from-pink-500 to-gold-400" />
      </div>

      <Tabs
        value={tab} onChange={setTab}
        tabs={[
          { id: "rides", label: "Atracciones", icon: ListChecks },
          { id: "route", label: "Ruta", icon: Route },
          { id: "food", label: "Comida", icon: UtensilsCrossed },
          { id: "map", label: "Mapa", icon: MapIcon },
        ]}
      />

      {/* ATRACCIONES */}
      {tab === "rides" && (
        <div className="space-y-6">
          {byLand.map(([land, list]) => (
            <div key={land}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-electric-400">{land}</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {list.map((d) => {
                  const ride = ridesMap.get(d.key);
                  const completed = ride?.completed ?? false;
                  return (
                    <div key={d.key} className={cn("glass rounded-xl p-3", completed && "ring-1 ring-gold-500/40")}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggle(d)}
                          className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border transition", completed ? "border-gold-500 bg-gold-500 text-navy-950" : "border-white/20 hover:border-white/40")}
                        >
                          {completed && <Check className="size-4" strokeWidth={3} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className={cn("text-sm font-medium leading-tight", completed && "text-gold-300")}>{d.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: `${TYPE_COLOR[d.type]}22`, color: TYPE_COLOR[d.type] }}>
                              {ATTRACTION_LABEL[d.type]}
                            </span>
                            {!d.isOpen ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400"><Timer className="size-3" /> Cerrado</span>
                            ) : (
                              <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", waitColor(d.wait))}>
                                <Timer className="size-3" /> {d.live ? `${d.wait} min` : `~${d.wait} min`}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => rate(d, s)}>
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
            {isLive ? "Esperas en vivo vía queue-times.com · se actualizan cada par de minutos." : "Esperas promedio (referencia). Conéctate para ver las esperas en vivo cuando el parque esté abierto."}
          </p>
        </div>
      )}

      {/* RUTA SUGERIDA */}
      {tab === "route" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Orden sugerido para aprovechar al máximo el tiempo (estrategia rope-drop / esperas bajas).</p>
          <div className="relative space-y-2 pl-4">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-pink-500/60 to-transparent" />
            {info.suggestedRoute.map((s, i) => (
              <div key={i} className="relative flex gap-4">
                <div className="absolute -left-4 top-1.5 size-3.5 rounded-full border-2 border-pink-400 bg-navy-900" />
                <div className="board-font w-14 shrink-0 pt-0.5 text-sm font-semibold text-gold-400">{s.time}</div>
                <div className="glass flex-1 rounded-xl p-3">
                  <div className="text-sm font-medium">{s.title}</div>
                  {s.note && <div className="mt-0.5 text-xs text-muted-foreground">{s.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMIDA + MENÚS */}
      {tab === "food" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {info.dining.map((d) => {
            const expanded = openMenu === d.name;
            return (
              <div key={d.name} className="glass rounded-xl p-4">
                <button className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setOpenMenu(expanded ? null : d.name)}>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{d.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{d.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="gold">{d.price}</Badge>
                    {d.menu && <ChevronDown className={cn("size-4 text-muted-foreground transition", expanded && "rotate-180")} />}
                  </div>
                </button>
                {expanded && d.menu && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <ul className="space-y-1.5 text-sm">
                      {d.menu.map((m) => {
                        const [item, price] = m.split(" — ");
                        return (
                          <li key={m} className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">{item}</span>
                            <span className="board-font shrink-0 text-gold-400">{price}</span>
                          </li>
                        );
                      })}
                    </ul>
                    <a
                      href={yelpSearchUrl(d.name, info.city)} target="_blank" rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#d32323]/15 px-2.5 py-1.5 text-xs font-medium text-[#ff6b6b] transition hover:bg-[#d32323]/25"
                    >
                      <ExternalLink className="size-3.5" /> Ver fotos, menú y reseñas en Yelp
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MAPA */}
      {tab === "map" && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <TripMap
              pins={[{ id: info.id, lng: info.lng, lat: info.lat, title: info.name, subtitle: info.city, color: info.accent }]}
              initialCenter={[info.lng, info.lat]}
              initialZoom={15}
              className="h-[52vh] w-full"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="gold" onClick={() => window.open(info.officialMapUrl, "_blank")}>
              <ExternalLink className="size-4" /> Mapa oficial
            </Button>
            <Button variant="glass" onClick={() => window.open(info.realtimeQueueUrl, "_blank")}>
              <Hourglass className="size-4" /> Filas en tiempo real
            </Button>
            <Button variant="glass" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${info.lat},${info.lng}`, "_blank")}>
              <Navigation className="size-4" /> Cómo llegar
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground/60">
            El <strong>mapa oficial</strong> muestra todas las atracciones con etiquetas, baños, tiendas y restaurantes. <strong>Filas en tiempo real</strong> abre las esperas en vivo de cada atracción.
          </p>
        </div>
      )}
    </div>
  );
}
