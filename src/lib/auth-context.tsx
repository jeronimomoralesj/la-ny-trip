"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, updateProfile, signInAnonymously,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { SEED_USERS } from "./seed-data";
import type { AppUser } from "./types";

interface AuthState {
  user: AppUser | null;        // always set once loaded (guest or named)
  isGuest: boolean;            // true = anonymous viewer, not a finance account
  loading: boolean;
  firebaseMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInAs: (userId: string) => void; // local demo mode
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);
const LS_KEY = "lanyviaje:currentUser";

const GUEST: AppUser = {
  id: "guest", name: "Guest", email: "", role: "member", avatarColor: "#64748b", initials: "G",
};

function matchUser(email: string | null): AppUser | null {
  if (!email) return null;
  return SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (!fbUser) {
          // Nobody signed in → sign in anonymously so guests can view & upload.
          signInAnonymously(auth!).catch(() => {
            // Anonymous auth disabled in console → still let them view as guest.
            setUser(GUEST);
            setIsGuest(true);
            setLoading(false);
          });
          return;
        }
        if (fbUser.isAnonymous) {
          setUser({ ...GUEST, id: fbUser.uid });
          setIsGuest(true);
        } else {
          const named = matchUser(fbUser.email ?? null) ?? {
            id: fbUser.uid,
            name: fbUser.displayName ?? "Traveler",
            email: fbUser.email ?? "",
            role: "member" as const,
            avatarColor: "#3b82f6",
            initials: (fbUser.displayName ?? "T").slice(0, 2).toUpperCase(),
          };
          setUser(named);
          setIsGuest(false);
        }
        setLoading(false);
      });
      return () => unsub();
    }

    // ── Local demo mode (no Firebase) ──────────────────────────
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
        setIsGuest(false);
      } else {
        setUser(GUEST);
        setIsGuest(true);
      }
    } catch {
      setUser(GUEST);
      setIsGuest(true);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    }
    const u = matchUser(email);
    if (!u) throw new Error("Unknown email. Use one of the four trip accounts.");
    localStorage.setItem(LS_KEY, JSON.stringify(u));
    setUser(u);
    setIsGuest(false);
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      return;
    }
    const u = matchUser(email);
    if (u) {
      localStorage.setItem(LS_KEY, JSON.stringify(u));
      setUser(u);
      setIsGuest(false);
    } else {
      throw new Error("Demo mode uses the four preset travelers — sign in instead.");
    }
  };

  const signInAs = (userId: string) => {
    const u = SEED_USERS.find((x) => x.id === userId);
    if (!u) return;
    localStorage.setItem(LS_KEY, JSON.stringify(u));
    setUser(u);
    setIsGuest(false);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth); // onAuthStateChanged re-signs in anonymously → back to guest
      return;
    }
    localStorage.removeItem(LS_KEY);
    setUser(GUEST);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, firebaseMode: isFirebaseConfigured, signIn, signUp, signInAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
