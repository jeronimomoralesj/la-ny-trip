"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plane, MapPin, CloudSun, Megaphone, ArrowRight, Clock, Wallet, Trophy, Calendar,
} from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useWeather } from "@/hooks/use-weather";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { currentPhase, nextEvent, tripProgress } from "@/lib/trip";
import { Countdown } from "@/components/widgets/countdown";
import { ExchangeWidget } from "@/components/widgets/exchange-widget";
import { Progress, Stat } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format, isToday, parseISO } from "date-fns";
import type { TimelineEvent, Flight, Announcement, Expense } from "@/lib/types";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
});

export default function DashboardPage() {
  const now = useNow();
  const { user } = useAuth();
  const { data: weather } = useWeather();
  const { data: events } = useCollection<TimelineEvent>("timelineEvents");
  const { data: flights } = useCollection<Flight>("flights");
  const { data: announcements } = useCollection<Announcement>("announcements");
  const { data: expenses } = useCollection<Expense>("expenses");

  if (!now) return null;
  const phase = currentPhase(now);
  const next = nextEvent(now, events);
  const progress = tripProgress(now);

  const todays = events
    .filter((e) => isToday(parseISO(e.start)) || e.day === format(now, "yyyy-MM-dd"))
    .sort((a, b) => +parseISO(a.start) - +parseISO(b.start));

  const upcomingFlight = [...flights]
    .filter((f) => +parseISO(f.departure) > now)
    .sort((a, b) => +parseISO(a.departure) - +parseISO(b.departure))[0];

  const cityWeather = weather?.find((w) => phase.city.includes(w.city.split(" ")[0])) ?? weather?.[0];
  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <motion.section {...fade(0)} className="relative overflow-hidden rounded-3xl border border-white/10">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: `radial-gradient(120% 120% at 0% 0%, ${phase.accent}33, transparent 50%), linear-gradient(135deg, #080b18, #0c1024)` }}
        />
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full blur-[100px]" style={{ background: `${phase.accent}40` }} />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="gold">Current Phase</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {phase.city}
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {greeting(now)}, <span className="text-gradient">{user?.name}</span>.
            </h1>
            <p className="mt-2 text-lg font-medium" style={{ color: phase.accent }}>{phase.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {next ? <>Next up: <span className="text-foreground">{next.title}</span> · {format(parseISO(next.start), "EEE d MMM, h:mm a")}</> : "Trip complete — welcome home."}
            </p>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Trip progress</span><span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2.5" />
            </div>
          </div>

          {next && (
            <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-electric-400">
                <Clock className="size-3.5" /> Countdown to next event
              </div>
              <Countdown target={next.start} />
            </div>
          )}
        </div>
      </motion.section>

      {/* ── QUICK STATS ──────────────────────────────────────── */}
      <motion.div {...fade(1)} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Current City" value={phase.city} accent="#5b9bff" />
        <Stat label="Days on Trip" value={Math.max(0, Math.ceil(progress / 100 * 13))} sub="of 13 total" accent="#f5c451" />
        <Stat label="Group Spend" value={`$${(totalSpend / 1000).toFixed(1)}k`} sub="across the squad" accent="#22d3ee" />
        <Stat label="Cities" value="3" sub="Bogotá · LA · NY" accent="#a78bfa" />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── TODAY'S ITINERARY ──────────────────────────────── */}
        <motion.div {...fade(2)} className="lg:col-span-2">
          <Card className="h-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-electric-400" />
                <h2 className="font-semibold">Today&apos;s Itinerary</h2>
              </div>
              <Link href="/timeline" className="flex items-center gap-1 text-sm text-electric-400 hover:text-electric-300">
                Full timeline <ArrowRight className="size-3.5" />
              </Link>
            </div>
            {todays.length ? (
              <div className="space-y-2">
                {todays.map((e) => (
                  <Link key={e.id} href="/timeline" className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/15 hover:bg-white/[0.05]">
                    <div className="board-font w-14 shrink-0 text-sm font-semibold text-gold-400">{format(parseISO(e.start), "h:mm a")}</div>
                    <div className="h-8 w-px bg-white/10" />
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
                <p className="text-sm text-muted-foreground">Nothing scheduled today. Rest up. 🌴</p>
                {next && (
                  <Link href="/timeline" className="mt-1 text-sm text-electric-400">
                    Next: {next.title} on {format(parseISO(next.start), "EEE d")}
                  </Link>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* ── WEATHER + FLIGHT ───────────────────────────────── */}
        <motion.div {...fade(3)} className="space-y-6">
          {cityWeather && (
            <Card className="overflow-hidden p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CloudSun className="size-3.5" /> {cityWeather.city}
                  </div>
                  <div className="board-font mt-1 text-4xl font-bold">{cityWeather.temp}°</div>
                  <div className="text-sm text-muted-foreground">{cityWeather.condition}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Feels {cityWeather.feelsLike}°</div>
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
                Weather center <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          )}

          {upcomingFlight && (
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-electric-400">
                <Plane className="size-3.5" /> Upcoming flight
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="board-font text-2xl font-bold">{upcomingFlight.from.code}</div>
                  <div className="text-[11px] text-muted-foreground">{format(parseISO(upcomingFlight.departure), "h:mm a")}</div>
                </div>
                <div className="flex-1 px-2">
                  <div className="relative flex items-center">
                    <div className="h-px flex-1 bg-gradient-to-r from-electric-500/30 to-electric-500" />
                    <Plane className="mx-1 size-4 rotate-90 text-electric-400" />
                    <div className="h-px flex-1 bg-gradient-to-r from-electric-500 to-electric-500/30" />
                  </div>
                  <div className="mt-1 text-center text-[10px] text-muted-foreground">{upcomingFlight.flightNumber}</div>
                </div>
                <div className="text-center">
                  <div className="board-font text-2xl font-bold">{upcomingFlight.to.code}</div>
                  <div className="text-[11px] text-muted-foreground">{format(parseISO(upcomingFlight.arrival), "h:mm a")}</div>
                </div>
              </div>
              <Link href="/flights" className="mt-3 flex items-center gap-1 text-sm text-electric-400 hover:text-electric-300">
                Flight ops <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          )}
        </motion.div>
      </div>

      {/* ── ANNOUNCEMENTS + EXCHANGE ─────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fade(4)} className="lg:col-span-2">
          <Card className="h-full p-6">
            <div className="mb-4 flex items-center gap-2">
              <Megaphone className="size-5 text-gold-400" />
              <h2 className="font-semibold">Group Announcements</h2>
            </div>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                  <div className="mt-0.5">
                    <Badge variant={a.priority === "urgent" ? "danger" : a.priority === "important" ? "warning" : "muted"}>
                      {a.priority}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-muted-foreground">{a.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div {...fade(5)} className="space-y-6">
          <ExchangeWidget />
          <Link href="/analytics">
            <Card className="group flex items-center justify-between p-5 transition hover:border-white/20">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-electric-500/15">
                  <Trophy className="size-5 text-electric-400" />
                </div>
                <div>
                  <div className="font-medium">Trip Analytics</div>
                  <div className="text-xs text-muted-foreground">Stats, charts & records</div>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function greeting(now: number) {
  const h = new Date(now).getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
