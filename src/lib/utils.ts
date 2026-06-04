import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, type FormatOptions } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** date-fns format with the Spanish locale baked in. */
export function fmt(date: Date | number | string, pattern: string, opts?: FormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, { locale: es, ...opts });
}

export function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatCOP(amount: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Returns a human countdown object to a target ISO time. */
export function countdownTo(targetIso: string, nowMs: number) {
  const diff = new Date(targetIso).getTime() - nowMs;
  const clamped = Math.max(0, diff);
  const days = Math.floor(clamped / 86_400_000);
  const hours = Math.floor((clamped % 86_400_000) / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff <= 0, diff };
}

export function pad(n: number) {
  return n.toString().padStart(2, "0");
}
