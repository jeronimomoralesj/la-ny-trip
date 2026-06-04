"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Plus, Trophy, FerrisWheel, Rocket } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress, SectionTitle } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Ride, Park } from "@/lib/types";

const PARKS: { id: Park; label: string; icon: any; accent: string }[] = [
  { id: "disneyland", label: "Disneyland", icon: FerrisWheel, accent: "#ec4899" },
  { id: "six-flags", label: "Six Flags", icon: Rocket, accent: "#22c55e" },
];

export default function ParksPage() {
  const { user } = useAuth();
  const { data: rides, add, update } = useCollection<Ride>("rides");
  const [park, setPark] = useState<Park>("disneyland");
  const [name, setName] = useState("");

  const list = rides.filter((r) => r.park === park);
  const done = list.filter((r) => r.completed).length;
  const pct = list.length ? (done / list.length) * 100 : 0;
  const meta = PARKS.find((p) => p.id === park)!;

  const toggle = (r: Ride) => {
    const completedBy = new Set(r.completedBy ?? []);
    const willComplete = !r.completed;
    if (user) willComplete ? completedBy.add(user.id) : completedBy.delete(user.id);
    update.mutate({ id: r.id, patch: { completed: willComplete, completedBy: Array.from(completedBy) } });
  };

  const rate = (r: Ride, rating: number) => update.mutate({ id: r.id, patch: { rating } });

  const addRide = () => {
    if (!name.trim()) return;
    add.mutate({ park, name: name.trim(), completed: false, completedBy: [] } as Omit<Ride, "id">);
    setName("");
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Squad"
        title="Theme Park Tracker"
        action={<Tabs value={park} onChange={(v) => setPark(v as Park)} tabs={PARKS.map((p) => ({ id: p.id, label: p.label, icon: p.icon }))} />}
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${meta.accent}22, transparent 55%)` }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><meta.icon className="size-4" /> {meta.label}</div>
            <div className="board-font mt-1 text-4xl font-bold" style={{ color: meta.accent }}>{done}<span className="text-xl text-muted-foreground">/{list.length}</span></div>
            <div className="text-sm text-muted-foreground">rides conquered</div>
          </div>
          {pct === 100 && list.length > 0 ? (
            <div className="flex flex-col items-center gap-1 text-gold-400">
              <Trophy className="size-10" />
              <span className="text-xs font-semibold uppercase tracking-wide">Park cleared!</span>
            </div>
          ) : (
            <div className="board-font text-3xl font-bold" style={{ color: meta.accent }}>{Math.round(pct)}%</div>
          )}
        </div>
        <Progress value={pct} className="mt-4 h-2.5" barClassName="bg-gradient-to-r from-pink-500 to-gold-400" />
      </div>

      <div className="flex gap-2">
        <Input placeholder={`Add a ride to ${meta.label}…`} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addRide()} />
        <Button onClick={addRide}><Plus className="size-4" /> Add</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={cn("glass rounded-2xl p-4", r.completed && "glow-gold")}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggle(r)}
                className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border transition", r.completed ? "border-gold-500 bg-gold-500 text-navy-950" : "border-white/20 hover:border-white/40")}
              >
                {r.completed && <Check className="size-4" strokeWidth={3} />}
              </button>
              <div className="flex-1">
                <div className={cn("font-medium", r.completed && "text-gold-300")}>{r.name}</div>
                {r.land && <div className="text-xs text-muted-foreground">{r.land}</div>}
                <div className="mt-2 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => rate(r, s)}>
                      <Star className={cn("size-4 transition", (r.rating ?? 0) >= s ? "fill-gold-400 text-gold-400" : "text-white/20 hover:text-white/40")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
