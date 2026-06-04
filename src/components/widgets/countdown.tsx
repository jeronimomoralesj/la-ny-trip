"use client";

import { useNow } from "@/hooks/use-now";
import { countdownTo, pad } from "@/lib/utils";

function FlipCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative grid h-16 w-14 place-items-center overflow-hidden rounded-xl border border-white/10 bg-navy-800/80 sm:h-20 sm:w-16">
        <div className="ticker pointer-events-none absolute inset-0 opacity-30" />
        <span className="board-font text-3xl font-bold text-gold-400 sm:text-4xl">{pad(value)}</span>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/40" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );
}

export function Countdown({ target, compact = false }: { target: string; compact?: boolean }) {
  const now = useNow();
  const c = now ? countdownTo(target, now) : { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };

  if (compact) {
    return (
      <span className="board-font font-semibold tabular-nums text-gold-400">
        {c.days}d {pad(c.hours)}h {pad(c.minutes)}m
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <FlipCell value={c.days} label="Days" />
      <span className="pb-5 text-2xl font-bold text-white/30">:</span>
      <FlipCell value={c.hours} label="Hrs" />
      <span className="pb-5 text-2xl font-bold text-white/30">:</span>
      <FlipCell value={c.minutes} label="Min" />
      <span className="pb-5 text-2xl font-bold text-white/30">:</span>
      <FlipCell value={c.seconds} label="Sec" />
    </div>
  );
}
