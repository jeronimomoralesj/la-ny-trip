"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Syringe, ShieldCheck, Calendar } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS, resolveTravelerId } from "@/lib/seed-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionTitle, Avatar } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { fmt } from "@/lib/utils";
import { parseISO } from "date-fns";
import type { Vaccine } from "@/lib/types";

const COMMON = ["Fiebre amarilla", "Influenza", "COVID-19", "Hepatitis A", "Hepatitis B", "Tétanos", "Triple viral (SRP)", "Tifoidea"];

export default function VaccinesPage() {
  const { user } = useAuth();
  const { data: vaccines, add, remove } = useCollection<Vaccine>("vaccines");
  const [owner, setOwner] = useState(resolveTravelerId(user?.id));
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const mine = [...vaccines]
    .filter((v) => v.ownerId === owner)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  const addVaccine = (vname: string) => {
    const n = vname.trim();
    if (!n) return;
    add.mutate({ ownerId: owner, name: n, ...(date ? { date } : {}) } as Omit<Vaccine, "id">);
    setName(""); setDate("");
  };

  const ownerUser = SEED_USERS.find((u) => u.id === owner);

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Operaciones" title="Centro de Vacunas" />

      <Tabs value={owner} onChange={setOwner} tabs={SEED_USERS.map((u) => ({ id: u.id, label: u.name }))} />

      {/* Resumen */}
      <div className="glass flex items-center gap-4 rounded-2xl p-5">
        <Avatar name={ownerUser?.name ?? ""} color={ownerUser?.avatarColor} size={48} />
        <div className="flex-1">
          <div className="font-medium">Vacunas de {ownerUser?.name}</div>
          <div className="text-sm text-muted-foreground">Registro de las vacunas para el viaje.</div>
        </div>
        <div className="text-right">
          <div className="board-font text-2xl font-bold text-emerald-400">{mine.length}</div>
          <div className="text-[11px] text-muted-foreground">registradas</div>
        </div>
      </div>

      {/* Agregar */}
      <div className="glass space-y-3 rounded-2xl p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Nombre de la vacuna…" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addVaccine(name)} className="flex-1" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="sm:w-44" />
          <Button onClick={() => addVaccine(name)}><Plus className="size-4" /> Agregar</Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="self-center text-xs text-muted-foreground">Rápido:</span>
          {COMMON.map((c) => (
            <button
              key={c}
              onClick={() => addVaccine(c)}
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-emerald-500/40 hover:text-foreground"
            >
              + {c}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {mine.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {mine.map((v) => (
            <motion.div key={v.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass group flex items-center gap-3 rounded-xl p-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15">
                <ShieldCheck className="size-5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{v.name}</div>
                {v.date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" /> {fmt(parseISO(v.date), "d 'de' MMMM yyyy")}
                  </div>
                )}
                {v.notes && <div className="truncate text-xs text-muted-foreground">{v.notes}</div>}
              </div>
              <button onClick={() => remove.mutate(v.id)} className="opacity-0 transition group-hover:opacity-100">
                <Trash2 className="size-4 text-muted-foreground hover:text-red-400" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 py-12 text-center">
          <Syringe className="size-8 text-muted-foreground/40" />
          <p className="text-muted-foreground">Sin vacunas registradas. Agrega las que te hayas puesto para el viaje.</p>
        </div>
      )}
    </div>
  );
}
