"use client";

import { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import { TrendingUp, Users, Wallet, PiggyBank, Filter } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { SEED_USERS } from "@/lib/seed-data";
import { computeBalances, computeSettlements } from "@/lib/trip";
import { formatUSD } from "@/lib/utils";
import { ExchangeWidget } from "@/components/widgets/exchange-widget";
import { Stat, SectionTitle, Avatar } from "@/components/ui/misc";
import { Card } from "@/components/ui/card";
import { FinanceGate } from "@/components/auth/finance-gate";
import type { Expense } from "@/lib/types";

const COLORS = ["#3b82f6", "#f5c451", "#22d3ee", "#a78bfa", "#22c55e", "#f97316", "#ec4899", "#14b8a6", "#eab308", "#94a3b8"];
const USER_IDS = SEED_USERS.map((u) => u.id);
const userName = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;
const CAT_LABEL: Record<string, string> = {
  food: "comida", drinks: "bebidas", transport: "transporte", lodging: "alojamiento",
  tickets: "entradas", souvenirs: "souvenirs", groceries: "mercado", gas: "gasolina",
  parking: "parqueadero", other: "otro",
};

export default function FinancePage() {
  return (
    <FinanceGate>
      <FinanceInner />
    </FinanceGate>
  );
}

function FinanceInner() {
  const { data: expenses } = useCollection<Expense>("expenses");
  const [person, setPerson] = useState<string>("all");

  // Vista filtrada por persona (lo que pagó esa persona)
  const scoped = person === "all" ? expenses : expenses.filter((e) => e.payerId === person);

  const total = scoped.reduce((s, e) => s + e.amount, 0);
  const shared = scoped.filter((e) => e.shared).reduce((s, e) => s + e.amount, 0);
  const personal = scoped.filter((e) => !e.shared).reduce((s, e) => s + e.amount, 0);
  const balances = computeBalances(expenses, USER_IDS); // saldos siempre sobre el total del grupo
  const settlements = computeSettlements(balances);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    scoped.forEach((e) => { map[e.category] = (map[e.category] ?? 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [scoped]);

  const byUser = useMemo(
    () => USER_IDS.map((id) => ({
      name: userName(id),
      paid: balances.find((b) => b.userId === id)?.paid ?? 0,
      owed: balances.find((b) => b.userId === id)?.owed ?? 0,
    })),
    [balances],
  );

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Dinero" title="Centro Financiero" />

      {/* Filtro por persona */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Filter className="size-3.5" /> Filtrar:</span>
        <button
          onClick={() => setPerson("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${person === "all" ? "border-electric-500/50 bg-electric-500/15 text-white" : "border-white/10 text-muted-foreground"}`}
        >
          Todos
        </button>
        {SEED_USERS.map((u) => (
          <button
            key={u.id}
            onClick={() => setPerson(u.id)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${person === u.id ? "border-electric-500/50 bg-electric-500/15 text-white" : "border-white/10 text-muted-foreground"}`}
          >
            <Avatar name={u.name} color={u.avatarColor} size={18} /> {u.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label={person === "all" ? "Gasto total" : "Pagado"} value={formatUSD(total)} accent="#3b82f6" />
        <Stat label="Compartido" value={formatUSD(shared)} sub={`${Math.round((shared / total) * 100) || 0}% del total`} accent="#22d3ee" />
        <Stat label="Personal" value={formatUSD(personal)} sub={`${Math.round((personal / total) * 100) || 0}% del total`} accent="#f5c451" />
        <Stat label="Gastos" value={scoped.length} sub="registrados" accent="#a78bfa" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <PiggyBank className="size-5 text-gold-400" />
            <h2 className="font-semibold">Gasto por categoría</h2>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={3} stroke="none">
                    {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0c1024", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: any) => formatUSD(Number(v))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2">
              {byCategory.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="capitalize text-muted-foreground">{CAT_LABEL[c.name] ?? c.name}</span>
                  <span className="ml-auto font-medium">{formatUSD(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="size-5 text-electric-400" />
            <h2 className="font-semibold">Pagado vs. Debido</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byUser} barGap={4}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,.04)" }}
                  contentStyle={{ background: "#0c1024", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: any) => formatUSD(Number(v))}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar name="Pagado" dataKey="paid" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar name="Parte" dataKey="owed" fill="#f5c451" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="size-5 text-emerald-400" />
            <h2 className="font-semibold">Saldos y Liquidaciones</h2>
          </div>
          <div className="space-y-2">
            {balances.map((b) => (
              <div key={b.userId} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <Avatar name={userName(b.userId)} color={SEED_USERS.find((u) => u.id === b.userId)?.avatarColor} size={32} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{userName(b.userId)}</div>
                  <div className="text-xs text-muted-foreground">pagó {formatUSD(b.paid)} · parte {formatUSD(b.owed)}</div>
                </div>
                <div className={`board-font font-semibold ${b.net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {b.net >= 0 ? "recibe " : "debe "}{formatUSD(Math.abs(b.net))}
                </div>
              </div>
            ))}
          </div>
          {settlements.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Para saldar:</div>
              <div className="space-y-1.5">
                {settlements.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <TrendingUp className="size-4 text-gold-400" />
                    <span className="font-medium">{userName(s.fromId)}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{userName(s.toId)}</span>
                    <span className="ml-auto font-semibold text-gold-400">{formatUSD(s.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <ExchangeWidget />
      </div>
    </div>
  );
}
