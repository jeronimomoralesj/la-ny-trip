import type {
  AppUser,
  PhaseMeta,
  TripLocation,
  TimelineEvent,
  Flight,
  Expense,
  Photo,
  TravelDocument,
  FeedPost,
  ChecklistItem,
  Ride,
  FoodEntry,
  WeatherSnapshot,
  ElectionNote,
  ElectionTask,
  Announcement,
} from "./types";

// ──────────────────────────────────────────────────────────────
//  Narrativa del viaje — Mundial 2026.  Viaje: 8–21 jun 2026.
//  Dos grupos hasta Los Ángeles:
//    • Bogotá → Panamá → LA   (Juan, Jeronimo)
//    • Boston → LA            (Mateo, Valeria)  — llegan 11:55 pm
//  Desde LA, todos juntos: LA → Nueva York → regreso a casa.
// ──────────────────────────────────────────────────────────────

/**
 * El viaje es de 4 personas fijas. Si alguien inicia sesión con un correo que
 * no es de los 4, su id sería el UID de Firebase y la atribución (gastos,
 * fotos, etc.) no cuadraría con los filtros. Esto siempre resuelve a un viajero.
 */
export function resolveTravelerId(id?: string | null): string {
  return SEED_USERS.some((u) => u.id === id) ? (id as string) : "jeronimo";
}

export const SEED_USERS: AppUser[] = [
  { id: "jeronimo", name: "Jeronimo", email: "jeronimo@lanyviaje.com", role: "admin", avatarColor: "#3b82f6", initials: "JE", group: "bogota" },
  { id: "juan", name: "Juan", email: "juan@lanyviaje.com", role: "member", avatarColor: "#22d3ee", initials: "JU", group: "bogota" },
  { id: "mateo", name: "Mateo", email: "mateo@lanyviaje.com", role: "member", avatarColor: "#f5c451", initials: "MA", group: "boston" },
  { id: "valeria", name: "Valeria", email: "valeria@lanyviaje.com", role: "member", avatarColor: "#a78bfa", initials: "VA", group: "boston" },
];

export const TRIP_START = "2026-06-12T14:30:00-05:00";
export const TRIP_END = "2026-06-21T23:59:59-05:00";
export const ELECTION_DAY = "2026-06-21T13:00:00-05:00";

// Hogares de cada grupo (para la fase de preparativos)
export const HOME_CITY: Record<"bogota" | "boston", string> = {
  bogota: "Bogotá",
  boston: "Boston",
};

export const PHASES: PhaseMeta[] = [
  { id: "pre-departure", label: "Preparativos", city: "Bogotá", start: "2026-05-01T00:00:00-05:00", end: "2026-06-12T14:30:00-05:00", accent: "#64748b" },
  { id: "traveling-to-la", label: "Rumbo a Los Ángeles", city: "En tránsito", start: "2026-06-12T14:30:00-05:00", end: "2026-06-13T00:00:00-07:00", accent: "#3b82f6" },
  { id: "la-operations", label: "Operaciones Los Ángeles", city: "Los Ángeles", start: "2026-06-13T00:00:00-07:00", end: "2026-06-17T07:00:00-07:00", accent: "#f5c451" },
  { id: "disneyland-day", label: "Disneyland + California Adventure", city: "Anaheim", start: "2026-06-16T07:00:00-07:00", end: "2026-06-16T23:00:00-07:00", accent: "#ec4899" },
  { id: "traveling-to-ny", label: "Rumbo a Nueva York", city: "En tránsito", start: "2026-06-17T07:00:00-07:00", end: "2026-06-17T18:00:00-04:00", accent: "#3b82f6" },
  { id: "ny-operations", label: "Operaciones Nueva York", city: "Nueva York", start: "2026-06-17T18:00:00-04:00", end: "2026-06-21T07:00:00-04:00", accent: "#22d3ee" },
  { id: "return-to-colombia", label: "Regreso a casa", city: "En tránsito", start: "2026-06-21T07:00:00-04:00", end: "2026-06-21T12:25:00-05:00", accent: "#3b82f6" },
  { id: "election-day", label: "Día de Elecciones — ¡A votar!", city: "Bogotá", start: "2026-06-21T12:25:00-05:00", end: "2026-06-21T23:59:00-05:00", accent: "#22c55e" },
];

