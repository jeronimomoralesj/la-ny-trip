"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Check, Plus, Trash2, CalendarClock, FileText, Flag, Users } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS, ELECTION_DAY } from "@/lib/seed-data";
import { Countdown } from "@/components/widgets/countdown";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress, SectionTitle, Avatar } from "@/components/ui/misc";
import { Card } from "@/components/ui/card";
import { cn, fmt } from "@/lib/utils";
import { parseISO } from "date-fns";
import type { ElectionTask, ElectionNote } from "@/lib/types";

const KEY_DATES = [
  { date: "2026-06-20", label: "Vuelo nocturno", detail: "JFK → BOG de noche" },
  { date: "2026-06-21", label: "Día de elecciones", detail: "Aterriza 06:30, urnas abren 08:00" },
  { date: "2026-06-21", label: "Cierre de urnas", detail: "Votar antes de las 16:00" },
];

interface Candidate {
  name: string;
  photo: string;
  votes: number;
  pct: number;
  accent: string;
  favorite?: boolean;
}

// Resultados primera vuelta — ambos avanzan a segunda vuelta.
const CANDIDATES: Candidate[] = [
  { name: "Abelardo de la Espriella", photo: "https://pbs.twimg.com/media/G1aRGMxXkAAZCSz.jpg", votes: 10_361_499, pct: 43.74, accent: "#f5c451", favorite: true },
  { name: "Iván Cepeda", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl1FUbywApxxfaeIAaO0F9jhW-BDzvHRZMWA&s", votes: 9_688_361, pct: 40.9, accent: "#22d3ee" },
];

const userName = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;

export default function ElectionsPage() {
  const { user } = useAuth();
  const { data: tasks, add: addTask, update: updateTask, remove: removeTask } = useCollection<ElectionTask>("electionTasks");
  const { data: notes, add: addNote, remove: removeNote } = useCollection<ElectionNote>("electionNotes");
  const [taskLabel, setTaskLabel] = useState("");
  const [note, setNote] = useState("");

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? (done / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Deber Cívico" title="Centro de Elecciones Colombia 2026" />

      {/* Hero countdown */}
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 120% at 100% 0%, rgba(34,197,94,.18), transparent 55%), linear-gradient(135deg, rgba(252,209,22,.06), rgba(0,71,171,.06))" }} />
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-emerald-500/20 blur-[80px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
              <Flag className="size-4" /> Directo del aeropuerto a las urnas
            </div>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Aterrizamos y vamos a votar.</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Juan y Jeronimo regresan a Bogotá el día de elecciones y van directo al puesto de votación. A estar listos.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              <CalendarClock className="size-3.5" /> Cuenta regresiva a las urnas
            </div>
            <Countdown target={ELECTION_DAY} />
          </div>
        </div>
      </Card>

      {/* Candidatos — Segunda vuelta */}
      <Card className="p-5 sm:p-6">
        <div className="mb-1 flex items-center gap-2">
          <Users className="size-5 text-electric-400" />
          <h3 className="font-semibold">Segunda vuelta — los candidatos</h3>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">Resultados de la primera vuelta · ambos avanzan</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CANDIDATES.map((c) => (
            <div
              key={c.name}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-4 transition",
                c.favorite ? "border-gold-500/50 bg-gold-500/[0.06] glow-gold" : "border-white/10 bg-white/[0.02]",
              )}
            >
              {c.favorite && (
                <span className="absolute right-3 top-3 z-10 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-950">
                  ⭐ Favorito
                </span>
              )}
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photo}
                  alt={c.name}
                  className={cn("rounded-2xl object-cover", c.favorite ? "size-20 ring-2 ring-gold-400" : "size-16 ring-1 ring-white/15")}
                />
                <div className="min-w-0">
                  <div className={cn("font-semibold leading-tight", c.favorite ? "text-lg text-gold-300" : "text-base")}>{c.name}</div>
                  <div className="board-font mt-0.5 text-2xl font-bold" style={{ color: c.accent }}>{c.pct.toFixed(2)}%</div>
                  <div className="text-xs text-muted-foreground">{c.votes.toLocaleString("es-CO")} votos</div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.accent }} />
              </div>
              <div className="mt-2 text-[11px] font-medium text-emerald-400">Avanza a segunda vuelta ✓</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Vote className="size-5 text-emerald-400" /><h3 className="font-semibold">Lista de votación</h3></div>
              <span className="text-sm text-muted-foreground">{done}/{tasks.length} listos</span>
            </div>
            <Progress value={pct} className="mb-4 h-2.5" barClassName="bg-gradient-to-r from-emerald-500 to-gold-400" />
            <div className="space-y-1">
              {tasks.map((t) => (
                <motion.div key={t.id} layout className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.03]">
                  <button
                    onClick={() => updateTask.mutate({ id: t.id, patch: { done: !t.done } })}
                    className={cn("grid size-5 shrink-0 place-items-center rounded-md border transition", t.done ? "border-emerald-500 bg-emerald-500 text-navy-950" : "border-white/20")}
                  >
                    {t.done && <Check className="size-3.5" strokeWidth={3} />}
                  </button>
                  <span className={cn("flex-1 text-sm", t.done && "text-muted-foreground line-through")}>{t.label}</span>
                  <button onClick={() => removeTask.mutate(t.id)} className="opacity-0 transition group-hover:opacity-100">
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-red-400" />
                  </button>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input placeholder="Agregar un recordatorio…" value={taskLabel} onChange={(e) => setTaskLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && taskLabel.trim()) { addTask.mutate({ label: taskLabel.trim(), done: false } as Omit<ElectionTask, "id">); setTaskLabel(""); } }} />
              <Button onClick={() => { if (taskLabel.trim()) { addTask.mutate({ label: taskLabel.trim(), done: false } as Omit<ElectionTask, "id">); setTaskLabel(""); } }}>
                <Plus className="size-4" />
              </Button>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2"><FileText className="size-5 text-electric-400" /><h3 className="font-semibold">Notas</h3></div>
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="group flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <Avatar name={userName(n.authorId)} color={SEED_USERS.find((u) => u.id === n.authorId)?.avatarColor} size={28} />
                  <div className="flex-1">
                    <p className="text-sm">{n.body}</p>
                    <div className="mt-1 text-xs text-muted-foreground">{userName(n.authorId)} · {fmt(parseISO(n.createdAt), "d MMM")}</div>
                  </div>
                  <button onClick={() => removeNote.mutate(n.id)} className="opacity-0 transition group-hover:opacity-100">
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Textarea placeholder="Agregar una nota para el grupo…" value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[44px]" />
              <Button onClick={() => { if (note.trim()) { addNote.mutate({ body: note.trim(), authorId: user?.id ?? "jeronimo", createdAt: new Date().toISOString() } as Omit<ElectionNote, "id">); setNote(""); } }}>
                <Plus className="size-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Key dates + future modules */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-3 font-semibold">Fechas clave</h3>
            <div className="space-y-3">
              {KEY_DATES.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <div className="board-font grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-navy-800 text-center text-xs leading-tight">
                    <div><div className="font-bold text-emerald-400">{fmt(parseISO(d.date), "dd")}</div><div className="text-[9px] text-muted-foreground">{fmt(parseISO(d.date), "MMM")}</div></div>
                  </div>
                  <div><div className="text-sm font-medium">{d.label}</div><div className="text-xs text-muted-foreground">{d.detail}</div></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-dashed p-6">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Próximamente</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground/70">
              <li>• Información de candidatos</li>
              <li>• Seguimiento de resultados en vivo</li>
              <li>• Noticias y encuestas</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground/50">Base lista para expansión futura.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
