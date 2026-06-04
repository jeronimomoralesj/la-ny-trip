import { NextResponse } from "next/server";

// Esperas en vivo desde queue-times.com (gratis, sin API key).
// Se hace server-side para evitar problemas de CORS en el navegador.

export const revalidate = 120; // cache 2 min

const PARK_NAMES: Record<string, string> = {
  disneyland: "Disneyland Park",
  "disney-california-adventure": "Disney California Adventure",
  "six-flags": "Six Flags Magic Mountain",
};

// IDs conocidos como respaldo si la búsqueda por nombre falla.
const FALLBACK_ID: Record<string, number> = {
  disneyland: 16,
  "disney-california-adventure": 17,
  "six-flags": 30,
};

async function resolveId(slug: string): Promise<number> {
  try {
    const res = await fetch("https://queue-times.com/parks.json", { next: { revalidate: 86400 } });
    if (res.ok) {
      const companies = await res.json();
      const target = PARK_NAMES[slug];
      for (const c of companies) {
        for (const p of c.parks ?? []) {
          if (p.name === target) return p.id;
        }
      }
    }
  } catch {
    /* usa fallback */
  }
  return FALLBACK_ID[slug];
}

export async function GET(_req: Request, { params }: { params: Promise<{ park: string }> }) {
  const { park } = await params;
  if (!PARK_NAMES[park]) return NextResponse.json({ error: "unknown park" }, { status: 404 });

  try {
    const id = await resolveId(park);
    const res = await fetch(`https://queue-times.com/parks/${id}/queue_times.json`, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error("upstream");
    const data = await res.json();
    const rides = (data.lands ?? []).flatMap((l: any) =>
      (l.rides ?? []).map((r: any) => ({
        name: r.name,
        land: l.name,
        isOpen: r.is_open,
        wait: r.wait_time,
      })),
    );
    // Algunos parques exponen rides sueltos fuera de "lands".
    (data.rides ?? []).forEach((r: any) => rides.push({ name: r.name, land: "", isOpen: r.is_open, wait: r.wait_time }));
    return NextResponse.json({ rides, source: "queue-times.com" });
  } catch {
    return NextResponse.json({ rides: [], source: null }, { status: 200 });
  }
}
