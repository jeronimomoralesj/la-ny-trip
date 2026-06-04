"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User as UserIcon } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useWeather } from "@/hooks/use-weather";
import { useAuth } from "@/lib/auth-context";
import { answer, SUGGESTED, type AssistantContext } from "@/lib/assistant";
import { resolveTravelerId } from "@/lib/seed-data";
import { SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TimelineEvent, Expense, Flight, Photo } from "@/lib/types";

interface Msg { role: "user" | "assistant"; text: string }

export default function AssistantPage() {
  const { user } = useAuth();
  const { data: events } = useCollection<TimelineEvent>("timelineEvents");
  const { data: expenses } = useCollection<Expense>("expenses");
  const { data: flights } = useCollection<Flight>("flights");
  const { data: photos } = useCollection<Photo>("photos");
  const { data: weather } = useWeather();

  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: `¡Hola ${user?.name ?? "viajero"}! 👋 Soy tu copiloto del viaje. Pregúntame por el itinerario, el dinero, el clima, los vuelos o las fotos.` },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const ctx: AssistantContext = {
      now: Date.now(), events, expenses, flights, photos, weather: weather ?? [], userId: resolveTravelerId(user?.id),
    };
    const reply = answer(text, ctx);
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: reply }]);
    setInput("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col">
      <SectionTitle eyebrow="Escuadrón" title="Asistente de Viaje IA" />

      <div className="glass flex flex-1 flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-electric-500 to-gold-500">
            <Bot className="size-4 text-navy-950" />
          </div>
          <div>
            <div className="text-sm font-semibold">Copiloto</div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Sparkles className="size-3 text-gold-400" /> Lee los datos reales del viaje</div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${m.role === "user" ? "bg-electric-500/20" : "bg-gradient-to-br from-electric-500 to-gold-500"}`}>
                {m.role === "user" ? <UserIcon className="size-4 text-electric-400" /> : <Bot className="size-4 text-navy-950" />}
              </div>
              <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-electric-500 text-white" : "border border-white/10 bg-white/[0.04]"}`}>
                {m.text.split("**").map((part, j) => (j % 2 ? <strong key={j}>{part}</strong> : part))}
              </div>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {SUGGESTED.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground transition hover:border-electric-500/40 hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 border-t border-white/10 p-4">
          <Input placeholder="Pregúntale a tu copiloto…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} />
          <Button onClick={() => send(input)}><Send className="size-4" /></Button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground/60">
Asistente de demostración · arquitectura lista para LLM — reemplaza el motor de reglas por una llamada a un modelo con el mismo contexto.
      </p>
    </div>
  );
}
