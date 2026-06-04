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
import { countdownTo, fmt, pad } from "@/lib/utils";
import type { Flight } from "@/lib/types";

const GROUP_LABEL: Record<string, string> = { bogota: "Grupo Bogotá", boston: "Grupo Boston", all: "Todos" };

/**
 * Estado y progreso del vuelo calculado en vivo a partir de los horarios
 * programados (estimación gratuita y confiable). Sin API de pago.
 */
function flightState(f: Flight, now: number | null) {
  const dep = +parseISO(f.departure);
  const arr = +parseISO(f.arrival);
  if (f.status === "cancelled") return { label: "Cancelado", variant: "danger" as const, progress: 0, eta: "Cancelado" };
  if (f.status === "delayed" && (!now || now < dep)) return { label: "Demorado", variant: "warning" as const, progress: 0, eta: "Demorado" };
  if (!now) return { label: "Programado", variant: "default" as const, progress: 0, eta: "" };
  if (now >= arr) return { label: "Aterrizó", variant: "success" as const, progress: 100, eta: "Aterrizó ✓" };
  if (now >= dep) {
    const p = Math.min(99, Math.max(1, Math.round(((now - dep) / (arr - dep)) * 100)));
    const mins = Math.round((arr - now) / 60000);
    return { label: `En vuelo · ${p}%`, variant: "cyan" as const, progress: p, eta: `Llega en ${Math.floor(mins / 60)}h ${pad(mins % 60)}m` };
  }
  if (now >= dep - 75 * 60 * 1000) return { label: "En sala · abordando", variant: "gold" as const, progress: 0, eta: "Abordaje pronto" };
  const c = countdownTo(f.departure, now);
  return { label: "Programado", variant: "default" as const, progress: 0, eta: `Sale en ${c.days > 0 ? c.days + "d " : ""}${pad(c.hours)}h ${pad(c.minutes)}m` };
}

export default function FlightsPage() {
  const { data: flights } = useCollection<Flight>("flights");
  const now = useNow(15_000); // el estado/progreso cambia lento
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
          {sorted.map((f, i) => {
            const st = flightState(f, now);
            return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="border-b border-white/5 px-5 py-4 transition hover:bg-white/[0.03]"
            >
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[auto_1fr_auto_auto_auto]">
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
                <div className="text-right"><Badge variant={st.variant}>{st.label}</Badge></div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-electric-500 to-cyan-400 transition-all duration-1000" style={{ width: `${st.progress}%` }} />
                </div>
                <span className="board-font shrink-0 text-[10px] text-muted-foreground">{st.eta}</span>
              </div>
            </motion.div>
            );
          })}
        </div>
      )}

      {view === "cards" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {sorted.map((f) => {
            const dur = differenceInMinutes(parseISO(f.arrival), parseISO(f.departure));
            const st = flightState(f, now);
            return (
              <div key={f.id} className="glass overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-dashed border-white/10 bg-white/[0.02] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Plane className="size-4 text-electric-400" />
                    <span className="board-font font-bold">{f.flightNumber}</span>
                    <span className="text-xs text-muted-foreground">{f.airline}</span>
                    {f.group && f.group !== "all" && <Badge variant="muted">{GROUP_LABEL[f.group]}</Badge>}
                  </div>
                  <Badge variant={st.variant}>{st.label}</Badge>
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
                    {/* Línea de progreso con avión que avanza según % */}
                    <div className="relative my-1.5 h-4 w-24">
                      <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-white/15" />
                      <div className="absolute top-1/2 h-px -translate-y-1/2 bg-cyan-400 transition-all duration-1000" style={{ width: `${st.progress}%` }} />
                      <Plane
                        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-90 text-cyan-300 transition-all duration-1000"
                        style={{ left: `${st.progress}%` }}
                      />
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
                {st.eta && (
                  <div className="border-t border-white/10 bg-gold-500/5 px-5 py-2 text-center text-xs text-gold-300">
                    <Clock className="mr-1 inline size-3" /> {st.eta}
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
