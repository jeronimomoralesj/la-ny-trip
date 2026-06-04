"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SEED_USERS } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";

function prettyError(code: string): string {
  if (code.includes("email-already-in-use")) return "That email already has an account — sign in instead.";
  if (code.includes("invalid-email")) return "That doesn't look like a valid email.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Wrong email or password.";
  if (code.includes("operation-not-allowed")) return "Email/Password sign-in isn't enabled in Firebase yet.";
  if (code.includes("network")) return "Network error — check your connection.";
  return code.replace("auth/", "").replace(/-/g, " ");
}

export function Login() {
  const { signIn, signUp, signInAs, firebaseMode } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") await signUp(name, email, password);
      else await signIn(email, password);
    } catch (err: any) {
      setError(prettyError(err?.code ?? err?.message ?? "Failed"));
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
          {mode === "signup" && (
            <Input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          )}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <Input
            type="password"
            placeholder={mode === "signup" ? "Choose a password (6+ chars)" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={firebaseMode}
            minLength={mode === "signup" ? 6 : undefined}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Working…" : mode === "signup" ? "Create account" : "Enter Mission Control"} <ArrowRight className="size-4" />
          </Button>
        </form>

        {firebaseMode && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "First time here?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
              className="font-medium text-electric-400 hover:text-electric-300"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        )}

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
