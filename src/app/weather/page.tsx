"use client";

import { Droplets, Wind, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useWeather } from "@/hooks/use-weather";
import { SectionTitle, Skeleton } from "@/components/ui/misc";
import { Card } from "@/components/ui/card";
import { parseISO } from "date-fns";
import { fmt } from "@/lib/utils";
import type { WeatherSnapshot } from "@/lib/types";

function emoji(icon: string) {
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02") || icon.startsWith("03")) return "⛅";
  if (icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  return "🌤️";
}

export default function WeatherPage() {
  const { data, isLoading } = useWeather();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Operaciones" title="Centro del Clima" />
      {isLoading && <Skeleton className="h-64 w-full" />}
      <div className="grid gap-6 lg:grid-cols-2">
        {data?.map((w, i) => <CityWeather key={w.city} w={w} delay={i * 0.1} />)}
      </div>
    </div>
  );
}

function CityWeather({ w, delay }: { w: WeatherSnapshot; delay: number }) {
  const accent = w.city === "Los Angeles" ? "#f5c451" : "#22d3ee";
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="overflow-hidden">
        <div className="relative p-6" style={{ background: `radial-gradient(120% 120% at 100% 0%, ${accent}22, transparent 55%)` }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{w.city}</div>
              <div className="mt-1 flex items-center gap-3">
                <span className="board-font text-6xl font-bold">{w.temp}°</span>
                <span className="text-5xl">{emoji(w.icon)}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{w.condition} · feels {w.feelsLike}°</div>
            </div>
            <div className="space-y-1 text-right text-sm text-muted-foreground">
              <div className="flex items-center justify-end gap-1.5"><Droplets className="size-3.5" /> {w.humidity}%</div>
              <div className="flex items-center justify-end gap-1.5"><Wind className="size-3.5" /> {w.wind} km/h</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Por hora</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {w.hourly.map((h, i) => (
              <div key={i} className="flex min-w-[52px] flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/[0.02] px-2 py-2.5">
                <span className="text-[11px] text-muted-foreground">{h.time}</span>
                <span className="text-lg">{emoji(h.icon)}</span>
                <span className="board-font text-sm font-semibold">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">5 días</div>
          <div className="space-y-1">
            {w.daily.map((d, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-white/[0.03]">
                <span className="w-10 text-muted-foreground">{fmt(parseISO(d.date), "EEE")}</span>
                <span className="text-lg">{emoji(d.icon)}</span>
                <span className="flex-1 text-xs text-muted-foreground">{d.condition}</span>
                <span className="board-font font-semibold">{d.max}°</span>
                <span className="board-font text-muted-foreground">{d.min}°</span>
              </div>
            ))}
          </div>
        </div>

        {(w.alerts.length > 0 || w.recommendations.length > 0) && (
          <div className="space-y-2 border-t border-white/10 px-4 py-4">
            {w.alerts.map((a, i) => (
              <div key={i} className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <div><div className="font-medium text-amber-300">{a.title}</div><div className="text-xs text-amber-200/70">{a.description}</div></div>
              </div>
            ))}
            {w.recommendations.map((r, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-electric-500/8 px-3 py-2 text-sm text-electric-200">
                <Lightbulb className="size-4 shrink-0 text-electric-400" /> {r}
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
