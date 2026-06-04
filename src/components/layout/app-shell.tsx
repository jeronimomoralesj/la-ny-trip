"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plane } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Login } from "@/components/auth/login";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="grid size-12 animate-pulse place-items-center rounded-2xl bg-gradient-to-br from-electric-500 to-gold-500">
            <Plane className="size-6 -rotate-45 text-navy-950" />
          </div>
          <p className="text-sm text-muted-foreground">Booting Mission Control…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-navy-950/50 backdrop-blur-xl lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-64 border-r border-white/10 bg-navy-900/95 backdrop-blur-2xl lg:hidden"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-muted-foreground/60">
          la-ny-viaje · built for the squad · Colombia → LA → NY · WC 2026
        </footer>
      </div>
    </div>
  );
}
