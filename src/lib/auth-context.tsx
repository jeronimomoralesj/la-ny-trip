"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { SEED_USERS } from "./seed-data";
import type { AppUser } from "./types";

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  firebaseMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInAs: (userId: string) => void; // local demo mode
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);
const LS_KEY = "lanyviaje:currentUser";

function matchUser(email: string | null): AppUser | null {
  if (!email) return null;
  return SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        setUser(matchUser(fbUser?.email ?? null) ?? (fbUser ? {
          id: fbUser.uid, name: fbUser.displayName ?? "Traveler",
          email: fbUser.email ?? "", role: "member", avatarColor: "#3b82f6",
          initials: (fbUser.displayName ?? "T").slice(0, 2).toUpperCase(),
        } : null));
        setLoading(false);
      });
      return () => unsub();
    }
    // Local demo mode
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    }
    // Local demo: match by email, any password
    const u = matchUser(email);
    if (!u) throw new Error("Unknown email. Use one of the four trip accounts.");
    localStorage.setItem(LS_KEY, JSON.stringify(u));
    setUser(u);
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      return;
    }
    // Local demo: just sign in as a matching seed user if one exists
    const u = matchUser(email);
    if (u) {
      localStorage.setItem(LS_KEY, JSON.stringify(u));
      setUser(u);
    } else {
      throw new Error("Demo mode uses the four preset travelers — sign in instead.");
    }
  };

  const signInAs = (userId: string) => {
    const u = SEED_USERS.find((x) => x.id === userId);
    if (!u) return;
    localStorage.setItem(LS_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) await signOut(auth);
    localStorage.removeItem(LS_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, firebaseMode: isFirebaseConfigured, signIn, signUp, signInAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
