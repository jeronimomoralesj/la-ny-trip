"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { useExchange } from "@/hooks/use-exchange";
import { formatCOP, formatUSD } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function ExchangeWidget({ withChart = true }: { withChart?: boolean }) {
  const { data, isLoading } = useExchange();
  const rate = data?.rate ?? 4050;
  const [usd, setUsd] = useState("100");
  const [cop, setCop] = useState("500000");

  const onUsd = (v: string) => {
    setUsd(v);
    const n = parseFloat(v) || 0;
    setCop(Math.round(n * rate).toString());
  };
  const onCop = (v: string) => {
    setCop(v);
    const n = parseFloat(v) || 0;
    setUsd((n / rate).toFixed(2));
  };

  const chartData = useMemo(() => data?.history ?? [], [data]);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-gold-500/15">
            <ArrowRightLeft className="size-4 text-gold-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">USD → COP</div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {data?.live ? <Wifi className="size-3 text-emerald-400" /> : <WifiOff className="size-3 text-amber-400" />}
              {data?.live ? "Live rate" : "Offline estimate"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="board-font text-xl font-bold text-gold-400">
            {isLoading ? "…" : `$${Math.round(rate).toLocaleString()}`}
          </div>
          <div className="flex items-center justify-end gap-1 text-[11px] text-emerald-400">
            <TrendingUp className="size-3" /> per USD
          </div>
        </div>
      </div>

      {withChart && (
        <div className="-mx-2 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="copGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5c451" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f5c451" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: "#0c1024", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "COP/USD"]}
              />
              <Area type="monotone" dataKey="rate" stroke="#f5c451" strokeWidth={2} fill="url(#copGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div>
          <label className="text-[10px] uppercase tracking-wide text-muted-foreground">USD</label>
          <Input value={usd} onChange={(e) => onUsd(e.target.value)} inputMode="decimal" className="mt-1 h-9" />
        </div>
        <ArrowRightLeft className="mt-4 size-4 text-muted-foreground" />
        <div>
          <label className="text-[10px] uppercase tracking-wide text-muted-foreground">COP</label>
          <Input value={cop} onChange={(e) => onCop(e.target.value)} inputMode="decimal" className="mt-1 h-9" />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{formatUSD(parseFloat(usd) || 0)}</span>
        <span>{formatCOP(parseFloat(cop) || 0)}</span>
      </div>
    </div>
  );
}
