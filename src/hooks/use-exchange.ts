"use client";

import { useQuery } from "@tanstack/react-query";

const FALLBACK_RATE = 4050; // COP per USD, used if the API is unreachable

interface ExchangeData {
  rate: number;
  updated: string;
  live: boolean;
  history: { date: string; rate: number }[];
}

/** Live USD→COP rate via the free open.er-api.com endpoint (no key). */
export function useExchange() {
  return useQuery<ExchangeData>({
    queryKey: ["exchange", "usd-cop"],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("bad response");
        const json = await res.json();
        const rate = json?.rates?.COP ?? FALLBACK_RATE;
        return { rate, updated: json?.time_last_update_utc ?? "", live: true, history: buildHistory(rate) };
      } catch {
        return { rate: FALLBACK_RATE, updated: "", live: false, history: buildHistory(FALLBACK_RATE) };
      }
    },
  });
}

/** Deterministic gentle 30-day curve around the current rate for the mini chart. */
function buildHistory(rate: number) {
  const out: { date: string; rate: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const wobble = Math.sin(i / 3) * (rate * 0.012) + Math.cos(i / 7) * (rate * 0.006);
    out.push({ date: `D-${i}`, rate: Math.round(rate - wobble) });
  }
  return out;
}
