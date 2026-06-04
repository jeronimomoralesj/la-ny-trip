"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";

export function Login() {
  const { signIn, signInAs, firebaseMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute -left-40 top-1/4 size-96 rounded-full bg-electric-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 size-96 rounded-full bg-gold-500/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass relative w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-electric-500 to-gold-500 shadow-lg shadow-electric-500/40">
            <Plane className="size-7 -rotate-45 text-navy-950" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gradient">la-ny-viaje</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Private travel operating system · World Cup 2026
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required={firebaseMode} autoComplete="current-password" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Enter Mission Control"} <ArrowRight className="size-4" />
          </Button>
        </form>

        {!firebaseMode && (
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-gold-400" /> Demo mode — tap a traveler to enter
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SEED_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => signInAs(u.id)}
                  className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition hover:bg-white/5"
                >
                  <Avatar name={u.name} color={u.avatarColor} size={40} />
                  <span className="text-[11px] font-medium">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
