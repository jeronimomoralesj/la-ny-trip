"use client";

import { useMemo } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Calendar, MapPin, Plane, Images, Receipt, UtensilsCrossed, FerrisWheel, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useCollection } from "@/hooks/use-collection";
import { SEED_USERS } from "@/lib/seed-data";
import { SectionTitle, Stat } from "@/components/ui/misc";
import { Card } from "@/components/ui/card";
import type { Photo, Expense, FoodEntry, Ride, Flight, TimelineEvent } from "@/lib/types";

const userName = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;

export default function AnalyticsPage() {
  const { data: photos } = useCollection<Photo>("photos");
  const { data: expenses } = useCollection<Expense>("expenses");
  const { data: food } = useCollection<FoodEntry>("restaurants");
  const { data: rides } = useCollection<Ride>("rides");
  const { data: flights } = useCollection<Flight>("flights");
  const { data: events } = useCollection<TimelineEvent>("timelineEvents");

  const ridesDone = rides.filter((r) => r.completed).length;

  const photosByUser = useMemo(() => {
    const map: Record<string, number> = {};
    SEED_USERS.forEach((u) => (map[u.id] = 0));
    photos.forEach((p) => (map[p.uploaderId] = (map[p.uploaderId] ?? 0) + 1));
    return SEED_USERS.map((u) => ({ name: u.name, photos: map[u.id] ?? 0 }));
  }, [photos]);

  const contribution = useMemo(() =>
    SEED_USERS.map((u) => ({
      user: u.name,
      photos: photos.filter((p) => p.uploaderId === u.id).length,
      expenses: expenses.filter((e) => e.payerId === u.id).length,
      food: food.filter((f) => f.loggedBy === u.id).length,
    })), [photos, expenses, food]);

  const stats = [
    { label: "Días de viaje", value: 13, icon: Calendar, accent: "#3b82f6" },
    { label: "Ciudades", value: 4, icon: MapPin, accent: "#22d3ee" },
    { label: "Vuelos", value: flights.length, icon: Plane, accent: "#a78bfa" },
    { label: "Fotos", value: photos.length, icon: Images, accent: "#ec4899" },
    { label: "Gastos", value: expenses.length, icon: Receipt, accent: "#f5c451" },
    { label: "Restaurantes", value: food.length, icon: UtensilsCrossed, accent: "#f97316" },
    { label: "Atracciones", value: ridesDone, icon: FerrisWheel, accent: "#22c55e" },
    { label: "Eventos", value: events.length, icon: Trophy, accent: "#eab308" },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Escuadrón" title="Analíticas del Viaje" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <s.icon className="size-5" style={{ color: s.accent }} />
              </div>
              <div className="board-font mt-2 text-3xl font-bold" style={{ color: s.accent }}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-semibold">Fotos por viajero</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={photosByUser}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,.04)" }} contentStyle={{ background: "#0c1024", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="photos" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-semibold">Contribución del escuadrón</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={contribution} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,.1)" />
                <PolarAngleAxis dataKey="user" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Radar name="Fotos" dataKey="photos" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                <Radar name="Gastos" dataKey="expenses" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Comida" dataKey="food" stroke="#f5c451" fill="#f5c451" fillOpacity={0.3} />
                <Tooltip contentStyle={{ background: "#0c1024", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Mejores calificados</h2>
        <div className="space-y-2">
          {[...food].sort((a, b) => b.rating - a.rating).slice(0, 5).map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <Trophy className="size-4 text-gold-400" />
              <span className="flex-1 text-sm font-medium">{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.city} · {userName(f.loggedBy)}</span>
              <span className="board-font font-semibold text-gold-400">{f.rating}★</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
