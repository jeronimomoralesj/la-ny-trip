"use client";

import { useQuery } from "@tanstack/react-query";
import { SEED_WEATHER } from "@/lib/seed-data";
import type { WeatherSnapshot } from "@/lib/types";

const CITIES = [
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
];

/**
 * Weather Center data. Uses OpenWeather if a key is present, otherwise the
 * rich seed snapshots so the UI is always populated.
 */
export function useWeather() {
  const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
  return useQuery<WeatherSnapshot[]>({
    queryKey: ["weather", Boolean(key)],
    staleTime: 1000 * 60 * 15,
    queryFn: async () => {
      if (!key) return SEED_WEATHER;
      try {
        const results = await Promise.all(
          CITIES.map(async (c) => {
            const cur = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${c.lat}&lon=${c.lon}&units=metric&appid=${key}`).then((r) => r.json());
            const fc = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${c.lat}&lon=${c.lon}&units=metric&appid=${key}`).then((r) => r.json());
            const snap: WeatherSnapshot = {
              city: c.name,
              temp: Math.round(cur.main?.temp ?? 0),
              feelsLike: Math.round(cur.main?.feels_like ?? 0),
              condition: cur.weather?.[0]?.main ?? "—",
              icon: cur.weather?.[0]?.icon ?? "01d",
              humidity: cur.main?.humidity ?? 0,
              wind: Math.round((cur.wind?.speed ?? 0) * 3.6),
              hourly: (fc.list ?? []).slice(0, 8).map((h: any) => ({
                time: new Date(h.dt * 1000).toLocaleTimeString("en-US", { hour: "2-digit" }),
                temp: Math.round(h.main.temp), icon: h.weather[0].icon, condition: h.weather[0].main,
              })),
              daily: (fc.list ?? []).filter((_: any, i: number) => i % 8 === 0).slice(0, 5).map((d: any) => ({
                date: d.dt_txt.slice(0, 10), min: Math.round(d.main.temp_min), max: Math.round(d.main.temp_max),
                icon: d.weather[0].icon, condition: d.weather[0].main,
              })),
              alerts: [],
              recommendations: [],
            };
            return snap;
          }),
        );
        return results;
      } catch {
        return SEED_WEATHER;
      }
    },
  });
}
