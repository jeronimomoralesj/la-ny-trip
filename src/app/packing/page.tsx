"use client";

import { useState } from "react";
import { Plus, Check, Trash2, Luggage } from "lucide-react";
import { motion } from "framer-motion";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS } from "@/lib/seed-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress, SectionTitle, Avatar } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/lib/types";

export default function PackingPage() {
  const { user } = useAuth();
  const { data: items, add, update, remove } = useCollection<ChecklistItem>("checklists");
  const [owner, setOwner] = useState(user?.id ?? "jeronimo");
  const [label, setLabel] = useState("");

  const mine = items.filter((i) => i.ownerId === owner);
  const done = mine.filter((i) => i.checked).length;
  const pct = mine.length ? (done / mine.length) * 100 : 0;

  const grouped = mine.reduce<Record<string, ChecklistItem[]>>((acc, it) => {
    (acc[it.category ?? "Other"] ??= []).push(it);
    return acc;
  }, {});

  const addItem = () => {
    if (!label.trim()) return;
    add.mutate({ ownerId: owner, label: label.trim(), checked: false, category: "Custom" } as Omit<ChecklistItem, "id">);
    setLabel("");
  };

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Operations" title="Packing Center" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={owner} onChange={setOwner} tabs={SEED_USERS.map((u) => ({ id: u.id, label: u.name }))} />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Avatar name={SEED_USERS.find((u) => u.id === owner)?.name ?? ""} color={SEED_USERS.find((u) => u.id === owner)?.avatarColor} size={48} />
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{SEED_USERS.find((u) => u.id === owner)?.name}&apos;s bag</span>
              <span className="text-muted-foreground">{done}/{mine.length} packed</span>
            </div>
            <Progress value={pct} className="mt-2 h-2.5" />
          </div>
          <div className="board-font text-2xl font-bold text-gold-400">{Math.round(pct)}%</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Input placeholder="Add an item…" value={label} onChange={(e) => setLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} />
        <Button onClick={addItem}><Plus className="size-4" /> Add</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat} className="glass rounded-2xl p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-electric-400">{cat}</div>
            <div className="space-y-1">
              {list.map((it) => (
                <motion.div key={it.id} layout className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.03]">
                  <button
                    onClick={() => update.mutate({ id: it.id, patch: { checked: !it.checked } })}
                    className={cn("grid size-5 shrink-0 place-items-center rounded-md border transition", it.checked ? "border-emerald-500 bg-emerald-500 text-navy-950" : "border-white/20")}
                  >
                    {it.checked && <Check className="size-3.5" strokeWidth={3} />}
                  </button>
                  <span className={cn("flex-1 text-sm", it.checked && "text-muted-foreground line-through")}>{it.label}</span>
                  <button onClick={() => remove.mutate(it.id)} className="opacity-0 transition group-hover:opacity-100">
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-red-400" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {mine.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 py-12 text-center">
            <Luggage className="size-8 text-muted-foreground/40" />
            <p className="text-muted-foreground">Empty bag — add the first item above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
