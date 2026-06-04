"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { NAV, NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-1 p-4">
      <Link href="/" onClick={onNavigate} className="mb-4 flex items-center gap-3 px-2 py-1">
        <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-electric-500 to-gold-500 shadow-lg shadow-electric-500/30">
          <Plane className="size-5 -rotate-45 text-navy-950" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight">la-ny-viaje</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Mundial 2026</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto no-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group}>
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
              {group}
            </div>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active ? "text-white" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-electric-500/15 ring-1 ring-electric-500/30"
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                      />
                    )}
                    <Icon className={cn("relative size-[18px]", active && "text-electric-400")} />
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
