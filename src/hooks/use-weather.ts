"use client";

import { useQuery } from "@tanstack/react-query";
import { SEED_WEATHER } from "@/lib/seed-data";
import type { WeatherSnapshot } from "@/lib/types";

const CITIES = [
  { name: "Bogotá", lat: 4.711, lon: -74.0721 },
  { name: "Boston", lat: 42.3601, lon: -71.0589 },
  { name: "Los Ángeles", lat: 34.0522, lon: -118.2437 },
  { name: "Nueva York", lat: 40.7128, lon: -74.006 },
];

// WMO weather codes → condición en español + ícono estilo OpenWeather (reusa emoji()).
function fromCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Despejado", icon: "01d" };
  if (code === 1 || code === 2) return { condition: "Parcialmente nublado", icon: "02d" };
  if (code === 3) return { condition: "Nublado", icon: "04d" };
  if (code === 45 || code === 48) return { condition: "Niebla", icon: "50d" };
  if (code >= 51 && code <= 57) return { condition: "Llovizna", icon: "09d" };
  if (code >= 61 && code <= 67) return { condition: "Lluvia", icon: "10d" };
  if (code >= 71 && code <= 77) return { condition: "Nieve", icon: "13d" };
  if (code >= 80 && code <= 82) return { condition: "Chubascos", icon: "09d" };
  if (code === 85 || code === 86) return { condition: "Nieve", icon: "13d" };
  if (code >= 95) return { condition: "Tormenta", icon: "11d" };
  return { condition: "—", icon: "02d" };
}

function recommend(city: string, daily: WeatherSnapshot["daily"], maxNow: number): { alerts: WeatherSnapshot["alerts"]; recommendations: string[] } {
  const recs: string[] = [];
  const alerts: WeatherSnapshot["alerts"] = [];
  const rainyDay = daily.find((d) => ["09d", "10d", "11d"].includes(d.icon));
  if (rainyDay) {
    recs.push("Se espera lluvia — lleva paraguas");
    alerts.push({ title: "Posible lluvia", description: `Probabilidad de lluvia el ${rainyDay.date}. Lleva un paraguas compacto.` });
  }
  if (maxNow >= 26) recs.push("Lleva bloqueador y mantente hidratado");
  if (daily.some((d) => d.min <= 12)) recs.push("Lleva chaqueta para la noche");
  if (!recs.length) recs.push("Buen clima para salir");
  return { alerts, recommendations: recs };
}

/**
 * Centro del Clima — datos reales y gratuitos vía Open-Meteo (sin API key).
 * Si la red falla, usa los snapshots semilla para que la UI nunca quede vacía.
 */
export function useWeather() {
  return useQuery<WeatherSnapshot[]>({
    queryKey: ["weather", "open-meteo"],
    staleTime: 1000 * 60 * 15,
    queryFn: async () => {
      try {
        const results = await Promise.all(
          CITIES.map(async (c) => {
            const url =
              `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
              `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
              `&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min` +
              `&wind_speed_unit=kmh&timezone=auto&forecast_days=6`;
            const r = await fetch(url);
            if (!r.ok) throw new Error("weather fetch failed");
            const d = await r.json();

            const nowIso = d.current?.time as string;
            const hIdx = Math.max(0, (d.hourly?.time ?? []).indexOf(nowIso));
            const cur = fromCode(d.current?.weather_code ?? 0);

            const hourly = (d.hourly?.time ?? []).slice(hIdx, hIdx + 8).map((t: string, i: number) => {
              const code = d.hourly.weather_code[hIdx + i];
              return {
                time: new Date(t).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false }),
                temp: Math.round(d.hourly.temperature_2m[hIdx + i]),
                ...fromCode(code),
              };
            });

            const daily = (d.daily?.time ?? []).slice(0, 5).map((date: string, i: number) => ({
              date,
              min: Math.round(d.daily.temperature_2m_min[i]),
              max: Math.round(d.daily.temperature_2m_max[i]),
              ...fromCode(d.daily.weather_code[i]),
            }));

            const { alerts, recommendations } = recommend(c.name, daily, Math.round(d.current?.temperature_2m ?? 0));

            const snap: WeatherSnapshot = {
              city: c.name,
              temp: Math.round(d.current?.temperature_2m ?? 0),
              feelsLike: Math.round(d.current?.apparent_temperature ?? d.current?.temperature_2m ?? 0),
              condition: cur.condition,
              icon: cur.icon,
              humidity: Math.round(d.current?.relative_humidity_2m ?? 0),
              wind: Math.round(d.current?.wind_speed_10m ?? 0),
              hourly, daily, alerts, recommendations,
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
