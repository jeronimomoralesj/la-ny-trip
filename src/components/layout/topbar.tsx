"use client";

import { useState } from "react";
import { Menu, LogOut, MapPin, Radio } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNow } from "@/hooks/use-now";
import { currentPhase } from "@/lib/trip";
import { Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  const now = useNow();
  const [menuOpen, setMenuOpen] = useState(false);
  const phase = now ? currentPhase(now) : null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-navy-950/70 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu}>
          <Menu className="size-5" />
        </Button>
        <div className="hidden items-center gap-2.5 sm:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <Radio className="size-4 text-emerald-400" />
          <span className="text-sm font-medium">
            {phase ? phase.label : "—"}
          </span>
          {phase && (
            <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
              <MapPin className="size-3" /> {phase.city}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <div className="board-font text-sm font-semibold tabular-nums">
            {now ? new Date(now).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Local time</div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-full p-0.5 transition hover:bg-white/5">
            <Avatar name={user?.name ?? "Guest"} color={user?.avatarColor} size={34} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="glass absolute right-0 top-12 z-50 w-52 rounded-2xl p-2">
                <div className="px-3 py-2">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                  <div className="mt-1 inline-flex rounded-full bg-electric-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-electric-400">
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
