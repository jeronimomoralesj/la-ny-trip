import { format, parseISO } from "date-fns";
import { nextEvent } from "./trip";
import { computeBalances, computeSettlements } from "./trip";
import { SEED_USERS } from "./seed-data";
import { formatUSD } from "./utils";
import type { TimelineEvent, Expense, Flight, WeatherSnapshot, Photo } from "./types";

export interface AssistantContext {
  now: number;
  events: TimelineEvent[];
  expenses: Expense[];
  flights: Flight[];
  weather: WeatherSnapshot[];
  photos: Photo[];
  userId: string;
}

const name = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;

/**
 * Rule-based intent router. This is a mock "AI" that reads live trip data so
 * answers are real. The interface is future-ready: swap `answer()` for a call
 * to an LLM with the same context object and tool definitions.
 */
export function answer(q: string, ctx: AssistantContext): string {
  const t = q.toLowerCase();

  // Next on itinerary
  if (/(next|upcoming|after this|what.*now|schedule)/.test(t)) {
    const next = nextEvent(ctx.now, ctx.events);
    if (!next) return "Nothing left on the itinerary — the trip is complete. Welcome home! 🇨🇴";
    return `Next up: **${next.title}** in ${next.city}, ${format(parseISO(next.start), "EEEE d MMM 'at' h:mm a")}. ${next.description}`;
  }

  // Spending
  if (/(how much.*spent|my spend|total spend|spending|budget)/.test(t)) {
    const total = ctx.expenses.reduce((s, e) => s + e.amount, 0);
    const mine = ctx.expenses.filter((e) => e.payerId === ctx.userId).reduce((s, e) => s + e.amount, 0);
    return `The squad has spent **${formatUSD(total)}** so far. You (${name(ctx.userId)}) have personally paid **${formatUSD(mine)}** of that. That's about ${formatUSD(total / 4)} per person if split evenly.`;
  }

  // Who owes who
  if (/(owe|owes|settle|balance|debt)/.test(t)) {
    const balances = computeBalances(ctx.expenses, SEED_USERS.map((u) => u.id));
    const settlements = computeSettlements(balances);
    if (!settlements.length) return "Everyone's square — no outstanding balances. 🎉";
    const lines = settlements.map((s) => `• ${name(s.fromId)} → ${name(s.toId)}: ${formatUSD(s.amount)}`);
    return `Here's how to settle up:\n${lines.join("\n")}`;
  }

  // Weather
  if (/(weather|rain|temperature|hot|cold|umbrella|sunscreen)/.test(t)) {
    const city = t.includes("new york") || t.includes("ny") ? "New York" : t.includes("la") || t.includes("angeles") ? "Los Angeles" : null;
    const w = city ? ctx.weather.find((x) => x.city === city) : ctx.weather[0];
    if (!w) return "I don't have weather data right now.";
    const rec = w.recommendations[0] ? ` ${w.recommendations[0]}.` : "";
    return `${w.city}: **${w.temp}°C, ${w.condition}** (feels ${w.feelsLike}°). Tomorrow's high is ~${w.daily[1]?.max ?? w.daily[0]?.max}°.${rec}`;
  }

  // Photos / location
  if (/(photo|picture|where.*taken|located)/.test(t)) {
    const geo = ctx.photos.filter((p) => p.lat && p.lng);
    return `There are **${ctx.photos.length} photos** in the vault, ${geo.length} of them geotagged. Open any photo and tap "Show where this was taken" to see it on the map.`;
  }

  // Flights
  if (/(flight|fly|gate|terminal|depart|airport)/.test(t)) {
    const upcoming = [...ctx.flights].filter((f) => +parseISO(f.departure) > ctx.now).sort((a, b) => +parseISO(a.departure) - +parseISO(b.departure))[0];
    if (!upcoming) return "No upcoming flights — you've landed for good.";
    return `Next flight: **${upcoming.flightNumber}** (${upcoming.airline}) ${upcoming.from.code} → ${upcoming.to.code}, departing ${format(parseISO(upcoming.departure), "EEE d MMM 'at' h:mm a")}. Gate ${upcoming.gate ?? "TBA"}, terminal ${upcoming.terminal ?? "TBA"}.`;
  }

  // Election
  if (/(vote|election|voting|registr)/.test(t)) {
    return "You land in Bogotá on June 21 and head straight to vote. Check the **Election Hub** for your countdown and checklist — don't forget your cédula in your carry-on!";
  }

  return "I can help with the itinerary, spending & balances, weather, flights, photos, and election day. Try: \"What's next?\", \"How much have we spent?\", or \"Who owes who?\"";
}

export const SUGGESTED = [
  "What's next on the itinerary?",
  "How much have we spent?",
  "Who owes who money?",
  "What's the weather in New York?",
  "When's our next flight?",
];
