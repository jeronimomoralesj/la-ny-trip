"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Star, MapPin, UtensilsCrossed, Wine, Coffee, Cookie, Map as MapIcon, List } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS } from "@/lib/seed-data";
import { TripMap, type MapPin as Pin } from "@/components/map/trip-map";
import { Modal } from "@/components/ui/drawer";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { SectionTitle } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { FoodEntry, FoodKind } from "@/lib/types";

const KIND: Record<FoodKind, { icon: any; color: string }> = {
  restaurant: { icon: UtensilsCrossed, color: "#f97316" },
  bar: { icon: Wine, color: "#a78bfa" },
  cafe: { icon: Coffee, color: "#22d3ee" },
  snack: { icon: Cookie, color: "#f5c451" },
};
const userName = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;

export default function FoodPage() {
  const { user } = useAuth();
  const { data: entries, add } = useCollection<FoodEntry>("restaurants");
  const [view, setView] = useState("list");
  const [open, setOpen] = useState(false);

  const sorted = [...entries].sort((a, b) => +parseISO(b.date) - +parseISO(a.date));
  const geo = sorted.filter((e) => e.lat && e.lng);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Squad"
        title="Food Journal"
        action={
          <div className="flex gap-2">
            <Tabs value={view} onChange={setView} tabs={[{ id: "list", label: "List", icon: List }, { id: "map", label: "Map", icon: MapIcon }]} />
            <Button variant="gold" onClick={() => setOpen(true)}><Plus className="size-4" /> Log</Button>
          </div>
        }
      />

      {view === "list" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((e, i) => {
            const meta = KIND[e.kind];
            const Icon = meta.icon;
            return (
              <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass glass-hover overflow-hidden rounded-2xl">
                {e.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.photoUrl} alt={e.name} className="h-36 w-full object-cover" />
                ) : (
                  <div className="grid h-36 place-items-center" style={{ background: `${meta.color}18` }}>
                    <Icon className="size-10" style={{ color: meta.color }} />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium">{e.name}</div>
                    <Badge variant="muted">{e.kind}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn("size-3.5", e.rating >= s ? "fill-gold-400 text-gold-400" : "text-white/20")} />
                    ))}
                  </div>
                  {e.notes && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.notes}</p>}
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {e.city} · {userName(e.loggedBy)} · {format(parseISO(e.date), "MMM d")}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <TripMap pins={geo.map<Pin>((e) => ({ id: e.id, lng: e.lng!, lat: e.lat!, title: e.name, subtitle: `${e.rating}★ · ${e.city}`, color: KIND[e.kind].color }))} className="h-[60vh] w-full" />
        </div>
      )}

      <LogFood open={open} onClose={() => setOpen(false)} onAdd={(e) => add.mutate(e)} loggedBy={user?.id ?? "jeronimo"} />
    </div>
  );
}

function LogFood({ open, onClose, onAdd, loggedBy }: { open: boolean; onClose: () => void; onAdd: (e: Omit<FoodEntry, "id">) => void; loggedBy: string }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<FoodKind>("restaurant");
  const [city, setCity] = useState("Los Angeles");
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), kind, city, rating, notes, loggedBy, date: new Date().toISOString().slice(0, 10) });
    setName(""); setNotes(""); onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Log a spot">
      <div className="space-y-3">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Select value={kind} onChange={(e) => setKind(e.target.value as FoodKind)}>
            {Object.keys(KIND).map((k) => <option key={k} value={k}>{k}</option>)}
          </Select>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option>Los Angeles</option><option>New York</option><option>Anaheim</option><option>Bogotá</option>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)}>
              <Star className={cn("size-6", rating >= s ? "fill-gold-400 text-gold-400" : "text-white/20")} />
            </button>
          ))}
        </div>
        <Textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button className="w-full" onClick={submit}>Save</Button>
      </div>
    </Modal>
  );
}
