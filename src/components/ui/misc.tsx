"use client";

import * as React from "react";
import { cn, initials as toInitials } from "@/lib/utils";

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({
  name, color, size = 36, className,
}: { name: string; color?: string; size?: number; className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-full font-semibold text-white shadow-inner", className)}
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${color ?? "#3b82f6"}, ${color ?? "#3b82f6"}99)`,
      }}
      title={name}
    >
      {toInitials(name)}
    </div>
  );
}

// ── Progress ──────────────────────────────────────────────────
export function Progress({
  value, className, barClassName,
}: { value: number; className?: string; barClassName?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r from-electric-500 to-gold-400 transition-all duration-700", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-white/5", className)} />;
}

// ── Section heading ───────────────────────────────────────────
export function SectionTitle({
  eyebrow, title, action,
}: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-electric-400/80">
            {eyebrow}
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      </div>
      {action && <div className="min-w-0 max-w-full">{action}</div>}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
export function EmptyState({
  icon: Icon, title, hint,
}: { icon?: React.ComponentType<{ className?: string }>; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-12 text-center">
      {Icon && <Icon className="size-8 text-muted-foreground/50" />}
      <p className="font-medium text-muted-foreground">{title}</p>
      {hint && <p className="max-w-xs text-sm text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

// ── Stat tile ─────────────────────────────────────────────────
export function Stat({
  label, value, sub, accent = "#3b82f6",
}: { label: string; value: React.ReactNode; sub?: string; accent?: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold board-font" style={{ color: accent }}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground/70">{sub}</div>}
    </div>
  );
}
