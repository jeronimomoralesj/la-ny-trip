"use client";

import {
  SEED_USERS, SEED_LOCATIONS, SEED_TIMELINE, SEED_FLIGHTS, SEED_EXPENSES,
  SEED_PHOTOS, SEED_DOCUMENTS, SEED_POSTS, SEED_CHECKLISTS, SEED_RIDES,
  SEED_FOOD, SEED_ELECTION_NOTES, SEED_ELECTION_TASKS, SEED_ANNOUNCEMENTS,
} from "./seed-data";

/**
 * Local-first store used when Firebase is not configured.
 * Seeds from the trip narrative, persists edits to localStorage so the
 * demo feels live across reloads. When Firebase IS configured the hooks
 * bypass this entirely and talk to Firestore.
 */
const SEED: Record<string, any[]> = {
  users: SEED_USERS,
  locations: SEED_LOCATIONS,
  timelineEvents: SEED_TIMELINE,
  flights: SEED_FLIGHTS,
  expenses: SEED_EXPENSES,
  photos: SEED_PHOTOS,
  documents: SEED_DOCUMENTS,
  posts: SEED_POSTS,
  checklists: SEED_CHECKLISTS,
  rides: SEED_RIDES,
  restaurants: SEED_FOOD,
  electionNotes: SEED_ELECTION_NOTES,
  electionTasks: SEED_ELECTION_TASKS,
  announcements: SEED_ANNOUNCEMENTS,
};

const KEY = (name: string) => `lanyviaje:${name}`;

function read<T>(name: string): T[] {
  if (typeof window === "undefined") return (SEED[name] ?? []) as T[];
  try {
    const raw = window.localStorage.getItem(KEY(name));
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    /* ignore */
  }
  const seed = (SEED[name] ?? []) as T[];
  write(name, seed);
  return seed;
}

function write<T>(name: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY(name), JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function uid() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export const localStore = {
  list<T>(name: string): T[] {
    return read<T>(name);
  },
  add<T extends { id?: string }>(name: string, item: T): T & { id: string } {
    const items = read<T & { id: string }>(name);
    const withId = { ...item, id: item.id || uid() } as T & { id: string };
    write(name, [withId, ...items]);
    return withId;
  },
  update<T extends { id: string }>(name: string, id: string, patch: Partial<T>): void {
    const items = read<T>(name);
    write(name, items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  },
  remove(name: string, id: string): void {
    const items = read<{ id: string }>(name);
    write(name, items.filter((it) => it.id !== id));
  },
  reset() {
    if (typeof window === "undefined") return;
    Object.keys(SEED).forEach((name) => window.localStorage.removeItem(KEY(name)));
  },
};
