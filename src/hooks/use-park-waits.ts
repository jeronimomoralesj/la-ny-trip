"use client";

import { useQuery } from "@tanstack/react-query";
import type { Park } from "@/lib/types";

export interface LiveRide {
  name: string;
  land: string;
  isOpen: boolean;
  wait: number;
}

/** Esperas en vivo (queue-times.com vía proxy /api/waits). */
export function useParkWaits(park: Park) {
  return useQuery<{ rides: LiveRide[]; source: string | null }>({
    queryKey: ["park-waits", park],
    staleTime: 1000 * 90,
    refetchInterval: 1000 * 120,
    queryFn: async () => {
      const res = await fetch(`/api/waits/${park}`);
      if (!res.ok) return { rides: [], source: null };
      return res.json();
    },
  });
}
