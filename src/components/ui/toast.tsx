"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType }

let counter = 0;
const listeners = new Set<(t: Toast) => void>();

/** Fire a toast from anywhere (hooks, mutations, components). */
export function notify(message: string, type: ToastType = "info") {
  const toast = { id: ++counter, message, type };
  listeners.forEach((l) => l(toast));
}

const ICON = { success: CheckCircle2, error: AlertTriangle, info: Info };
const COLOR = { success: "text-emerald-400", error: "text-red-400", info: "text-electric-400" };

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const add = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 5000);
    };
    listeners.add(add);
    return () => { listeners.delete(add); };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICON[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-blur pointer-events-auto flex items-start gap-3 rounded-2xl p-3.5 shadow-2xl"
            >
              <Icon className={`mt-0.5 size-5 shrink-0 ${COLOR[t.type]}`} />
              <p className="flex-1 text-sm">{t.message}</p>
              <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
