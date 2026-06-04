"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs, value, onChange, className,
}: {
  tabs: { id: string; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex max-w-full items-center gap-1 overflow-x-auto no-scrollbar rounded-2xl border border-white/10 bg-white/[0.03] p-1", className)}>
      {tabs.map((t) => {
        const active = t.id === value;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors",
              active ? "text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl bg-electric-500/20 ring-1 ring-electric-500/40"
                transition={{ type: "spring", damping: 28, stiffness: 360 }}
              />
            )}
            {Icon && <Icon className="relative size-4" />}
            <span className="relative whitespace-nowrap">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
