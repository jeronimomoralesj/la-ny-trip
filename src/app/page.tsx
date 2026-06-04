"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Plane, MapPin, CloudSun, Megaphone, ArrowRight, Clock, Trophy, Calendar, Building2, Users,
} from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useWeather } from "@/hooks/use-weather";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { currentPhase, nextEvent, tripProgress, groupCurrentCity, nextCityArrival, eventsForGroup } from "@/lib/trip";
import { TRIP_START } from "@/lib/seed-data";
import { Countdown } from "@/components/widgets/countdown";
import { Progress, Stat } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { fmt } from "@/lib/utils";
import { isToday, parseISO } from "date-fns";
import type { TimelineEvent, Flight, Announcement, Expense, TravelGroup } from "@/lib/types";

// Charts/recharts are heavy — load the exchange widget on the client only.
const ExchangeWidget = dynamic(
  () => import("@/components/widgets/exchange-widget").then((m) => m.ExchangeWidget),
  { ssr: false, loading: () => <div className="glass h-64 rounded-2xl" /> },
);

export default function DashboardPage() {
  const now = useNow(60_000); // la página recalcula cada minuto; los contadores tienen su propio reloj
  const { user } = useAuth();
  const { data: weather } = useWeather();
  const { data: events } = useCollection<TimelineEvent>("timelineEvents");
  const { data: flights } = useCollection<Flight>("flights");
  const { data: announcements } = useCollection<Announcement>("announcements");
  const { data: expenses } = useCollection<Expense>("expenses");

  const [group, setGroup] = useState<Exclude<TravelGroup, "all">>(user?.group ?? "bogota");

  if (!now) return null;
  const phase = currentPhase(now);
  const next = nextEvent(now, events, group);
  const nextCity = nextCityArrival(now, flights, group);
  const progress = tripProgress(now);
  const currentCity = groupCurrentCity(now, events, group);
  const beforeStart = now < +new Date(TRIP_START);

  const todays = eventsForGroup(events, group)
    .filter((e) => isToday(parseISO(e.start)) || e.day === fmt(now, "yyyy-MM-dd"));

  const cityWeather =
    weather?.find((w) => w.city === currentCity) ??
    weather?.find((w) => currentCity.includes(w.city.split(" ")[0])) ??
    weather?.[0];

  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);
  const beforeLA = phase.id === "pre-departure" || phase.id === "traveling-to-la";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ── Selector de grupo (solo antes de LA) ─────────────── */}
      {beforeLA && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" /> Viendo el grupo:
          </span>
          {(["bogota", "boston"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${group === g ? "border-electric-500/50 bg-electric-500/15 text-white" : "border-white/10 text-muted-foreground"}`}
            >
              {g === "bogota" ? "🇨🇴 Bogotá → Panamá → LA" : "🇺🇸 Boston → LA"}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-white/10"
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(120% 120% at 0% 0%, ${phase.accent}33, transparent 50%), linear-gradient(135deg, #080b18, #0c1024)` }}
        />
        <div className="relative flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="gold">Fase actual</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {currentCity}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {greeting(now)}, <span className="text-gradient">{user?.name ?? "viajero"}</span>.
            </h1>
            <p className="mt-2 text-base font-medium sm:text-lg" style={{ color: phase.accent }}>{phase.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {next ? <>Próxima actividad: <span className="text-foreground">{next.title}</span></> : "Viaje completo — bienvenido a casa."}
            </p>

            {beforeStart ? (
              <div className="mt-5">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                  El viaje empieza en
                </div>
                <Countdown target={TRIP_START} />
              </div>
            ) : (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progreso del viaje</span><span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2.5" />
              </div>
            )}
          </div>

          <div className="grid shrink-0 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {next && (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-electric-400">
                  <Clock className="size-3.5" /> Próxima actividad
                </div>
                <Countdown target={next.start} compact />
                <div className="mt-1 truncate text-xs text-muted-foreground">{next.title}</div>
              </div>
            )}
            {nextCity && (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400">
                  <Building2 className="size-3.5" /> Próxima ciudad
                </div>
                <Countdown target={nextCity.at} compact />
                <div className="mt-1 truncate text-xs text-muted-foreground">{nextCity.city} ({nextCity.code})</div>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Ciudad actual" value={currentCity} accent="#5b9bff" />
        <Stat label="Días de viaje" value={Math.max(0, Math.ceil((progress / 100) * 13))} sub="de 13 en total" accent="#f5c451" />
        <Stat label="Gasto del grupo" value={`$${(totalSpend / 1000).toFixed(1)}k`} sub="entre todos" accent="#22d3ee" />
        <Stat label="Ciudades" value="4" sub="BOG · BOS · LA · NY" accent="#a78bfa" />
      </div>

      {/* ── Aviso: llegada escalonada a LA ───────────────────── */}
      {beforeLA && (
        <div className="flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-4 text-sm">
          <Plane className="mt-0.5 size-4 shrink-0 text-gold-400" />
          <p className="text-gold-100">
            <strong>Llegada a LA:</strong> Juan y Jeronimo aterrizan a las <strong>11:40 pm</strong>; Mateo y Valeria (desde Boston) a las <strong>11:55 pm</strong>. Esperarse en llegadas para salir todos juntos.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
        {/* ── ITINERARIO DE HOY ──────────────────────────────── */}
        <div className="lg:col-span-2">
          <Card className="h-full p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-electric-400" />
                <h2 className="font-semibold">Itinerario de hoy</h2>
              </div>
              <Link href="/timeline" className="flex items-center gap-1 text-sm text-electric-400 hover:text-electric-300">
                Ver todo <ArrowRight className="size-3.5" />
              </Link>
            </div>
            {todays.length ? (
              <div className="space-y-2">
                {todays.map((e) => (
                  <Link key={e.id} href="/timeline" className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/[0.05] sm:gap-4">
                    <div className="board-font w-14 shrink-0 text-sm font-semibold text-gold-400">{fmt(parseISO(e.start), "h:mm a")}</div>
                    <div className="hidden h-8 w-px bg-white/10 sm:block" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{e.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{e.description}</div>
                    </div>
                    <Badge variant="muted">{e.city}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <Calendar className="size-7 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Nada agendado hoy. A descansar. 🌴</p>
                {next && (
                  <Link href="/timeline" className="mt-1 text-sm text-electric-400">
                    Sigue: {next.title} — {fmt(parseISO(next.start), "EEE d")}
                  </Link>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* ── CLIMA (ciudad actual) ──────────────────────────── */}
        <div className="space-y-5 sm:space-y-6">
          {cityWeather && (
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CloudSun className="size-3.5" /> {cityWeather.city}
                  </div>
                  <div className="board-font mt-1 text-4xl font-bold">{cityWeather.temp}°</div>
                  <div className="text-sm text-muted-foreground">{cityWeather.condition}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Sensación {cityWeather.feelsLike}°</div>
                  <div>💧 {cityWeather.humidity}%</div>
                  <div>🌬 {cityWeather.wind} km/h</div>
                </div>
              </div>
              {cityWeather.recommendations[0] && (
                <div className="mt-3 rounded-lg bg-gold-500/10 px-3 py-2 text-xs text-gold-300">
                  💡 {cityWeather.recommendations[0]}
                </div>
              )}
              <Link href="/weather" className="mt-3 flex items-center gap-1 text-sm text-electric-400 hover:text-electric-300">
                Centro del clima <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          )}

          <ExchangeWidget />
        </div>
      </div>

      {/* ── ANUNCIOS ─────────────────────────────────────────── */}
      <Card className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone className="size-5 text-gold-400" />
          <h2 className="font-semibold">Anuncios del grupo</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {announcements.map((a) => (
            <div key={a.id} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
              <Badge variant={a.priority === "urgent" ? "danger" : a.priority === "important" ? "warning" : "muted"}>
                {a.priority === "urgent" ? "urgente" : a.priority === "important" ? "importante" : "info"}
              </Badge>
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-muted-foreground">{a.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Link href="/analytics">
        <Card className="group flex items-center justify-between p-5 transition hover:border-white/20">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-electric-500/15">
              <Trophy className="size-5 text-electric-400" />
            </div>
            <div>
              <div className="font-medium">Analíticas del viaje</div>
              <div className="text-xs text-muted-foreground">Estadísticas, gráficas y récords</div>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
        </Card>
      </Link>
    </div>
  );
}

function greeting(now: number) {
  const h = new Date(now).getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}
