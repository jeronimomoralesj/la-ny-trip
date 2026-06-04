"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Check, Trash2, Luggage, Nfc, Briefcase, Backpack } from "lucide-react";
import { motion } from "framer-motion";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { notify } from "@/components/ui/toast";
import { SEED_USERS, resolveTravelerId } from "@/lib/seed-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle, Avatar } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/lib/types";

const DEFAULT_BAGS = ["Maleta principal", "Carry-on", "Mochila"];
const bagKey = (i: ChecklistItem) => i.bag || i.category || "General";

export default function PackingPage() {
  const { user } = useAuth();
  const { data: items, add, remove } = useCollection<ChecklistItem>("checklists");
  const [owner, setOwner] = useState(resolveTravelerId(user?.id));
  const [label, setLabel] = useState("");
  const [rfid, setRfid] = useState("");
  const [activeBag, setActiveBag] = useState(DEFAULT_BAGS[0]);
  const [customBags, setCustomBags] = useState<string[]>([]);

  // Recordar maletas creadas por dueño
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`lanyviaje:bags:${owner}`);
      setCustomBags(raw ? JSON.parse(raw) : []);
    } catch { setCustomBags([]); }
  }, [owner]);

  const mine = items.filter((i) => i.ownerId === owner);

  const bags = useMemo(() => {
    const fromItems = mine.map(bagKey);
    return Array.from(new Set([...DEFAULT_BAGS, ...customBags, ...fromItems]));
  }, [mine, customBags]);

  const grouped = useMemo(() => {
    const g: Record<string, ChecklistItem[]> = {};
    bags.forEach((b) => (g[b] = []));
    mine.forEach((it) => { (g[bagKey(it)] ??= []).push(it); });
    return bags.map((b) => [b, g[b] ?? []] as const).filter(([, list]) => list.length || true);
  }, [mine, bags]);

  const addItem = () => {
    if (!label.trim()) return;
    add.mutate({ ownerId: owner, label: label.trim(), checked: true, bag: activeBag, ...(rfid ? { rfid } : {}) } as Omit<ChecklistItem, "id">);
    setLabel(""); setRfid("");
  };

  const addBag = () => {
    const name = prompt("Nombre de la nueva maleta/bolso (ej. Bolso de mano):");
    if (!name?.trim()) return;
    const next = Array.from(new Set([...customBags, name.trim()]));
    setCustomBags(next);
    setActiveBag(name.trim());
    try { localStorage.setItem(`lanyviaje:bags:${owner}`, JSON.stringify(next)); } catch { /* */ }
  };

  const scanRfid = async () => {
    if (typeof window !== "undefined" && "NDEFReader" in window) {
      try {
        const reader = new (window as any).NDEFReader();
        await reader.scan();
        notify("Acerca la etiqueta NFC al teléfono…", "info");
        reader.onreading = (e: any) => {
          setRfid(e.serialNumber || "NFC-tag");
          notify("Etiqueta NFC leída ✓", "success");
        };
      } catch {
        notify("No se pudo iniciar el escaneo NFC.", "error");
      }
    } else {
      const manual = prompt("Tu navegador no soporta NFC (usa Chrome en Android). Ingresa el código RFID manualmente:");
      if (manual?.trim()) setRfid(manual.trim());
    }
  };

  const bagIcon = (b: string) => /carry|mano|cabina/i.test(b) ? Briefcase : /mochila|backpack|morral/i.test(b) ? Backpack : Luggage;

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Operaciones" title="Centro de Equipaje" />

      <Tabs value={owner} onChange={setOwner} tabs={SEED_USERS.map((u) => ({ id: u.id, label: u.name }))} />

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Avatar name={SEED_USERS.find((u) => u.id === owner)?.name ?? ""} color={SEED_USERS.find((u) => u.id === owner)?.avatarColor} size={48} />
          <div className="flex-1">
            <div className="font-medium">Equipaje de {SEED_USERS.find((u) => u.id === owner)?.name}</div>
            <div className="text-sm text-muted-foreground">Registro de lo empacado — agrega lo que metas a la maleta.</div>
          </div>
          <div className="text-right">
            <div className="board-font text-2xl font-bold text-gold-400">{mine.length}</div>
            <div className="text-[11px] text-muted-foreground">{bags.length} bolsos</div>
          </div>
        </div>
      </div>

      {/* Agregar artículo */}
      <div className="glass space-y-3 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Agregar a:</span>
          {bags.map((b) => {
            const Icon = bagIcon(b);
            return (
              <button
                key={b}
                onClick={() => setActiveBag(b)}
                className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition", activeBag === b ? "border-electric-500/50 bg-electric-500/15 text-white" : "border-white/10 text-muted-foreground")}
              >
                <Icon className="size-3.5" /> {b}
              </button>
            );
          })}
          <button onClick={addBag} className="flex items-center gap-1 rounded-full border border-dashed border-white/20 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">
            <Plus className="size-3.5" /> Maleta
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder={`Agregar a "${activeBag}"…`} value={label} onChange={(e) => setLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} />
          <div className="flex gap-2">
            <Button variant={rfid ? "gold" : "outline"} onClick={scanRfid} title="Escanear RFID/NFC">
              <Nfc className="size-4" /> {rfid ? rfid.slice(0, 8) : "RFID"}
            </Button>
            <Button onClick={addItem}><Plus className="size-4" /> Agregar</Button>
          </div>
        </div>
      </div>

      {/* Maletas */}
      <div className="grid gap-4 sm:grid-cols-2">
        {grouped.map(([bag, list]) => {
          const Icon = bagIcon(bag);
          return (
            <div key={bag} className="glass rounded-2xl p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-electric-400"><Icon className="size-4" /> {bag}</div>
                <span className="text-xs text-muted-foreground">{list.length} {list.length === 1 ? "artículo" : "artículos"}</span>
              </div>
              <div className="space-y-1">
                {list.map((it) => (
                  <motion.div key={it.id} layout className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.03]">
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-emerald-500 text-navy-950">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="flex-1 text-sm">{it.label}</span>
                    {it.rfid && <Badge variant="cyan"><Nfc className="size-3" /> {it.rfid.slice(0, 10)}</Badge>}
                    <button onClick={() => remove.mutate(it.id)} className="opacity-0 transition group-hover:opacity-100">
                      <Trash2 className="size-3.5 text-muted-foreground hover:text-red-400" />
                    </button>
                  </motion.div>
                ))}
                {list.length === 0 && <p className="px-2 py-3 text-xs text-muted-foreground/60">Vacío — agrega artículos a esta maleta.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