export const SEED_LOCATIONS: TripLocation[] = [
  { id: "bog", name: "El Dorado (BOG)", description: "Aeropuerto de salida — Bogotá", category: "airport", city: "Bogotá", lng: -74.1469, lat: 4.7016 },
  { id: "pty", name: "Tocumen (PTY)", description: "Escala en Panamá", category: "airport", city: "Panamá", lng: -79.3835, lat: 9.0714 },
  { id: "bos", name: "Logan (BOS)", description: "Aeropuerto de salida — Boston", category: "airport", city: "Boston", lng: -71.0096, lat: 42.3656 },
  { id: "lax", name: "Los Ángeles (LAX)", description: "Punto de encuentro en California", category: "airport", city: "Los Ángeles", lng: -118.4085, lat: 33.9416 },
  { id: "jfk", name: "John F. Kennedy (JFK)", description: "Llegada a Nueva York", category: "airport", city: "Nueva York", lng: -73.7781, lat: 40.6413 },
  { id: "la-hotel", name: "Hotel — Downtown LA", description: "Base del grupo en Los Ángeles", category: "hotel", city: "Los Ángeles", lng: -118.2509, lat: 34.0489 },
  { id: "ny-hotel", name: "Casa del primo (Manhattan)", description: "Alojamiento en Nueva York — donde el primo", category: "family", city: "Nueva York", lng: -73.9845, lat: 40.7549 },
  { id: "disneyland", name: "Disneyland Park", description: "Día de parque — Anaheim", category: "theme-park", city: "Anaheim", lng: -117.9189, lat: 33.8121 },
  { id: "sixflags", name: "Six Flags Magic Mountain", description: "Capital de las montañas rusas — Valencia", category: "theme-park", city: "Valencia", lng: -118.5953, lat: 34.4253 },
  { id: "sofi", name: "SoFi Stadium", description: "Partidos del Mundial — Inglewood", category: "stadium", city: "Los Ángeles", lng: -118.3392, lat: 33.9535 },
  { id: "metlife", name: "MetLife Stadium", description: "Sede de la Final — NJ", category: "stadium", city: "Nueva York", lng: -74.0745, lat: 40.8135 },
  { id: "la-fanfest", name: "Fan Festival LA", description: "FIFA Fan Fest — Exposition Park", category: "fan-fest", city: "Los Ángeles", lng: -118.2872, lat: 34.0169 },
  { id: "ny-fanfest", name: "Fan Festival NYC", description: "FIFA Fan Fest — Liberty State Park", category: "fan-fest", city: "Nueva York", lng: -74.0539, lat: 40.7058 },
  { id: "santa-monica", name: "Muelle de Santa Mónica", description: "Atardecer y mar", category: "landmark", city: "Los Ángeles", lng: -118.4977, lat: 34.0094 },
  { id: "times-square", name: "Times Square", description: "El corazón de neón de Manhattan", category: "landmark", city: "Nueva York", lng: -73.9855, lat: 40.758 },
  { id: "guelaguetza", name: "Guelaguetza", description: "Mole oaxaqueño legendario", category: "restaurant", city: "Los Ángeles", lng: -118.2935, lat: 34.0577 },
  { id: "joes-pizza", name: "Joe's Pizza", description: "La porción clásica del Village", category: "restaurant", city: "Nueva York", lng: -74.0027, lat: 40.7305 },
  { id: "la-parking", name: "SoFi Lote C", description: "Parqueadero día de partido", category: "parking", city: "Los Ángeles", lng: -118.337, lat: 33.951 },
];

const loc = (id: string) => SEED_LOCATIONS.find((l) => l.id === id)!;

