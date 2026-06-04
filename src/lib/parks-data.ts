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
}

export interface ParkInfo {
  id: Park;
  name: string;
  hours: string;
  address: string;
  lng: number;
  lat: number;
  accent: string;
  attractions: ParkAttraction[];
  dining: ParkDining[];
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
    { name: "Blue Bayou Restaurant", type: "Cena criolla (sit-down)", price: "$40–60" },
    { name: "Café Orleans", type: "Cajún / francesa", price: "$25–35" },
    { name: "Bengal Barbecue", type: "Pinchos / snacks", price: "$8–12" },
    { name: "Galactic Grill", type: "Hamburguesas", price: "$12–18" },
    { name: "Plaza Inn", type: "Comida casera (buffet)", price: "$18–25" },
    { name: "Rancho del Zócalo", type: "Mexicana", price: "$15–20" },
    { name: "Docking Bay 7 (Galaxy's Edge)", type: "Temática Star Wars", price: "$14–20" },
    { name: "Ronto Roasters", type: "Wraps / snacks", price: "$12–16" },
    { name: "Jolly Holiday Bakery", type: "Panadería / café", price: "$8–14" },
    { name: "Tropical Hideaway (Dole Whip)", type: "Postres", price: "$6–10" },
    { name: "Mint Julep Bar", type: "Bebidas / beignets", price: "$5–8" },
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
    { name: "Johnny Rockets", type: "Hamburguesas / malteadas", price: "$12–18" },
    { name: "Full Throttle Sports Bar", type: "Bar deportivo", price: "$15–22" },
    { name: "Macho Nacho", type: "Mexicana", price: "$10–14" },
    { name: "Chop Six", type: "Asiática", price: "$12–16" },
    { name: "Mooseburger Lodge", type: "Hamburguesas (sit-down)", price: "$14–20" },
    { name: "Cyber Cafe", type: "Pizza / café", price: "$10–15" },
    { name: "Katy's Kettle", type: "Snacks / dulces", price: "$6–10" },
  ],
};

export const PARKS_DATA: Record<Park, ParkInfo> = {
  disneyland: DISNEYLAND,
  "six-flags": SIX_FLAGS,
};
