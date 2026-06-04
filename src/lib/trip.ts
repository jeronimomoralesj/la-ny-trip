import { PHASES, SEED_TIMELINE, TRIP_START, TRIP_END } from "./seed-data";
import type { PhaseMeta, TimelineEvent, Expense, Balance, Settlement } from "./types";

export function currentPhase(nowMs: number): PhaseMeta {
  const active = PHASES.find(
    (p) => nowMs >= new Date(p.start).getTime() && nowMs <= new Date(p.end).getTime(),
  );
  if (active) return active;
  // before trip → first; after trip → last
  if (nowMs < new Date(TRIP_START).getTime()) return PHASES[0];
  return PHASES[PHASES.length - 1];
}

export function nextEvent(nowMs: number, events: TimelineEvent[] = SEED_TIMELINE): TimelineEvent | null {
  const upcoming = [...events]
    .filter((e) => new Date(e.start).getTime() > nowMs)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return upcoming[0] ?? null;
}

export function tripProgress(nowMs: number): number {
  const start = new Date(TRIP_START).getTime();
  const end = new Date(TRIP_END).getTime();
  return Math.min(100, Math.max(0, ((nowMs - start) / (end - start)) * 100));
}

// ── Expense math (Splitwise-killer) ───────────────────────────
export function computeBalances(expenses: Expense[], userIds: string[]): Balance[] {
  const paid: Record<string, number> = {};
  const owed: Record<string, number> = {};
  userIds.forEach((id) => {
    paid[id] = 0;
    owed[id] = 0;
  });

  for (const e of expenses) {
    paid[e.payerId] = (paid[e.payerId] ?? 0) + e.amount;
    const share = e.amount / (e.participantIds.length || 1);
    for (const pid of e.participantIds) owed[pid] = (owed[pid] ?? 0) + share;
  }

  return userIds.map((id) => ({
    userId: id,
    paid: paid[id] ?? 0,
    owed: owed[id] ?? 0,
    net: (paid[id] ?? 0) - (owed[id] ?? 0),
  }));
}

/** Greedy minimal settlement: who pays whom to zero everyone out. */
export function computeSettlements(balances: Balance[]): Settlement[] {
  const debtors = balances.filter((b) => b.net < -0.01).map((b) => ({ ...b }));
  const creditors = balances.filter((b) => b.net > 0.01).map((b) => ({ ...b }));
  debtors.sort((a, b) => a.net - b.net);
  creditors.sort((a, b) => b.net - a.net);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const amount = Math.min(-d.net, c.net);
    if (amount > 0.01) {
      settlements.push({ fromId: d.userId, toId: c.userId, amount: Math.round(amount * 100) / 100 });
      d.net += amount;
      c.net -= amount;
    }
    if (Math.abs(d.net) < 0.01) i++;
    if (Math.abs(c.net) < 0.01) j++;
  }
  return settlements;
}