export const SEED_TIMELINE: TimelineEvent[] = [
  // ── 12 jun · Salida hacia Los Ángeles ───────────────────────
  { id: "t-a1", group: "bogota", day: "2026-06-12", city: "Bogotá", phase: "traveling-to-la", title: "Vuelo BOG → PTY (Copa)", description: "Salida de El Dorado rumbo a la escala en Panamá (Copa, reserva ADUTDZ).", start: "2026-06-12T14:30:00-05:00", end: "2026-06-12T16:40:00-05:00", locationId: "bog", lng: loc("bog").lng, lat: loc("bog").lat, notes: "Llegar al aeropuerto 3h antes.", icon: "Plane" },
  { id: "t-a2", group: "bogota", day: "2026-06-12", city: "Panamá", phase: "traveling-to-la", title: "Escala en Panamá + vuelo a LAX", description: "Conexión en Tocumen y vuelo final a Los Ángeles.", start: "2026-06-12T18:10:00-05:00", end: "2026-06-12T23:05:00-07:00", locationId: "pty", lng: loc("pty").lng, lat: loc("pty").lat, notes: "Llegada a LAX 11:05 pm.", icon: "Plane" },
  { id: "t-b1", group: "boston", day: "2026-06-12", city: "Boston", phase: "traveling-to-la", title: "Vuelo BOS → LAX", description: "Mateo y Valeria salen de Boston directo a Los Ángeles.", start: "2026-06-12T20:30:00-04:00", end: "2026-06-12T23:55:00-07:00", locationId: "bos", lng: loc("bos").lng, lat: loc("bos").lat, notes: "Llegan 11:55 pm — un poco después del grupo de Bogotá.", icon: "Plane" },
  { id: "d12-arrive", group: "all", day: "2026-06-12", city: "Los Ángeles", phase: "la-operations", title: "Llegada a LAX + recoger SUV", description: "Recoger el vehículo compartido (Chevrolet Trax o SUV similar). El alquiler lo cubre el hermano; cada uno aporta 1/4 de gasolina y parqueo.", start: "2026-06-12T23:20:00-07:00", end: "2026-06-13T00:30:00-07:00", locationId: "lax", lng: loc("lax").lng, lat: loc("lax").lat, notes: "Aporte personal estimado: ~$25 (gasolina + parqueo).", icon: "Car" },

  // ── 13 jun · World Cup Fan Fest (LA) ────────────────────────
  { id: "d13-0", group: "all", day: "2026-06-13", city: "Los Ángeles", phase: "la-operations", suggested: true, title: "Mañana: The Broad + Walt Disney Concert Hall", description: "Sugerencia: museo de arte contemporáneo (entrada gratis) y la icónica fachada de Frank Gehry en Downtown.", start: "2026-06-13T09:30:00-07:00", end: "2026-06-13T11:45:00-07:00", lng: -118.2506, lat: 34.0544, icon: "Landmark" },
  { id: "d13-1", group: "all", day: "2026-06-13", city: "Los Ángeles", phase: "la-operations", suggested: true, title: "Almuerzo en Grand Central Market", description: "Sugerencia: clásico mercado gastronómico del Downtown.", start: "2026-06-13T12:00:00-07:00", end: "2026-06-13T13:30:00-07:00", lng: -118.2489, lat: 34.0506, icon: "Utensils" },
  { id: "d13-2", group: "all", day: "2026-06-13", city: "Los Ángeles", phase: "la-operations", title: "World Cup Fan Fest (LA)", description: "Zonas del fan festival del Mundial en Los Ángeles. Entrada $10 (pagada).", start: "2026-06-13T14:00:00-07:00", end: "2026-06-13T20:00:00-07:00", locationId: "la-fanfest", lng: loc("la-fanfest").lng, lat: loc("la-fanfest").lat, notes: "Presupuesto discrecional ~$50.", icon: "PartyPopper" },
  { id: "d13-3", group: "all", day: "2026-06-13", city: "Los Ángeles", phase: "la-operations", suggested: true, title: "Noche: Arts District (murales + rooftop)", description: "Sugerencia: cerrar el día con los murales del Arts District y un rooftop con vista al skyline de DTLA.", start: "2026-06-13T20:30:00-07:00", end: "2026-06-13T22:00:00-07:00", lng: -118.2347, lat: 34.0407, icon: "Sunset" },

  // ── 14 jun · Six Flags Magic Mountain ───────────────────────
  { id: "d14-1", group: "all", day: "2026-06-14", city: "Valencia", phase: "la-operations", title: "Six Flags Magic Mountain", description: "Día de montañas rusas con Fast Lane activo: X2, Twisted Colossus, Tatsu, Full Throttle y más. Mira la Ruta en Parques.", start: "2026-06-14T10:00:00-07:00", end: "2026-06-14T21:00:00-07:00", locationId: "sixflags", lng: loc("sixflags").lng, lat: loc("sixflags").lat, notes: "Fast Lane activo. ~1h15 desde Downtown LA.", icon: "Rocket" },

  // ── 15 jun · Día libre LA (sugerencias) ─────────────────────
  { id: "d15-1", group: "all", day: "2026-06-15", city: "Los Ángeles", phase: "la-operations", suggested: true, title: "Venice Beach + canales", description: "Sugerencia: playa, boardwalk, Muscle Beach y los canales de Venice.", start: "2026-06-15T10:00:00-07:00", end: "2026-06-15T13:00:00-07:00", lng: -118.4695, lat: 33.985, icon: "Waves" },
  { id: "d15-2", group: "all", day: "2026-06-15", city: "Los Ángeles", phase: "la-operations", suggested: true, title: "Muelle de Santa Mónica + almuerzo", description: "Sugerencia: rueda de la fortuna y almuerzo frente al mar.", start: "2026-06-15T13:00:00-07:00", end: "2026-06-15T15:00:00-07:00", locationId: "santa-monica", lng: loc("santa-monica").lng, lat: loc("santa-monica").lat, icon: "Sunset" },
  { id: "d15-3", group: "all", day: "2026-06-15", city: "Los Ángeles", phase: "la-operations", suggested: true, title: "Hollywood Blvd + Paseo de la Fama", description: "Sugerencia: Walk of Fame, TCL Chinese Theatre y Dolby Theatre.", start: "2026-06-15T15:30:00-07:00", end: "2026-06-15T17:30:00-07:00", lng: -118.3287, lat: 34.1016, icon: "Camera" },
  { id: "d15-4", group: "all", day: "2026-06-15", city: "Los Ángeles", phase: "la-operations", suggested: true, title: "Atardecer en Griffith Observatory", description: "Sugerencia: el mejor skyline de LA + letrero de Hollywood al atardecer.", start: "2026-06-15T18:30:00-07:00", end: "2026-06-15T20:30:00-07:00", lng: -118.3004, lat: 34.1184, icon: "Sunset" },

  // ── 16 jun · PARK HOP: Disneyland Park → Disney California Adventure ──
  { id: "d16-1", group: "all", day: "2026-06-16", city: "Anaheim", phase: "disneyland-day", title: "Disneyland Park — apertura (rope drop)", description: "Empezamos con la apertura para aprovechar las filas bajas. Parkhopper activo. Mira la Ruta en Parques.", start: "2026-06-16T07:30:00-07:00", end: "2026-06-16T13:30:00-07:00", locationId: "disneyland", lng: loc("disneyland").lng, lat: loc("disneyland").lat, notes: "Parkhopper activo. Lightning Lane para Rise of the Resistance.", icon: "Castle" },
  { id: "d16-2", group: "all", day: "2026-06-16", city: "Anaheim", phase: "disneyland-day", title: "Park hop → Disney California Adventure", description: "Cruzamos a DCA en la tarde (los parques están uno frente al otro): Radiator Springs Racers, Avengers Campus, Pixar Pier y Cars Land de noche.", start: "2026-06-16T14:00:00-07:00", end: "2026-06-16T22:00:00-07:00", lng: -117.9209, lat: 33.8064, notes: "World of Color al cierre.", icon: "Sparkles" },

  // ── 17 jun · Vuelo a Nueva York ─────────────────────────────
  { id: "d17-1", group: "all", day: "2026-06-17", city: "Los Ángeles", phase: "traveling-to-ny", title: "Vuelo LAX → JFK (JetBlue 524)", description: "Salto transcontinental a Nueva York. Sale 7:25 am, llega 4:05 pm (reserva KMXMWW).", start: "2026-06-17T07:25:00-07:00", end: "2026-06-17T16:05:00-04:00", locationId: "lax", lng: loc("lax").lng, lat: loc("lax").lat, icon: "Plane" },
  { id: "d17-2", group: "all", day: "2026-06-17", city: "Nueva York", phase: "ny-operations", title: "Llegada + casa del primo", description: "Transporte a la casa del primo (alojamiento gratis), dejar maletas y MetroCard de 7 días para el metro.", start: "2026-06-17T17:00:00-04:00", end: "2026-06-17T18:30:00-04:00", locationId: "ny-hotel", lng: loc("ny-hotel").lng, lat: loc("ny-hotel").lat, notes: "MetroCard 7 días ilimitado: $34.", icon: "Building2" },
  { id: "d17-3", group: "all", day: "2026-06-17", city: "Nueva York", phase: "ny-operations", title: "Fan Fest del partido de Colombia (NY)", description: "¡Colombia juega el mismo día que llegamos! Vamos directo al fan festival a ver el partido de la Selección. 🇨🇴", start: "2026-06-17T19:00:00-04:00", end: "2026-06-17T23:00:00-04:00", locationId: "ny-fanfest", lng: loc("ny-fanfest").lng, lat: loc("ny-fanfest").lat, notes: "Entrada hasta $30 · presupuesto discrecional ~$50.", icon: "Trophy" },

  // ── 18 jun · Día de museos en NY (sugerencias) ──────────────
  { id: "d18-1", group: "all", day: "2026-06-18", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Brunch + The High Line", description: "Sugerencia: brunch en Chelsea y caminar el parque elevado High Line.", start: "2026-06-18T10:00:00-04:00", end: "2026-06-18T12:00:00-04:00", lng: -74.0048, lat: 40.748, icon: "Coffee" },
  { id: "d18-2", group: "all", day: "2026-06-18", city: "Nueva York", phase: "ny-operations", suggested: true, title: "The Metropolitan Museum of Art (The Met)", description: "Sugerencia: el museo más grande de EE.UU. — arte de todas las épocas. Fácil pasar 2–3 horas.", start: "2026-06-18T12:45:00-04:00", end: "2026-06-18T15:30:00-04:00", lng: -73.9632, lat: 40.7794, icon: "Landmark" },
  { id: "d18-3", group: "all", day: "2026-06-18", city: "Nueva York", phase: "ny-operations", suggested: true, title: "MoMA o Museo de Historia Natural", description: "Sugerencia: otra dosis de museo — arte moderno en el MoMA o dinosaurios en el Natural History.", start: "2026-06-18T16:00:00-04:00", end: "2026-06-18T18:00:00-04:00", lng: -73.9776, lat: 40.7614, icon: "Landmark" },
  { id: "d18-4", group: "all", day: "2026-06-18", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Noche en Greenwich Village + Soho", description: "Sugerencia: pasear el Village, tiendas en Soho y cena casual.", start: "2026-06-18T18:30:00-04:00", end: "2026-06-18T21:00:00-04:00", lng: -74.0027, lat: 40.7305, icon: "ShoppingBag" },

  // ── 19 jun · Día libre NY (sugerencias) ─────────────────────
  { id: "d19-1", group: "all", day: "2026-06-19", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Estatua de la Libertad + Ellis Island", description: "Sugerencia: ferry temprano desde Battery Park.", start: "2026-06-19T09:30:00-04:00", end: "2026-06-19T12:30:00-04:00", lng: -74.0445, lat: 40.6892, icon: "Ship" },
  { id: "d19-2", group: "all", day: "2026-06-19", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Memorial y Museo del 9/11", description: "Sugerencia: las piscinas memoriales y One World Observatory.", start: "2026-06-19T14:00:00-04:00", end: "2026-06-19T16:30:00-04:00", lng: -74.0134, lat: 40.7115, icon: "Landmark" },
  { id: "d19-3", group: "all", day: "2026-06-19", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Puente de Brooklyn al atardecer", description: "Sugerencia: cruzar a pie hacia DUMBO para el atardecer.", start: "2026-06-19T18:00:00-04:00", end: "2026-06-19T20:00:00-04:00", lng: -73.9969, lat: 40.7061, icon: "Sunset" },

  // ── 20 jun · Día libre NY + preparar regreso (sugerencias) ──
  { id: "d20-1", group: "all", day: "2026-06-20", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Central Park + Top of the Rock", description: "Sugerencia: Bethesda Terrace y mirador de Top of the Rock.", start: "2026-06-20T10:00:00-04:00", end: "2026-06-20T13:00:00-04:00", lng: -73.9654, lat: 40.7829, icon: "Bike" },
  { id: "d20-2", group: "all", day: "2026-06-20", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Times Square + compras 5th Avenue", description: "Sugerencia: el neón de Times Square, una porción en Joe's y souvenirs en la Quinta.", start: "2026-06-20T14:00:00-04:00", end: "2026-06-20T17:00:00-04:00", locationId: "times-square", lng: loc("times-square").lng, lat: loc("times-square").lat, icon: "ShoppingBag" },
  { id: "d20-3", group: "all", day: "2026-06-20", city: "Nueva York", phase: "ny-operations", suggested: true, title: "Cena de despedida con el primo", description: "Sugerencia: última cena en NY y preparar maletas (vuelos muy temprano).", start: "2026-06-20T19:00:00-04:00", end: "2026-06-20T21:00:00-04:00", lng: -73.9973, lat: 40.7191, icon: "Utensils" },

  // ── 21 jun · Regreso + VOTAR ────────────────────────────────
  { id: "d21-1", group: "bogota", day: "2026-06-21", city: "Nueva York", phase: "return-to-colombia", title: "Vuelo JFK → BOG (JetBlue)", description: "Vuelo de regreso a casa. Sale 7:35 am, llega a El Dorado 12:25 pm (reserva C2SOME).", start: "2026-06-21T07:35:00-04:00", end: "2026-06-21T12:25:00-05:00", locationId: "jfk", lng: loc("jfk").lng, lat: loc("jfk").lat, icon: "Plane" },
  { id: "d21-2", group: "boston", day: "2026-06-21", city: "Nueva York", phase: "return-to-colombia", title: "Vuelo JFK → BOS", description: "Mateo y Valeria regresan a Boston.", start: "2026-06-21T08:00:00-04:00", end: "2026-06-21T09:25:00-04:00", locationId: "jfk", lng: loc("jfk").lng, lat: loc("jfk").lat, icon: "Plane" },
  { id: "d21-3", group: "bogota", day: "2026-06-21", city: "Bogotá", phase: "election-day", title: "Aterrizar + VOTAR", description: "Directo de El Dorado al puesto de votación antes del cierre (4 pm).", start: "2026-06-21T12:25:00-05:00", end: "2026-06-21T16:00:00-05:00", locationId: "bog", lng: loc("bog").lng, lat: loc("bog").lat, notes: "Llevar la cédula. Verificar el puesto la noche anterior.", icon: "Vote" },
];

export const SEED_FLIGHTS: Flight[] = [
  { id: "f-a1", group: "bogota", airline: "Copa Airlines", flightNumber: "CM 0816", from: { code: "BOG", city: "Bogotá", lng: -74.1469, lat: 4.7016 }, to: { code: "PTY", city: "Panamá", lng: -79.3835, lat: 9.0714 }, departure: "2026-06-12T14:30:00-05:00", arrival: "2026-06-12T16:40:00-05:00", terminal: "Intl", gate: "B12", seat: "21A · 21C", status: "scheduled", confirmation: "ADUTDZ" },
  { id: "f-a2", group: "bogota", airline: "Copa Airlines", flightNumber: "CM 0382", from: { code: "PTY", city: "Panamá", lng: -79.3835, lat: 9.0714 }, to: { code: "LAX", city: "Los Ángeles", lng: -118.4085, lat: 33.9416 }, departure: "2026-06-12T18:10:00-05:00", arrival: "2026-06-12T23:05:00-07:00", terminal: "Intl", gate: "24", seat: "18A · 18C", status: "scheduled", confirmation: "ADUTDZ" },
  { id: "f-b1", group: "boston", airline: "JetBlue", flightNumber: "B6 0987", from: { code: "BOS", city: "Boston", lng: -71.0096, lat: 42.3656 }, to: { code: "LAX", city: "Los Ángeles", lng: -118.4085, lat: 33.9416 }, departure: "2026-06-12T20:30:00-04:00", arrival: "2026-06-12T23:55:00-07:00", terminal: "C", gate: "C30", seat: "9A · 9B", status: "scheduled", confirmation: "B6TRP1" },
  { id: "f2", group: "all", airline: "JetBlue", flightNumber: "B6 524", from: { code: "LAX", city: "Los Ángeles", lng: -118.4085, lat: 33.9416 }, to: { code: "JFK", city: "Nueva York", lng: -73.7781, lat: 40.6413 }, departure: "2026-06-17T07:25:00-07:00", arrival: "2026-06-17T16:05:00-04:00", terminal: "5", gate: "C34", seat: "14A–14D", status: "scheduled", confirmation: "KMXMWW" },
  { id: "f3", group: "bogota", airline: "JetBlue", flightNumber: "B6 1273", from: { code: "JFK", city: "Nueva York", lng: -73.7781, lat: 40.6413 }, to: { code: "BOG", city: "Bogotá", lng: -74.1469, lat: 4.7016 }, departure: "2026-06-21T07:35:00-04:00", arrival: "2026-06-21T12:25:00-05:00", terminal: "5", gate: "B22", seat: "30A · 30C", status: "scheduled", confirmation: "C2SOME" },
  { id: "f4", group: "boston", airline: "JetBlue", flightNumber: "B6 1122", from: { code: "JFK", city: "Nueva York", lng: -73.7781, lat: 40.6413 }, to: { code: "BOS", city: "Boston", lng: -71.0096, lat: 42.3656 }, departure: "2026-06-21T08:00:00-04:00", arrival: "2026-06-21T09:25:00-04:00", terminal: "5", gate: "26", seat: "11A · 11B", status: "scheduled", confirmation: "B6BOS4" },
];

export const SEED_EXPENSES: Expense[] = [
  { id: "e1", title: "Carro de alquiler (5 días)", amount: 420, category: "transport", payerId: "jeronimo", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-09" },
  { id: "e2", title: "Hotel Downtown LA (4 noches)", amount: 1240, category: "lodging", payerId: "juan", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-09" },
  { id: "e3", title: "Gasolina — LA", amount: 88, category: "gas", payerId: "mateo", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-10" },
  { id: "e4", title: "Cena en Guelaguetza", amount: 164, category: "food", payerId: "valeria", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-09" },
  { id: "e5", title: "Entradas Disneyland x4", amount: 776, category: "tickets", payerId: "jeronimo", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-11" },
  { id: "e6", title: "Souvenir — camiseta", amount: 110, category: "souvenirs", payerId: "mateo", participantIds: ["mateo"], shared: false, date: "2026-06-09" },
  { id: "e7", title: "Café + churros", amount: 24, category: "drinks", payerId: "juan", participantIds: ["juan"], shared: false, date: "2026-06-11" },
  { id: "e8", title: "Parqueadero SoFi", amount: 60, category: "parking", payerId: "juan", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-09" },
  { id: "e9", title: "Mercado / snacks", amount: 52, category: "groceries", payerId: "valeria", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-10" },
  { id: "e10", title: "Uber a Santa Mónica", amount: 38, category: "transport", payerId: "mateo", participantIds: ["jeronimo", "mateo", "juan", "valeria"], shared: true, date: "2026-06-10" },
];

const U = "https://images.unsplash.com/";
export const SEED_PHOTOS: Photo[] = [
  { id: "p1", url: `${U}photo-1502920917128-1aa500764cbd?w=900&q=80`, uploaderId: "jeronimo", uploadedAt: "2026-06-09T14:00:00-07:00", title: "Llegada a LA", city: "Los Ángeles", tags: ["llegada", "lax"], lng: -118.4085, lat: 33.9416 },
  { id: "p2", url: `${U}photo-1605723517503-3cadb5818a0c?w=900&q=80`, uploaderId: "juan", uploadedAt: "2026-06-09T18:00:00-07:00", title: "SoFi iluminado", city: "Los Ángeles", tags: ["mundial", "estadio"], lng: -118.3392, lat: 33.9535 },
  { id: "p3", url: `${U}photo-1610833025592-7e4d9d54f50f?w=900&q=80`, uploaderId: "mateo", uploadedAt: "2026-06-10T19:30:00-07:00", title: "Atardecer Santa Mónica", city: "Los Ángeles", tags: ["playa", "atardecer"], lng: -118.4977, lat: 34.0094 },
  { id: "p4", url: `${U}photo-1597466599360-3b9775841aec?w=900&q=80`, uploaderId: "valeria", uploadedAt: "2026-06-11T21:00:00-07:00", title: "Fuegos en el Castillo", city: "Anaheim", tags: ["disneyland"], lng: -117.9189, lat: 33.8121 },
  { id: "p5", url: `${U}photo-1496442226666-8d4d0e62e6e9?w=900&q=80`, uploaderId: "jeronimo", uploadedAt: "2026-06-14T15:00:00-04:00", title: "Skyline de Manhattan", city: "Nueva York", tags: ["nyc", "skyline"], lng: -73.9845, lat: 40.7549 },
  { id: "p6", url: `${U}photo-1534430480872-3498386e7856?w=900&q=80`, uploaderId: "juan", uploadedAt: "2026-06-16T20:00:00-04:00", title: "Neón en Times Square", city: "Nueva York", tags: ["nyc", "neon"], lng: -73.9855, lat: 40.758 },
];

export const SEED_DOCUMENTS: TravelDocument[] = [
  { id: "d1", name: "Pasabordos BOG→PTY→LAX", kind: "flight", folder: "Vuelos", url: "#", mimeType: "application/pdf", uploaderId: "jeronimo", uploadedAt: "2026-06-01T10:00:00-05:00", sizeKb: 240 },
  { id: "d1b", name: "Pasabordo BOS→LAX", kind: "flight", folder: "Vuelos", url: "#", mimeType: "application/pdf", uploaderId: "mateo", uploadedAt: "2026-06-01T10:00:00-05:00", sizeKb: 180 },
  { id: "d2", name: "Reserva Hotel Downtown LA", kind: "reservation", folder: "Hoteles", url: "#", mimeType: "application/pdf", uploaderId: "juan", uploadedAt: "2026-05-20T10:00:00-05:00", sizeKb: 180 },
  { id: "d3", name: "Entradas SoFi", kind: "ticket", folder: "Mundial", url: "#", mimeType: "image/png", uploaderId: "mateo", uploadedAt: "2026-05-22T10:00:00-05:00", sizeKb: 420 },
  { id: "d4", name: "Entradas Disneyland x4", kind: "ticket", folder: "Parques", url: "#", mimeType: "application/pdf", uploaderId: "jeronimo", uploadedAt: "2026-05-25T10:00:00-05:00", sizeKb: 320 },
  { id: "d5", name: "Confirmación Hotel NY", kind: "confirmation", folder: "Hoteles", url: "#", mimeType: "application/pdf", uploaderId: "valeria", uploadedAt: "2026-05-26T10:00:00-05:00", sizeKb: 150 },
  { id: "d6", name: "Contrato carro de alquiler", kind: "reservation", folder: "Transporte", url: "#", mimeType: "application/pdf", uploaderId: "jeronimo", uploadedAt: "2026-05-28T10:00:00-05:00", sizeKb: 200 },
];

export const SEED_POSTS: FeedPost[] = [
  { id: "fp1", authorId: "jeronimo", body: "Maletas listas. Nos vemos en El Dorado, counter 22, 12:00 m. ✈️", createdAt: "2026-06-08T10:00:00-05:00", reactions: { "🔥": ["juan"] } },
  { id: "fp2", authorId: "valeria", body: "Saliendo de Boston esta noche, ¡nos vemos en LA! 🛫", createdAt: "2026-06-08T16:00:00-04:00", reactions: { "🎉": ["jeronimo", "mateo", "juan"] } },
  { id: "fp3", authorId: "mateo", body: "SoFi está increíble. El ambiente es de otro nivel 🏟️⚽", createdAt: "2026-06-09T17:30:00-07:00", reactions: { "⚽": ["jeronimo", "juan"] } },
  { id: "fp4", authorId: "juan", body: "Punto de encuentro: el Castillo a las 9pm para los fuegos. ¡No lleguen tarde!", createdAt: "2026-06-11T20:00:00-07:00" },
];

export const SEED_CHECKLISTS: ChecklistItem[] = [
  { id: "c1", ownerId: "jeronimo", label: "Pasaporte", checked: true, category: "Esenciales" },
  { id: "c2", ownerId: "jeronimo", label: "Visa de EE.UU.", checked: true, category: "Esenciales" },
  { id: "c3", ownerId: "jeronimo", label: "Cédula (para votar)", checked: true, category: "Esenciales" },
  { id: "c4", ownerId: "jeronimo", label: "Cargadores + batería", checked: false, category: "Tecnología" },
  { id: "c5", ownerId: "jeronimo", label: "Camiseta del Mundial", checked: true, category: "Ropa" },
  { id: "c6", ownerId: "jeronimo", label: "Bloqueador solar", checked: false, category: "Salud" },
  { id: "c7", ownerId: "mateo", label: "Pasaporte", checked: true, category: "Esenciales" },
  { id: "c8", ownerId: "mateo", label: "Entradas (móvil)", checked: true, category: "Esenciales" },
  { id: "c9", ownerId: "mateo", label: "Zapatos cómodos", checked: false, category: "Ropa" },
  { id: "c10", ownerId: "juan", label: "Pasaporte", checked: true, category: "Esenciales" },
  { id: "c11", ownerId: "juan", label: "Efectivo (USD)", checked: false, category: "Dinero" },
  { id: "c12", ownerId: "valeria", label: "Pasaporte", checked: false, category: "Esenciales" },
  { id: "c13", ownerId: "valeria", label: "Chaqueta liviana (NY)", checked: false, category: "Ropa" },
];

// Ids alineados con el catálogo de parques (ver parks-data.ts)
export const SEED_RIDES: Ride[] = [
  { id: "dl-space-mountain", park: "disneyland", name: "Space Mountain", completed: true, rating: 5, completedBy: ["jeronimo", "mateo"] },
  { id: "dl-pirates", park: "disneyland", name: "Pirates of the Caribbean", completed: true, rating: 4, completedBy: ["jeronimo", "juan", "valeria"] },
  { id: "dl-indiana-jones", park: "disneyland", name: "Indiana Jones Adventure", completed: true, rating: 5, completedBy: ["mateo"] },
  { id: "sf-x2", park: "six-flags", name: "X2", completed: true, rating: 5, completedBy: ["jeronimo", "mateo", "juan"] },
  { id: "sf-twisted-colossus", park: "six-flags", name: "Twisted Colossus", completed: true, rating: 4, completedBy: ["jeronimo"] },
];

export const SEED_FOOD: FoodEntry[] = [
  { id: "fd1", name: "Guelaguetza", kind: "restaurant", city: "Los Ángeles", rating: 5, notes: "El mejor mole de mi vida.", lng: -118.2935, lat: 34.0577, loggedBy: "valeria", date: "2026-06-09", photoUrl: `${U}photo-1565299624946-b28f40a0ae38?w=600&q=80` },
  { id: "fd2", name: "Tacos en Santa Mónica", kind: "snack", city: "Los Ángeles", rating: 4, notes: "Baratos e increíbles.", lng: -118.4977, lat: 34.0094, loggedBy: "mateo", date: "2026-06-10" },
  { id: "fd3", name: "Joe's Pizza", kind: "restaurant", city: "Nueva York", rating: 5, notes: "La porción clásica de NY.", lng: -74.0027, lat: 40.7305, loggedBy: "jeronimo", date: "2026-06-16", photoUrl: `${U}photo-1513104890138-7c749659a591?w=600&q=80` },
  { id: "fd4", name: "Rooftop en Brooklyn", kind: "bar", city: "Nueva York", rating: 4, notes: "Vista del skyline al atardecer.", lng: -73.9903, lat: 40.7033, loggedBy: "juan", date: "2026-06-17" },
];

export const SEED_WEATHER: WeatherSnapshot[] = [
  {
    city: "Bogotá", temp: 14, feelsLike: 13, condition: "Parcialmente nublado", icon: "03d", humidity: 78, wind: 9,
    hourly: Array.from({ length: 8 }, (_, i) => ({ time: `${(10 + i) % 24}:00`, temp: 12 + (i % 4), icon: i === 5 ? "10d" : "03d", condition: i === 5 ? "Lluvia ligera" : "Nubes" })),
    daily: [
      { date: "2026-06-05", min: 8, max: 19, icon: "03d", condition: "Parcialmente nublado" },
      { date: "2026-06-06", min: 9, max: 18, icon: "10d", condition: "Lluvia ligera" },
      { date: "2026-06-07", min: 8, max: 19, icon: "02d", condition: "Mayormente soleado" },
      { date: "2026-06-08", min: 9, max: 20, icon: "01d", condition: "Soleado" },
      { date: "2026-06-09", min: 8, max: 18, icon: "03d", condition: "Nublado" },
    ],
    alerts: [],
    recommendations: ["Lleva chaqueta — las tardes son frías", "Posible lluvia, lleva paraguas", "El sol de Bogotá quema aunque haga frío"],
  },
  {
    city: "Boston", temp: 21, feelsLike: 21, condition: "Despejado", icon: "01d", humidity: 55, wind: 14,
    hourly: Array.from({ length: 8 }, (_, i) => ({ time: `${(10 + i) % 24}:00`, temp: 19 + (i % 3), icon: "01d", condition: "Despejado" })),
    daily: [
      { date: "2026-06-05", min: 14, max: 23, icon: "01d", condition: "Soleado" },
      { date: "2026-06-06", min: 15, max: 24, icon: "02d", condition: "Mayormente soleado" },
      { date: "2026-06-07", min: 14, max: 22, icon: "03d", condition: "Nublado" },
      { date: "2026-06-08", min: 15, max: 24, icon: "01d", condition: "Soleado" },
      { date: "2026-06-09", min: 16, max: 25, icon: "01d", condition: "Soleado" },
    ],
    alerts: [],
    recommendations: ["Día agradable para salir", "Lleva chaqueta liviana para la noche"],
  },
  {
    city: "Los Ángeles", temp: 26, feelsLike: 27, condition: "Soleado", icon: "01d", humidity: 45, wind: 12,
    hourly: Array.from({ length: 8 }, (_, i) => ({ time: `${(10 + i) % 24}:00`, temp: 24 + (i % 4), icon: i < 6 ? "01d" : "02d", condition: i < 6 ? "Soleado" : "Pocas nubes" })),
    daily: [
      { date: "2026-06-09", min: 18, max: 27, icon: "01d", condition: "Soleado" },
      { date: "2026-06-10", min: 19, max: 28, icon: "01d", condition: "Soleado" },
      { date: "2026-06-11", min: 18, max: 26, icon: "02d", condition: "Parcialmente nublado" },
      { date: "2026-06-12", min: 17, max: 25, icon: "01d", condition: "Soleado" },
      { date: "2026-06-13", min: 18, max: 27, icon: "01d", condition: "Soleado" },
    ],
    alerts: [],
    recommendations: ["Lleva bloqueador — índice UV alto", "Gafas de sol para los partidos", "Hidrátate en el estadio"],
  },
  {
    city: "Nueva York", temp: 22, feelsLike: 22, condition: "Parcialmente nublado", icon: "03d", humidity: 62, wind: 16,
    hourly: Array.from({ length: 8 }, (_, i) => ({ time: `${(10 + i) % 24}:00`, temp: 20 + (i % 3), icon: i === 4 ? "10d" : "03d", condition: i === 4 ? "Lluvia ligera" : "Nubes" })),
    daily: [
      { date: "2026-06-14", min: 16, max: 23, icon: "03d", condition: "Parcialmente nublado" },
      { date: "2026-06-15", min: 17, max: 24, icon: "10d", condition: "Lluvia ligera" },
      { date: "2026-06-16", min: 18, max: 25, icon: "02d", condition: "Mayormente soleado" },
      { date: "2026-06-17", min: 17, max: 24, icon: "01d", condition: "Soleado" },
      { date: "2026-06-18", min: 18, max: 26, icon: "02d", condition: "Mayormente soleado" },
    ],
    alerts: [{ title: "Se espera lluvia ligera", description: "Probables chubascos el 15 de junio en la tarde — lleva un paraguas compacto." }],
    recommendations: ["Lluvia el 15 jun — lleva paraguas", "Chaqueta liviana para la noche", "Zapatos cómodos para caminar"],
  },
];

export const SEED_ELECTION_NOTES: ElectionNote[] = [
  { id: "en1", body: "La segunda vuelta es la mañana que aterrizamos. Plan: dejar maletas en casa e ir directo al puesto de votación.", authorId: "jeronimo", createdAt: "2026-06-01T09:00:00-05:00" },
  { id: "en2", body: "Confirmar el puesto de votación de cada uno en la página de la Registraduría antes de viajar.", authorId: "juan", createdAt: "2026-06-02T09:00:00-05:00" },
];

export const SEED_ELECTION_TASKS: ElectionTask[] = [
  { id: "et1", label: "Verificar puesto de votación (Registraduría)", done: false },
  { id: "et2", label: "Llevar la cédula", done: false },
  { id: "et3", label: "Vuelo aterrizó a tiempo", done: false },
  { id: "et4", label: "Ir juntos al puesto de votación", done: false },
  { id: "et5", label: "¡Votar!", done: false },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "a0", title: "Llegada escalonada a LAX (12 jun)", body: "El grupo de Bogotá (Copa, vía Panamá) llega a LAX 11:05 pm; Mateo y Valeria (desde Boston) 11:55 pm. Esperarse en llegadas para recoger el SUV y salir todos juntos.", createdAt: "2026-06-10T21:00:00-05:00", priority: "important" },
  { id: "a1", title: "Logística de salida", body: "El Dorado, counter 22. Salida 2:30 pm (Copa, escala en Panamá, reserva ADUTDZ). Llegar 3h antes.", createdAt: "2026-06-10T20:00:00-05:00", priority: "important" },
  { id: "a2", title: "Código de vestimenta", body: "Camiseta completa para cada partido del Mundial. Viajamos como un solo equipo.", createdAt: "2026-06-06T12:00:00-05:00", priority: "info" },
  { id: "a3", title: "Recordatorio día de elecciones", body: "Votamos el día que aterrizamos. Cédula en el equipaje de mano, no en la maleta facturada.", createdAt: "2026-06-05T12:00:00-05:00", priority: "urgent" },
];
