"use client";

import { useState } from "react";
import { Plane, Clock, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCollection } from "@/hooks/use-collection";
import { useNow } from "@/hooks/use-now";
import { TripMap, type MapPin as Pin } from "@/components/map/trip-map";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { SectionTitle } from "@/components/ui/misc";
import { parseISO, differenceInMinutes } from "date-fns";
import { countdownTo, fmt } from "@/lib/utils";
import type { Flight, FlightStatus } from "@/lib/types";

const STATUS: Record<FlightStatus, { label: string; variant: any }> = {
  scheduled: { label: "Programado", variant: "default" },
  boarding: { label: "Abordando", variant: "gold" },
  "in-air": { label: "En vuelo", variant: "cyan" },
  landed: { label: "Aterrizó", variant: "success" },
  delayed: { label: "Demorado", variant: "warning" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

const GROUP_LABEL: Record<string, string> = { bogota: "Grupo Bogotá", boston: "Grupo Boston", all: "Todos" };

export default function FlightsPage() {
  const { data: flights } = useCollection<Flight>("flights");
  const now = useNow();
  const [view, setView] = useState("board");

  const sorted = [...flights].sort((a, b) => +parseISO(a.departure) - +parseISO(b.departure));

  const pins: Pin[] = sorted.flatMap((f) => [
    { id: `${f.id}-from`, lng: f.from.lng, lat: f.from.lat, title: f.from.code, subtitle: f.from.city, color: "#3b82f6" },
    { id: `${f.id}-to`, lng: f.to.lng, lat: f.to.lat, title: f.to.code, subtitle: f.to.city, color: "#f5c451" },
  ]);
  const routes: [number, number][][] = sorted.map((f) => [[f.from.lng, f.from.lat], [f.to.lng, f.to.lat]]);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Operaciones"
        title="Centro de Vuelos"
        action={<Tabs value={view} onChange={setView} tabs={[{ id: "board", label: "Tablero" }, { id: "cards", label: "Tarjetas" }, { id: "map", label: "Mapa" }]} />}
      />

      {view === "board" && (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="ticker grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 bg-navy-800/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 sm:grid-cols-[auto_1fr_auto_auto_auto]">
            <span>Vuelo</span>
            <span className="hidden sm:block">Ruta</span>
            <span className="hidden sm:block">Sale</span>
            <span className="hidden sm:block">Puerta</span>
            <span className="text-right">Estado</span>
          </div>
          {sorted.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/5 px-5 py-4 transition hover:bg-white/[0.03] sm:grid-cols-[auto_1fr_auto_auto_auto]"
            >
              <div className="board-font">
                <div className="flex items-center gap-2"><span className="font-bold">{f.flightNumber}</span>{f.group && f.group !== "all" && <Badge variant="muted">{GROUP_LABEL[f.group]}</Badge>}</div>
                <div className="text-xs text-muted-foreground">{f.airline}</div>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="board-font font-semibold">{f.from.code}</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
                <span className="board-font font-semibold">{f.to.code}</span>
              </div>
              <div className="board-font hidden text-sm sm:block">{fmt(parseISO(f.departure), "MMM d · HH:mm")}</div>
              <div className="board-font hidden text-sm text-gold-400 sm:block">{f.gate ?? "—"}</div>
              <div className="text-right"><Badge variant={STATUS[f.status].variant}>{STATUS[f.status].label}</Badge></div>
            </motion.div>
          ))}
        </div>
      )}

      {view === "cards" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {sorted.map((f) => {
            const dur = differenceInMinutes(parseISO(f.arrival), parseISO(f.departure));
            const c = now ? countdownTo(f.departure, now) : null;
            return (
              <div key={f.id} className="glass overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-dashed border-white/10 bg-white/[0.02] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Plane className="size-4 text-electric-400" />
                    <span className="board-font font-bold">{f.flightNumber}</span>
                    <span className="text-xs text-muted-foreground">{f.airline}</span>
                    {f.group && f.group !== "all" && <Badge variant="muted">{GROUP_LABEL[f.group]}</Badge>}
                  </div>
                  <Badge variant={STATUS[f.status].variant}>{STATUS[f.status].label}</Badge>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-5">
                  <div>
                    <div className="board-font text-3xl font-bold">{f.from.code}</div>
                    <div className="text-xs text-muted-foreground">{f.from.city}</div>
                    <div className="board-font mt-1 text-sm">{fmt(parseISO(f.departure), "HH:mm")}</div>
                    <div className="text-[10px] text-muted-foreground">{fmt(parseISO(f.departure), "EEE d MMM")}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] text-muted-foreground">{Math.floor(dur / 60)}h {dur % 60}m</div>
                    <div className="relative my-1 flex w-20 items-center">
                      <div className="h-px flex-1 bg-electric-500/40" />
                      <Plane className="mx-1 size-4 rotate-90 text-electric-400" />
                      <div className="h-px flex-1 bg-electric-500/40" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="board-font text-3xl font-bold">{f.to.code}</div>
                    <div className="text-xs text-muted-foreground">{f.to.city}</div>
                    <div className="board-font mt-1 text-sm">{fmt(parseISO(f.arrival), "HH:mm")}</div>
                    <div className="text-[10px] text-muted-foreground">{fmt(parseISO(f.arrival), "EEE d MMM")}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 border-t border-white/10 px-5 py-3 text-center text-xs">
                  <div><div className="text-muted-foreground">Terminal</div><div className="board-font font-semibold">{f.terminal ?? "—"}</div></div>
                  <div><div className="text-muted-foreground">Puerta</div><div className="board-font font-semibold text-gold-400">{f.gate ?? "—"}</div></div>
                  <div><div className="text-muted-foreground">Silla</div><div className="board-font font-semibold">{f.seat ?? "—"}</div></div>
                  <div><div className="text-muted-foreground">Conf</div><div className="board-font font-semibold">{f.confirmation ?? "—"}</div></div>
                </div>
                {c && !c.done && (
                  <div className="border-t border-white/10 bg-gold-500/5 px-5 py-2 text-center text-xs text-gold-300">
                    <Clock className="mr-1 inline size-3" /> Sale en {c.days}d {c.hours}h {c.minutes}m
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "map" && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <TripMap pins={pins} routes={routes} className="h-[60vh] w-full" />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[["BOG", "El Dorado Intl", "Bogotá, Colombia"], ["PTY", "Tocumen Intl", "Ciudad de Panamá"], ["BOS", "Logan Intl", "Boston, EE.UU."], ["LAX", "Los Ángeles Intl", "California, EE.UU."], ["JFK", "John F. Kennedy Intl", "Nueva York, EE.UU."]].map(([code, name, loc]) => (
          <div key={code} className="glass flex items-center gap-3 rounded-2xl p-4">
            <div className="board-font grid size-12 place-items-center rounded-xl bg-electric-500/15 text-lg font-bold text-electric-400">{code}</div>
            <div>
              <div className="text-sm font-medium">{name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {loc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
