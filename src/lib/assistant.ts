import { parseISO } from "date-fns";
import { nextEvent, computeBalances, computeSettlements } from "./trip";
import { SEED_USERS } from "./seed-data";
import { formatUSD, fmt } from "./utils";
import type { TimelineEvent, Expense, Flight, WeatherSnapshot, Photo, TravelGroup } from "./types";

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
const groupOf = (id: string): TravelGroup => SEED_USERS.find((u) => u.id === id)?.group ?? "bogota";

/**
 * Motor de intenciones (mock "IA") que lee los datos reales del viaje.
 * Arquitectura lista para LLM: reemplaza answer() por una llamada a un modelo
 * con el mismo objeto de contexto y definiciones de herramientas.
 */
export function answer(q: string, ctx: AssistantContext): string {
  const t = q.toLowerCase();
  const group = groupOf(ctx.userId);

  // Próximo en el itinerario
  if (/(próxim|proxim|siguiente|sigue|ahora|agenda|itinerar)/.test(t)) {
    const next = nextEvent(ctx.now, ctx.events, group);
    if (!next) return "No queda nada en el itinerario — el viaje terminó. ¡Bienvenido a casa! 🇨🇴";
    return `Lo siguiente: **${next.title}** en ${next.city}, ${fmt(parseISO(next.start), "EEEE d 'de' MMMM 'a las' h:mm a")}. ${next.description}`;
  }

  // Gastos
  if (/(cuánto|cuanto).*(gast)|gast(é|e|ado|amos)|presupuesto|plata|dinero/.test(t)) {
    const total = ctx.expenses.reduce((s, e) => s + e.amount, 0);
    const mine = ctx.expenses.filter((e) => e.payerId === ctx.userId).reduce((s, e) => s + e.amount, 0);
    return `El grupo ha gastado **${formatUSD(total)}** hasta ahora. Tú (${name(ctx.userId)}) has pagado **${formatUSD(mine)}**. Eso es alrededor de ${formatUSD(total / 4)} por persona si se divide en partes iguales.`;
  }

  // Quién le debe a quién
  if (/(debe|debo|deuda|saldar|saldo|cuenta)/.test(t)) {
    const balances = computeBalances(ctx.expenses, SEED_USERS.map((u) => u.id));
    const settlements = computeSettlements(balances);
    if (!settlements.length) return "Todos están a mano — no hay saldos pendientes. 🎉";
    const lines = settlements.map((s) => `• ${name(s.fromId)} → ${name(s.toId)}: ${formatUSD(s.amount)}`);
    return `Así quedan las cuentas:\n${lines.join("\n")}`;
  }

  // Clima
  if (/(clima|tiempo|lluvia|temperatura|calor|frío|frio|paraguas|bloqueador|sol)/.test(t)) {
    const city = /nueva york|ny/.test(t) ? "Nueva York"
      : /(los ángeles|los angeles|\bla\b)/.test(t) ? "Los Ángeles"
      : /boston/.test(t) ? "Boston"
      : /bogot/.test(t) ? "Bogotá" : null;
    const w = city ? ctx.weather.find((x) => x.city === city) : ctx.weather[0];
    if (!w) return "No tengo datos del clima ahora mismo.";
    const rec = w.recommendations[0] ? ` ${w.recommendations[0]}.` : "";
    return `${w.city}: **${w.temp}°C, ${w.condition}** (sensación ${w.feelsLike}°). La máxima de mañana es ~${w.daily[1]?.max ?? w.daily[0]?.max}°.${rec}`;
  }

  // Fotos / ubicación
  if (/(foto|imagen|dónde.*tom|donde.*tom|ubicad)/.test(t)) {
    const geo = ctx.photos.filter((p) => p.lat && p.lng);
    return `Hay **${ctx.photos.length} fotos** en el baúl, ${geo.length} con ubicación. Abre cualquier foto y toca "Mostrar dónde se tomó" para verla en el mapa.`;
  }

  // Vuelos
  if (/(vuelo|volar|puerta|terminal|sal|aeropuerto|avión|avion)/.test(t)) {
    const upcoming = [...ctx.flights]
      .filter((f) => +parseISO(f.departure) > ctx.now && (!f.group || f.group === "all" || f.group === group))
      .sort((a, b) => +parseISO(a.departure) - +parseISO(b.departure))[0];
    if (!upcoming) return "No hay vuelos próximos — ya aterrizaste para quedarte.";
    return `Próximo vuelo: **${upcoming.flightNumber}** (${upcoming.airline}) ${upcoming.from.code} → ${upcoming.to.code}, sale ${fmt(parseISO(upcoming.departure), "EEE d MMM 'a las' h:mm a")}. Puerta ${upcoming.gate ?? "por confirmar"}, terminal ${upcoming.terminal ?? "por confirmar"}.`;
  }

  // Elecciones
  if (/(vot|elecci|registr)/.test(t)) {
    return "Juan y Jeronimo aterrizan en Bogotá el 21 de junio y van directo a votar. Revisa el **Centro de Elecciones** para el conteo regresivo y la lista de pendientes — ¡no olviden la cédula en el equipaje de mano!";
  }

  return "Puedo ayudarte con el itinerario, gastos y saldos, clima, vuelos, fotos y el día de elecciones. Prueba: \"¿Qué sigue?\", \"¿Cuánto hemos gastado?\" o \"¿Quién le debe a quién?\"";
}

export const SUGGESTED = [
  "¿Qué sigue en el itinerario?",
  "¿Cuánto hemos gastado?",
  "¿Quién le debe a quién?",
  "¿Cómo está el clima en Nueva York?",
  "¿Cuándo es nuestro próximo vuelo?",
];
