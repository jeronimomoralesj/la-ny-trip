import type { Park } from "./types";

export type AttractionType = "coaster" | "dark" | "family" | "water" | "thrill" | "show" | "transport";

export interface ParkAttraction {
  id: string;
  name: string;
  land: string;
  type: AttractionType;
  avgWait: number; // promedio histórico de espera en minutos
}

export interface ParkDining {
  name: string;
  type: string; // tipo de comida
  price: string; // rango en USD
  menu?: string[]; // platos destacados con precio
}

export interface RouteStop {
  time: string;
  title: string;
  note?: string;
}

export interface ParkInfo {
  id: Park;
  name: string;
  hours: string;
  address: string;
  lng: number;
  lat: number;
  accent: string;
  queueTimesId: number;   // id en queue-times.com para esperas en vivo
  officialMapUrl: string; // mapa interactivo oficial del parque
  attractions: ParkAttraction[];
  dining: ParkDining[];
  suggestedRoute: RouteStop[];
}

/** Clave estable de una atracción (para marcar completadas, venga de catálogo o de datos en vivo). */
export function rideKey(park: Park, name: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${park}:${slug}`;
}

export const ATTRACTION_LABEL: Record<AttractionType, string> = {
  coaster: "Montaña rusa",
  dark: "Dark ride",
  family: "Familiar",
  water: "Acuática",
  thrill: "Extrema",
  show: "Show",
  transport: "Transporte",
};

// ──────────────────────────────────────────────────────────────
//  DISNEYLAND PARK — catálogo completo de atracciones por área
// ──────────────────────────────────────────────────────────────
const DISNEYLAND: ParkInfo = {
  id: "disneyland",
  name: "Disneyland Park",
  hours: "8:00 AM – 12:00 AM (verano)",
  address: "1313 Disneyland Dr, Anaheim, CA",
  lng: -117.9189,
  lat: 33.8121,
  accent: "#ec4899",
  queueTimesId: 16,
  officialMapUrl: "https://disneyland.disney.go.com/es-us/maps/disneyland/",
  attractions: [
    // Adventureland
    { id: "dl-indiana-jones", name: "Indiana Jones Adventure", land: "Adventureland", type: "thrill", avgWait: 55 },
    { id: "dl-jungle-cruise", name: "Jungle Cruise", land: "Adventureland", type: "family", avgWait: 40 },
    { id: "dl-tiki-room", name: "Enchanted Tiki Room", land: "Adventureland", type: "show", avgWait: 15 },
    { id: "dl-treehouse", name: "Adventureland Treehouse", land: "Adventureland", type: "family", avgWait: 10 },
    // New Orleans Square
    { id: "dl-pirates", name: "Pirates of the Caribbean", land: "New Orleans Square", type: "dark", avgWait: 35 },
    { id: "dl-haunted-mansion", name: "Haunted Mansion", land: "New Orleans Square", type: "dark", avgWait: 40 },
    // Critter Country
    { id: "dl-tianas", name: "Tiana's Bayou Adventure", land: "Critter Country", type: "water", avgWait: 65 },
    { id: "dl-winnie-pooh", name: "Many Adventures of Winnie the Pooh", land: "Critter Country", type: "dark", avgWait: 20 },
    // Frontierland
    { id: "dl-big-thunder", name: "Big Thunder Mountain Railroad", land: "Frontierland", type: "coaster", avgWait: 45 },
    { id: "dl-mark-twain", name: "Mark Twain Riverboat", land: "Frontierland", type: "transport", avgWait: 15 },
    { id: "dl-tom-sawyer", name: "Pirate's Lair on Tom Sawyer Island", land: "Frontierland", type: "family", avgWait: 5 },
    // Fantasyland
    { id: "dl-matterhorn", name: "Matterhorn Bobsleds", land: "Fantasyland", type: "coaster", avgWait: 40 },
    { id: "dl-small-world", name: "it's a small world", land: "Fantasyland", type: "family", avgWait: 25 },
    { id: "dl-peter-pan", name: "Peter Pan's Flight", land: "Fantasyland", type: "dark", avgWait: 50 },
    { id: "dl-alice", name: "Alice in Wonderland", land: "Fantasyland", type: "dark", avgWait: 30 },
    { id: "dl-mad-tea", name: "Mad Tea Party", land: "Fantasyland", type: "family", avgWait: 20 },
    { id: "dl-mr-toad", name: "Mr. Toad's Wild Ride", land: "Fantasyland", type: "dark", avgWait: 25 },
    { id: "dl-snow-white", name: "Snow White's Enchanted Wish", land: "Fantasyland", type: "dark", avgWait: 30 },
    { id: "dl-pinocchio", name: "Pinocchio's Daring Journey", land: "Fantasyland", type: "dark", avgWait: 20 },
    { id: "dl-storybook", name: "Storybook Land Canal Boats", land: "Fantasyland", type: "family", avgWait: 25 },
    { id: "dl-casey-jr", name: "Casey Jr. Circus Train", land: "Fantasyland", type: "family", avgWait: 20 },
    { id: "dl-carrousel", name: "King Arthur Carrousel", land: "Fantasyland", type: "family", avgWait: 10 },
    { id: "dl-dumbo", name: "Dumbo the Flying Elephant", land: "Fantasyland", type: "family", avgWait: 25 },
    // Tomorrowland
    { id: "dl-space-mountain", name: "Space Mountain", land: "Tomorrowland", type: "coaster", avgWait: 60 },
    { id: "dl-star-tours", name: "Star Tours – The Adventures Continue", land: "Tomorrowland", type: "thrill", avgWait: 35 },
    { id: "dl-buzz", name: "Buzz Lightyear Astro Blasters", land: "Tomorrowland", type: "dark", avgWait: 25 },
    { id: "dl-astro-orbitor", name: "Astro Orbitor", land: "Tomorrowland", type: "family", avgWait: 20 },
    { id: "dl-autopia", name: "Autopia", land: "Tomorrowland", type: "family", avgWait: 30 },
    { id: "dl-nemo", name: "Finding Nemo Submarine Voyage", land: "Tomorrowland", type: "dark", avgWait: 40 },
    { id: "dl-monorail", name: "Disneyland Monorail", land: "Tomorrowland", type: "transport", avgWait: 15 },
    // Star Wars: Galaxy's Edge
    { id: "dl-falcon", name: "Millennium Falcon: Smugglers Run", land: "Galaxy's Edge", type: "thrill", avgWait: 45 },
    { id: "dl-rise", name: "Star Wars: Rise of the Resistance", land: "Galaxy's Edge", type: "thrill", avgWait: 75 },
    // Mickey's Toontown
    { id: "dl-runaway-railway", name: "Mickey & Minnie's Runaway Railway", land: "Toontown", type: "dark", avgWait: 50 },
    { id: "dl-gadget", name: "Chip 'n' Dale's GADGETcoaster", land: "Toontown", type: "coaster", avgWait: 25 },
    { id: "dl-roger-rabbit", name: "Roger Rabbit's Car Toon Spin", land: "Toontown", type: "dark", avgWait: 30 },
  ],
  dining: [
    { name: "Blue Bayou Restaurant", type: "Cena criolla (sit-down)", price: "$40–60", menu: ["Filete Mignon — $54", "Gumbo de pollo y andouille — $26", "Monte Cristo (clásico) — $39", "Pescado del día — $42"] },
    { name: "Café Orleans", type: "Cajún / francesa", price: "$25–35", menu: ["Monte Cristo — $24", "Pommes frites con tres salsas — $13", "Gumbo — $21", "Crepe de pollo — $26"] },
    { name: "Bengal Barbecue", type: "Pinchos / snacks", price: "$8–12", menu: ["Pincho Banyan (res) — $7.49", "Pincho Bengal (pollo) — $6.99", "Pincho de vegetales — $5.99", "Pretzel tigre — $8.49"] },
    { name: "Galactic Grill", type: "Hamburguesas", price: "$12–18", menu: ["Cheeseburger — $13.99", "Pollo crispy — $13.49", "Ensalada — $11.49", "Papas — $4.99"] },
    { name: "Plaza Inn", type: "Comida casera (buffet)", price: "$18–25", menu: ["Pollo frito — $22.99", "Pot roast — $23.99", "Pasta — $17.99"] },
    { name: "Rancho del Zócalo", type: "Mexicana", price: "$15–20", menu: ["Burrito de carne asada — $16.49", "Tacos de pollo — $15.49", "Enchiladas — $16.99", "Nachos — $13.49"] },
    { name: "Docking Bay 7 (Galaxy's Edge)", type: "Temática Star Wars", price: "$14–20", menu: ["Fried Endorian Tip-Yip (pollo) — $17.99", "Smoked Kaadu Ribs — $19.49", "Felucian Garden Spread (vegano) — $14.99"] },
    { name: "Ronto Roasters", type: "Wraps / snacks", price: "$12–16", menu: ["Ronto Wrap — $14.49", "Ronto Morning Wrap — $13.49", "Bebida Tatooine — $6.49"] },
    { name: "Jolly Holiday Bakery", type: "Panadería / café", price: "$8–14", menu: ["Sándwich de jamón y queso — $11.99", "Sopa de tomate y grilled cheese — $12.49", "Mickey beignets — $6.49"] },
    { name: "Tropical Hideaway", type: "Postres (Dole Whip)", price: "$6–10", menu: ["Dole Whip — $6.49", "Dole Whip flotante — $7.49", "Lumpia de durazno — $5.99"] },
    { name: "Mint Julep Bar", type: "Bebidas / beignets", price: "$5–8", menu: ["Mint Julep — $5.49", "3 beignets de Mickey — $6.49", "Beignets sabor temporada — $7.49"] },
  ],
  suggestedRoute: [
    { time: "8:00", title: "Rope drop: Star Wars: Rise of the Resistance", note: "La fila más larga del día — entra primero o saca Lightning Lane." },
    { time: "8:35", title: "Millennium Falcon: Smugglers Run", note: "Sigue en Galaxy's Edge mientras está vacío." },
    { time: "9:10", title: "Indiana Jones Adventure", note: "Camina a Adventureland antes de que suba la espera." },
    { time: "9:45", title: "Pirates of the Caribbean", note: "Alta capacidad, fila avanza rápido." },
    { time: "10:10", title: "Haunted Mansion", note: "Al lado de Piratas." },
    { time: "10:40", title: "Big Thunder Mountain", note: "Frontierland." },
    { time: "11:15", title: "Matterhorn + it's a small world", note: "Fantasyland." },
    { time: "12:00", title: "Almuerzo temprano", note: "Evita el pico de 13:00. Bengal BBQ o Galactic Grill." },
    { time: "12:45", title: "Space Mountain + Star Tours", note: "Tomorrowland." },
    { time: "13:30", title: "Salir hacia Six Flags", note: "≈1h15 de viaje a Valencia. Park hopping ⚡" },
  ],
};

// ──────────────────────────────────────────────────────────────
//  SIX FLAGS MAGIC MOUNTAIN — catálogo completo
// ──────────────────────────────────────────────────────────────
const SIX_FLAGS: ParkInfo = {
  id: "six-flags",
  name: "Six Flags Magic Mountain",
  hours: "10:30 AM – 10:00 PM (verano)",
  address: "26101 Magic Mountain Pkwy, Valencia, CA",
  lng: -118.5953,
  lat: 34.4253,
  accent: "#22c55e",
  queueTimesId: 30,
  officialMapUrl: "https://www.sixflags.com/magicmountain/explore/park-map",
  attractions: [
    { id: "sf-x2", name: "X2", land: "—", type: "coaster", avgWait: 60 },
    { id: "sf-twisted-colossus", name: "Twisted Colossus", land: "—", type: "coaster", avgWait: 55 },
    { id: "sf-tatsu", name: "Tatsu", land: "—", type: "coaster", avgWait: 50 },
    { id: "sf-goliath", name: "Goliath", land: "—", type: "coaster", avgWait: 45 },
    { id: "sf-full-throttle", name: "Full Throttle", land: "—", type: "coaster", avgWait: 40 },
    { id: "sf-superman", name: "Superman: Escape from Krypton", land: "—", type: "coaster", avgWait: 40 },
    { id: "sf-viper", name: "Viper", land: "—", type: "coaster", avgWait: 30 },
    { id: "sf-riddler", name: "Riddler's Revenge", land: "—", type: "coaster", avgWait: 35 },
    { id: "sf-scream", name: "Scream!", land: "—", type: "coaster", avgWait: 30 },
    { id: "sf-batman", name: "Batman: The Ride", land: "—", type: "coaster", avgWait: 35 },
    { id: "sf-ninja", name: "Ninja", land: "—", type: "coaster", avgWait: 25 },
    { id: "sf-apocalypse", name: "Apocalypse", land: "—", type: "coaster", avgWait: 30 },
    { id: "sf-gold-rusher", name: "Gold Rusher", land: "—", type: "coaster", avgWait: 20 },
    { id: "sf-wonder-woman", name: "Wonder Woman: Flight of Courage", land: "—", type: "coaster", avgWait: 45 },
    { id: "sf-west-coast-racers", name: "West Coast Racers", land: "—", type: "coaster", avgWait: 40 },
    { id: "sf-green-lantern", name: "Green Lantern: First Flight", land: "—", type: "coaster", avgWait: 30 },
    { id: "sf-canyon-blaster", name: "Canyon Blaster", land: "—", type: "family", avgWait: 15 },
    { id: "sf-speedy", name: "Speedy Gonzales", land: "—", type: "family", avgWait: 10 },
    { id: "sf-crazanity", name: "CraZanity", land: "—", type: "thrill", avgWait: 30 },
    { id: "sf-lex-luthor", name: "Lex Luthor: Drop of Doom", land: "—", type: "thrill", avgWait: 35 },
    { id: "sf-justice-league", name: "Justice League: Battle for Metropolis", land: "—", type: "dark", avgWait: 30 },
    { id: "sf-sky-tower", name: "Sky Tower", land: "—", type: "family", avgWait: 15 },
    { id: "sf-jet-stream", name: "Jet Stream", land: "—", type: "water", avgWait: 25 },
    { id: "sf-tidal-wave", name: "Tidal Wave", land: "—", type: "water", avgWait: 20 },
    { id: "sf-roaring-rapids", name: "Roaring Rapids", land: "—", type: "water", avgWait: 30 },
  ],
  dining: [
    { name: "Johnny Rockets", type: "Hamburguesas / malteadas", price: "$12–18", menu: ["The Original burger — $13.99", "Bacon cheddar burger — $15.49", "Malteada — $7.49", "Aros de cebolla — $5.99"] },
    { name: "Full Throttle Sports Bar", type: "Bar deportivo", price: "$15–22", menu: ["Alitas (12) — $18.99", "Nachos cargados — $15.49", "Cerveza artesanal — $11", "Pretzel gigante — $12.49"] },
    { name: "Macho Nacho", type: "Mexicana", price: "$10–14", menu: ["Burrito — $12.99", "Nachos supreme — $11.49", "Tacos (3) — $11.99"] },
    { name: "Chop Six", type: "Asiática", price: "$12–16", menu: ["Orange chicken bowl — $13.99", "Lo mein — $12.99", "Egg rolls — $6.49"] },
    { name: "Mooseburger Lodge", type: "Hamburguesas (sit-down)", price: "$14–20", menu: ["Moose burger doble — $18.99", "Sándwich de pollo — $15.99", "Ensalada Cobb — $14.49"] },
    { name: "Cyber Cafe", type: "Pizza / café", price: "$10–15", menu: ["Pizza personal pepperoni — $12.99", "Slice + bebida — $9.99", "Café / espresso — $4.99"] },
    { name: "Katy's Kettle", type: "Snacks / dulces", price: "$6–10", menu: ["Funnel cake — $9.99", "Pretzel — $7.49", "Algodón de azúcar — $6.49"] },
  ],
  suggestedRoute: [
    { time: "14:30", title: "Llegada + X2", note: "El coaster estrella primero (4D). Suele tener la mayor espera." },
    { time: "15:15", title: "Twisted Colossus", note: "Híbrido de madera, justo al lado." },
    { time: "16:00", title: "Tatsu", note: "Vuelo invertido — el más alto de su tipo." },
    { time: "16:40", title: "Full Throttle", note: "El loop vertical más alto del mundo." },
    { time: "17:20", title: "Goliath + Riddler's Revenge", note: "Zona central, caminata corta entre ambos." },
    { time: "18:15", title: "Cena rápida", note: "Full Throttle Sports Bar o Johnny Rockets." },
    { time: "19:00", title: "Superman: Escape from Krypton", note: "Caída libre de 100 m." },
    { time: "19:40", title: "Apocalypse + Batman: The Ride", note: "Mientras baja la afluencia al atardecer." },
    { time: "20:30", title: "Repetir favoritos", note: "Las esperas caen mucho la última hora antes del cierre." },
  ],
};

export const PARKS_DATA: Record<Park, ParkInfo> = {
  disneyland: DISNEYLAND,
  "six-flags": SIX_FLAGS,
};
