"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plane } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="grid size-12 animate-pulse place-items-center rounded-2xl bg-gradient-to-br from-electric-500 to-gold-500">
            <Plane className="size-6 -rotate-45 text-navy-950" />
          </div>
          <p className="text-sm text-muted-foreground">Iniciando Centro de Mando…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-navy-950/95 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer — single keyed child so AnimatePresence always unmounts it */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-sidebar"
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="absolute left-0 top-0 h-full w-64 border-r border-white/10 bg-navy-900/95 backdrop-blur-2xl"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-muted-foreground/60">
la-ny-viaje · hecho para el escuadrón · Colombia → LA → NY · Mundial 2026
        </footer>
      </div>
    </div>
  );
}
