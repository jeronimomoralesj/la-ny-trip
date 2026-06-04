"use client";

import { useState } from "react";
import { Plus, Users, User, Trash2, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS } from "@/lib/seed-data";
import { computeBalances, computeSettlements } from "@/lib/trip";
import { formatUSD, cn, fmt } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Avatar, EmptyState, SectionTitle } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { FinanceGate } from "@/components/auth/finance-gate";
import { parseISO } from "date-fns";
import type { Expense, ExpenseCategory } from "@/lib/types";

const CATEGORIES: ExpenseCategory[] = ["food", "drinks", "transport", "lodging", "tickets", "souvenirs", "groceries", "gas", "parking", "other"];
const CAT_LABEL: Record<ExpenseCategory, string> = {
  food: "comida", drinks: "bebidas", transport: "transporte", lodging: "alojamiento",
  tickets: "entradas", souvenirs: "souvenirs", groceries: "mercado", gas: "gasolina",
  parking: "parqueadero", other: "otro",
};
const USER_IDS = SEED_USERS.map((u) => u.id);
const userName = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;
const userColor = (id: string) => SEED_USERS.find((u) => u.id === id)?.avatarColor;

export default function ExpensesPage() {
  return (
    <FinanceGate>
      <ExpensesInner />
    </FinanceGate>
  );
}

function ExpensesInner() {
  const { user } = useAuth();
  const { data: expenses, add, remove } = useCollection<Expense>("expenses");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");

  const balances = computeBalances(expenses, USER_IDS);
  const settlements = computeSettlements(balances);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const filtered = expenses
    .filter((e) => (tab === "shared" ? e.shared : tab === "personal" ? !e.shared : true))
    .sort((a, b) => +parseISO(b.date) - +parseISO(a.date));

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Dinero"
        title="Gastos"
        action={<Button variant="gold" onClick={() => setOpen(true)}><Plus className="size-4" /> Agregar</Button>}
      />

      {/* Balance strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {balances.map((b) => (
          <motion.div key={b.userId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Avatar name={userName(b.userId)} color={userColor(b.userId)} size={32} />
              <div className="text-sm font-medium">{userName(b.userId)}</div>
            </div>
            <div className={cn("mt-2 board-font text-xl font-bold", b.net >= 0 ? "text-emerald-400" : "text-red-400")}>
              {b.net >= 0 ? "+" : ""}{formatUSD(b.net)}
            </div>
            <div className="text-[11px] text-muted-foreground">pagó {formatUSD(b.paid)}</div>
          </motion.div>
        ))}
      </div>

      {/* Settlements */}
      {settlements.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <div className="mb-3 text-sm font-semibold">Cómo saldar cuentas</div>
          <div className="flex flex-wrap gap-2">
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-3 text-sm">
                <Avatar name={userName(s.fromId)} color={userColor(s.fromId)} size={24} />
                <span className="text-muted-foreground">le paga a</span>
                <Avatar name={userName(s.toId)} color={userColor(s.toId)} size={24} />
                <span className="font-semibold text-gold-400">{formatUSD(s.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "all", label: "Todos" },
            { id: "shared", label: "Compartidos", icon: Users },
            { id: "personal", label: "Personales", icon: User },
          ]}
        />
        <div className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">{formatUSD(total)}</span></div>
      </div>

      {/* List */}
      {filtered.length ? (
        <div className="space-y-2">
          {filtered.map((e) => (
            <div key={e.id} className="glass glass-hover group flex items-center gap-4 rounded-xl p-3.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-electric-500/15">
                <Receipt className="size-4 text-electric-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{e.title}</span>
                  <Badge variant={e.shared ? "cyan" : "muted"}>{e.shared ? "compartido" : "personal"}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {userName(e.payerId)} pagó · {CAT_LABEL[e.category]} · {fmt(parseISO(e.date), "d MMM")}
                  {e.shared && ` · dividido entre ${e.participantIds.length}`}
                </div>
              </div>
              <div className="board-font font-semibold">{formatUSD(e.amount)}</div>
              {user?.role === "admin" && (
                <button onClick={() => remove.mutate(e.id)} className="opacity-0 transition group-hover:opacity-100">
                  <Trash2 className="size-4 text-muted-foreground hover:text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Receipt} title="Aún no hay gastos" hint="Agrega el primero para empezar a calcular quién le debe a quién." />
      )}

      <AddExpense open={open} onClose={() => setOpen(false)} onAdd={(e) => add.mutateAsync(e)} defaultPayer={user?.id ?? "jeronimo"} />
    </div>
  );
}

function AddExpense({
  open, onClose, onAdd, defaultPayer,
}: { open: boolean; onClose: () => void; onAdd: (e: Omit<Expense, "id">) => void | Promise<unknown>; defaultPayer: string }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [payerId, setPayerId] = useState(defaultPayer);
  const [shared, setShared] = useState(true);
  const [participants, setParticipants] = useState<string[]>(USER_IDS);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim() || !amount) return;
    setSaving(true);
    try {
      await onAdd({
        title: title.trim(), amount: parseFloat(amount), category, payerId, shared,
        participantIds: shared ? participants : [payerId],
        notes, date: new Date().toISOString().slice(0, 10),
      });
      setTitle(""); setAmount(""); setNotes(""); onClose();
    } catch {
      /* el toast de error ya se muestra; mantenemos el modal abierto */
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Agregar gasto">
      <div className="space-y-3">
        <Input placeholder="¿Para qué fue?" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Monto (USD)" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Pagado por</label>
          <Select value={payerId} onChange={(e) => setPayerId(e.target.value)} className="mt-1">
            {SEED_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} className="size-4 accent-electric-500" />
          Gasto compartido (dividir)
        </label>
        {shared && (
          <div className="flex flex-wrap gap-2">
            {SEED_USERS.map((u) => {
              const on = participants.includes(u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => setParticipants((p) => on ? p.filter((x) => x !== u.id) : [...p, u.id])}
                  className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs", on ? "border-electric-500/50 bg-electric-500/15 text-white" : "border-white/10 text-muted-foreground")}
                >
                  <Avatar name={u.name} color={u.avatarColor} size={20} /> {u.name}
                </button>
              );
            })}
          </div>
        )}
        <Textarea placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button className="w-full" onClick={submit} disabled={saving}>{saving ? "Guardando…" : "Guardar gasto"}</Button>
      </div>
    </Modal>
  );
}
