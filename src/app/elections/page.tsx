"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Check, Plus, Trash2, CalendarClock, FileText, Flag } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS, ELECTION_DAY } from "@/lib/seed-data";
import { Countdown } from "@/components/widgets/countdown";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress, SectionTitle, Avatar } from "@/components/ui/misc";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { ElectionTask, ElectionNote } from "@/lib/types";

const KEY_DATES = [
  { date: "2026-06-20", label: "Red-eye home", detail: "JFK → BOG overnight" },
  { date: "2026-06-21", label: "Election Day", detail: "Land 06:30, polls open 08:00" },
  { date: "2026-06-21", label: "Polls close", detail: "Vote before 16:00" },
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
      <SectionTitle eyebrow="Civic Duty" title="Colombia 2026 Election Hub" />

      {/* Hero countdown */}
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 120% at 100% 0%, rgba(34,197,94,.18), transparent 55%), linear-gradient(135deg, rgba(252,209,22,.06), rgba(0,71,171,.06))" }} />
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-emerald-500/20 blur-[80px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
              <Flag className="size-4" /> Straight from the airport to the polls
            </div>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">We land, then we vote.</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              The squad returns to Bogotá on election day and heads directly to the polling station. Stay ready.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              <CalendarClock className="size-3.5" /> Countdown to polls
            </div>
            <Countdown target={ELECTION_DAY} />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Vote className="size-5 text-emerald-400" /><h3 className="font-semibold">Voting Checklist</h3></div>
              <span className="text-sm text-muted-foreground">{done}/{tasks.length} done</span>
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
              <Input placeholder="Add a reminder…" value={taskLabel} onChange={(e) => setTaskLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && taskLabel.trim()) { addTask.mutate({ label: taskLabel.trim(), done: false } as Omit<ElectionTask, "id">); setTaskLabel(""); } }} />
              <Button onClick={() => { if (taskLabel.trim()) { addTask.mutate({ label: taskLabel.trim(), done: false } as Omit<ElectionTask, "id">); setTaskLabel(""); } }}>
                <Plus className="size-4" />
              </Button>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2"><FileText className="size-5 text-electric-400" /><h3 className="font-semibold">Notes</h3></div>
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="group flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <Avatar name={userName(n.authorId)} color={SEED_USERS.find((u) => u.id === n.authorId)?.avatarColor} size={28} />
                  <div className="flex-1">
                    <p className="text-sm">{n.body}</p>
                    <div className="mt-1 text-xs text-muted-foreground">{userName(n.authorId)} · {format(parseISO(n.createdAt), "MMM d")}</div>
                  </div>
                  <button onClick={() => removeNote.mutate(n.id)} className="opacity-0 transition group-hover:opacity-100">
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Textarea placeholder="Add a note for the group…" value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[44px]" />
              <Button onClick={() => { if (note.trim()) { addNote.mutate({ body: note.trim(), authorId: user?.id ?? "jeronimo", createdAt: new Date().toISOString() } as Omit<ElectionNote, "id">); setNote(""); } }}>
                <Plus className="size-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Key dates + future modules */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-3 font-semibold">Key Dates</h3>
            <div className="space-y-3">
              {KEY_DATES.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <div className="board-font grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-navy-800 text-center text-xs leading-tight">
                    <div><div className="font-bold text-emerald-400">{format(parseISO(d.date), "dd")}</div><div className="text-[9px] text-muted-foreground">{format(parseISO(d.date), "MMM")}</div></div>
                  </div>
                  <div><div className="text-sm font-medium">{d.label}</div><div className="text-xs text-muted-foreground">{d.detail}</div></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-dashed p-6">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Coming soon</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground/70">
              <li>• Candidate information</li>
              <li>• Live election tracking</li>
              <li>• News & polling data</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground/50">Foundation built for future expansion.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
