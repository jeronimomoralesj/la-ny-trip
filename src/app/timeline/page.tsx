"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Clock, FileText, Navigation, Plane, Car, Trophy, Heart,
  Castle, Rocket, PartyPopper, Building2, Vote, Circle, Utensils, Sunset,
  Waves, Camera, ShoppingBag, Landmark, Ship, Bike, Coffee, Sparkles, type LucideIcon,
} from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useNow } from "@/hooks/use-now";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/misc";
import { PHASES } from "@/lib/seed-data";
import { parseISO } from "date-fns";
import { cn, fmt } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  Plane, Car, Trophy, Heart, Castle, Rocket, PartyPopper, Building2, Vote,
  Utensils, Sunset, Waves, Camera, ShoppingBag, Landmark, Ship, Bike, Coffee,
};

function DynIcon({ name, className }: { name?: string; className?: string }) {
  const Cmp = (name && ICONS[name]) || Circle;
  return <Cmp className={className} />;
}

export default function TimelinePage() {
  const { data: events } = useCollection<TimelineEvent>("timelineEvents");
  const now = useNow();
  const [selected, setSelected] = useState<TimelineEvent | null>(null);

  const grouped = useMemo(() => {
    const byDay: Record<string, TimelineEvent[]> = {};
    [...events]
      .sort((a, b) => +parseISO(a.start) - +parseISO(b.start))
      .forEach((e) => {
        (byDay[e.day] ??= []).push(e);
      });
    return Object.entries(byDay);
  }, [events]);

  const phaseAccent = (id: string) => PHASES.find((p) => p.id === id)?.accent ?? "#3b82f6";

  return (
    <div>
      <SectionTitle eyebrow="Cronograma de Operaciones" title="Itinerario del Viaje" />

      <div className="relative space-y-8">
        {/* vertical rail */}
        <div className="absolute bottom-0 left-[19px] top-2 w-px bg-gradient-to-b from-electric-500/60 via-white/15 to-transparent sm:left-[27px]" />

        {grouped.map(([day, dayEvents], di) => (
          <div key={day}>
            <div className="mb-3 flex items-center gap-3 pl-1">
              <div className="board-font grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-navy-800 text-center text-xs font-bold leading-tight sm:size-14">
                <div>
                  <div className="text-gold-400">{fmt(parseISO(day), "dd")}</div>
                  <div className="text-[9px] uppercase text-muted-foreground">{fmt(parseISO(day), "MMM")}</div>
                </div>
              </div>
              <div>
                <div className="font-semibold">{fmt(parseISO(day), "EEEE")}</div>
                <div className="text-xs text-muted-foreground">{dayEvents[0]?.city}</div>
              </div>
            </div>

            <div className="space-y-3 pl-1">
              {dayEvents.map((e, i) => {
                const isPast = now ? +parseISO(e.end ?? e.start) < now : false;
                const isLive = now ? +parseISO(e.start) <= now && +parseISO(e.end ?? e.start) >= now : false;
                const accent = phaseAccent(e.phase);
                return (
                  <motion.button
                    key={e.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (di * 0.04) + i * 0.04 }}
                    onClick={() => setSelected(e)}
                    className="group flex w-full items-stretch gap-4 text-left"
                  >
                    <div className="relative flex w-10 shrink-0 justify-center sm:w-14">
                      <span
                        className={cn(
                          "z-10 mt-1 grid size-9 place-items-center rounded-xl border transition",
                          isLive ? "animate-pulse-glow" : "",
                        )}
                        style={{
                          borderColor: `${accent}66`,
                          background: isPast ? "rgba(255,255,255,0.03)" : `${accent}1f`,
                        }}
                      >
                        <DynIcon name={e.icon} className="size-4" />
                      </span>
                    </div>

                    <div className={cn(
                      "glass glass-hover flex-1 rounded-2xl p-4",
                      isLive && "glow-blue",
                      isPast && "opacity-60",
                    )}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-semibold">{e.title}</h3>
                            {isLive && <Badge variant="success">En vivo</Badge>}
                            {e.suggested && <Badge variant="muted"><Sparkles className="size-3" /> Sugerencia</Badge>}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{e.description}</p>
                        </div>
                        <div className="board-font shrink-0 text-right text-xs text-muted-foreground">
                          <div className="flex items-center gap-1"><Clock className="size-3" />{fmt(parseISO(e.start), "h:mm a")}</div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        eyebrow={selected ? fmt(parseISO(selected.start), "EEEE d MMMM") : ""}
        title={selected?.title}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default"><MapPin className="size-3" /> {selected.city}</Badge>
              <Badge variant="muted"><Clock className="size-3" /> {fmt(parseISO(selected.start), "h:mm a")}{selected.end ? ` – ${fmt(parseISO(selected.end), "h:mm a")}` : ""}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.description}</p>

            {selected.notes && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-electric-400">
                  <FileText className="size-3.5" /> Notas
                </div>
                <p className="text-sm text-muted-foreground">{selected.notes}</p>
              </div>
            )}

            {selected.lat && selected.lng && (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <iframe
                  title="map"
                  className="h-48 w-full"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.02}%2C${selected.lat - 0.015}%2C${selected.lng + 0.02}%2C${selected.lat + 0.015}&marker=${selected.lat}%2C${selected.lng}`}
                />
              </div>
            )}

            {selected.lat && selected.lng && (
              <Button variant="glass" className="w-full"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`, "_blank")}>
                <Navigation className="size-4" /> Abrir en Maps
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
