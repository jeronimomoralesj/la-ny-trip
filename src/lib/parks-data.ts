import type { Park } from "./types";

export type AttractionType = "coaster" | "dark" | "family" | "water" | "thrill" | "show" | "transport";

export interface ParkAttraction {
  id: string;
  name: string;
  land: string;
  type: AttractionType;
  avgWait: number; // promedio histórico de espera en minutos
}

export type DiningCategory = "Sit-down" | "Quick-service" | "Bar/Lounge" | "Postre" | "Café";

export interface ParkDining {
  name: string;
  type: string;            // tipo / cocina
  category: DiningCategory;
  price: string;           // rango en USD
  tier: 1 | 2 | 3;         // $ / $$ / $$$  (para filtrar)
  location?: string;       // área del parque
  description?: string;
  yelp: string;            // enlace directo a Yelp
}

/** Enlace de búsqueda en Yelp para ver fotos, menú y reseñas del lugar. */
export function yelpSearchUrl(name: string, city: string) {
  return `https://www.yelp.com/search?find_desc=${encodeURIComponent(name)}&find_loc=${encodeURIComponent(city)}`;
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
  city: string;
  queueTimesId: number;     // id en queue-times.com para esperas en vivo
  officialMapUrl: string;   // mapa interactivo oficial del parque
  realtimeQueueUrl: string; // página de filas en tiempo real
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
  city: "Anaheim, CA",
  queueTimesId: 16,
  officialMapUrl: "https://disneyland.disney.go.com/es-us/maps/disneyland/",
  realtimeQueueUrl: "https://queue-times.com/parks/16",
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
    { name: "Blue Bayou Restaurant", type: "Cena criolla (sit-down)", category: "Sit-down", price: "$40–60", tier: 3, location: "New Orleans Square", yelp: "https://www.yelp.com/biz/blue-bayou-restaurant-anaheim" },
    { name: "Café Orleans", type: "Cajún / francesa", category: "Sit-down", price: "$25–35", tier: 2, location: "New Orleans Square", yelp: "https://www.yelp.com/biz/cafe-orleans-anaheim" },
    { name: "Carnation Cafe", type: "Americana (table-service)", category: "Sit-down", price: "$25–40", tier: 2, location: "Main Street, U.S.A.", description: "Comfort food: meatloaf casero, chicken fried steak y fried pickles.", yelp: "https://www.yelp.com/biz/carnation-cafe-anaheim" },
    { name: "Oga's Cantina", type: "Lounge / bar temático", category: "Bar/Lounge", price: "$15–30", tier: 2, location: "Star Wars: Galaxy's Edge", description: "Taberna inmersiva de Star Wars con tragos únicos y un droide DJ.", yelp: "https://www.yelp.com/biz/ogas-cantina-anaheim" },
    { name: "Bengal Barbecue", type: "Pinchos / snacks", category: "Quick-service", price: "$8–12", tier: 1, location: "Adventureland", yelp: "https://www.yelp.com/biz/bengal-barbecue-anaheim" },
    { name: "Galactic Grill", type: "Hamburguesas", category: "Quick-service", price: "$12–18", tier: 1, location: "Tomorrowland", yelp: "https://www.yelp.com/biz/galactic-grill-anaheim" },
    { name: "Plaza Inn", type: "Comida casera (buffet)", category: "Quick-service", price: "$18–25", tier: 2, location: "Main Street, U.S.A.", yelp: "https://www.yelp.com/biz/plaza-inn-anaheim" },
    { name: "Rancho del Zócalo Restaurante", type: "Mexicana", category: "Quick-service", price: "$15–20", tier: 2, location: "Frontierland", yelp: "https://www.yelp.com/biz/rancho-del-zocalo-restaurante-anaheim" },
    { name: "Docking Bay 7 Food and Cargo", type: "Temática Star Wars", category: "Quick-service", price: "$14–20", tier: 2, location: "Star Wars: Galaxy's Edge", yelp: "https://www.yelp.com/biz/docking-bay-7-food-and-cargo-anaheim" },
    { name: "Ronto Roasters", type: "Wraps / snacks", category: "Quick-service", price: "$12–16", tier: 1, location: "Star Wars: Galaxy's Edge", yelp: "https://www.yelp.com/biz/ronto-roasters-anaheim" },
    { name: "Red Rose Taverne", type: "Francesa-americana (QS)", category: "Quick-service", price: "$13–20", tier: 1, location: "Fantasyland", description: "Temática La Bella y la Bestia: flatbreads, poutine, burgers y el 'Grey Stuff'.", yelp: "https://www.yelp.com/biz/red-rose-taverne-anaheim" },
    { name: "Tiana's Palace", type: "Criolla & cajún (QS)", category: "Quick-service", price: "$14–20", tier: 2, location: "New Orleans Square", description: "Inspirado en Tiana: gumbo casero, muffuletta y beignets.", yelp: "https://www.yelp.com/biz/tianas-palace-anaheim" },
    { name: "Hungry Bear Barbecue Jamboree", type: "BBQ (QS)", category: "Quick-service", price: "$14–22", tier: 2, location: "Critter Country", description: "BBQ regional junto al río: pulled pork y brisket.", yelp: "https://www.yelp.com/biz/hungry-bear-restaurant-anaheim" },
    { name: "Harbour Galley", type: "Mariscos & sopas (QS)", category: "Quick-service", price: "$12–18", tier: 1, location: "Critter Country", description: "Bread bowls de clam chowder o lobster mac & cheese.", yelp: "https://www.yelp.com/biz/harbour-galley-anaheim" },
    { name: "Alien Pizza Planet", type: "Italiana (QS)", category: "Quick-service", price: "$12–18", tier: 1, location: "Tomorrowland", description: "Temática Toy Story: pizza, pastas personalizables y breadsticks.", yelp: "https://www.yelp.com/biz/alien-pizza-planet-anaheim" },
    { name: "Stage Door Café", type: "Comfort food (QS)", category: "Quick-service", price: "$10–15", tier: 1, location: "Frontierland", description: "Ventana famosa por corn dogs hechos a mano y funnel cakes.", yelp: "https://www.yelp.com/biz/stage-door-caf%C3%A9-anaheim" },
    { name: "Golden Horseshoe", type: "Americana / postres (QS)", category: "Quick-service", price: "$10–16", tier: 1, location: "Frontierland", description: "Saloon histórico con piano en vivo: tenders, fish & chips y sundaes.", yelp: "https://www.yelp.com/biz/the-golden-horseshoe-anaheim" },
    { name: "Troubadour Tavern", type: "Snacks (QS)", category: "Quick-service", price: "$10–16", tier: 1, location: "Fantasyland", description: "Bratwurst, papas rellenas grandes y snacks de temporada.", yelp: "https://www.yelp.com/biz/troubadour-tavern-anaheim" },
    { name: "Daisy's Cafe", type: "Diner (QS)", category: "Quick-service", price: "$10–16", tier: 1, location: "Mickey's Toontown", description: "Diner estilo caricatura: pizzas personales, wraps y dulces temáticos.", yelp: "https://www.yelp.com/biz/daisys-cafe-anaheim" },
    { name: "Jolly Holiday Bakery Cafe", type: "Panadería / café", category: "Café", price: "$8–14", tier: 1, location: "Main Street, U.S.A.", yelp: "https://www.yelp.com/biz/jolly-holiday-bakery-cafe-anaheim" },
    { name: "The Tropical Hideaway", type: "Postres (Dole Whip / Bao)", category: "Postre", price: "$6–10", tier: 1, location: "Adventureland", yelp: "https://www.yelp.com/biz/the-tropical-hideaway-anaheim" },
    { name: "Tiki Juice Bar", type: "Postres (Dole Whip)", category: "Postre", price: "$6–10", tier: 1, location: "Adventureland", description: "La ventana original del Dole Whip, junto al Enchanted Tiki Room.", yelp: "https://www.yelp.com/biz/tiki-juice-bar-anaheim" },
    { name: "Gibson Girl Ice Cream Parlor", type: "Helados", category: "Postre", price: "$6–12", tier: 1, location: "Main Street, U.S.A.", description: "Heladería nostálgica con Ben & Jerry's en conos de waffle horneados.", yelp: "https://www.yelp.com/biz/gibson-girl-ice-cream-parlor-anaheim" },
    { name: "Mint Julep Bar", type: "Bebidas / beignets", category: "Postre", price: "$6–10", tier: 1, location: "New Orleans Square", yelp: "https://www.yelp.com/biz/mint-julep-bar-anaheim" },
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
    { time: "13:30", title: "Park hop a Disney California Adventure", note: "Cruzas la explanada — los parques están uno frente al otro. ⚡" },
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
  city: "Valencia, CA",
  queueTimesId: 30,
  officialMapUrl: "https://www.sixflags.com/magicmountain/explore/park-map",
  realtimeQueueUrl: "https://queue-times.com/parks/30",
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
    { name: "Food Etc.", type: "Plaza multi-cocina", category: "Quick-service", price: "$10–18", tier: 1, location: "Centro del parque", description: "Patio de comidas con estaciones mexicana, sushi y postres como Dole Whip.", yelp: "https://www.yelp.com/biz/food-etc-valencia" },
    { name: "ACE O'CLUBS", type: "BBQ", category: "Quick-service", price: "$14–22", tier: 2, location: "Metropolis", description: "Sándwiches de brisket ahumado, baby back ribs y muslos de pavo gigantes.", yelp: "https://www.yelp.com/biz/ace-o-clubs-valencia" },
    { name: "Big Belly Burger", type: "Hamburguesas", category: "Quick-service", price: "$12–18", tier: 1, location: "DC Universe", description: "Cheeseburgers clásicas, papas y bebidas.", yelp: "https://www.yelp.com/biz/big-belly-burger-valencia" },
    { name: "Max'd Out Mac & Screaming Spuds", type: "Comfort food", category: "Quick-service", price: "$12–18", tier: 1, description: "Bowls cargados de mac & cheese gourmet o papas rellenas con brisket.", yelp: "https://www.yelp.com/biz/maxd-out-mac-and-screaming-spuds-valencia" },
    { name: "Chicken Coupe", type: "Pollo", category: "Quick-service", price: "$12–17", tier: 1, location: "Screampunk District", description: "Tenders empanizados a mano, sándwiches de pollo y crinkle-cut fries.", yelp: "https://www.yelp.com/biz/chicken-coupe-valencia" },
    { name: "Twin Charged Tacos", type: "Mexicana", category: "Quick-service", price: "$10–16", tier: 1, location: "Cerca de West Coast Racers", description: "Tacos de calle, pupusas y acompañamientos calientes.", yelp: "https://www.yelp.com/biz/twin-charged-tacos-valencia" },
    { name: "The Funnel Cake Factory", type: "Postres", category: "Postre", price: "$8–13", tier: 1, description: "Funnel cakes recién fritos con azúcar glas, soft-serve y frutas.", yelp: "https://www.yelp.com/biz/funnel-cake-factory-valencia" },
    { name: "Plaza Ice Cream & Shakes", type: "Postres & malteadas", category: "Postre", price: "$8–14", tier: 1, description: "Famosos 'Thrill Shakes' cargados de galletas, torta y dulces.", yelp: "https://www.yelp.com/biz/plaza-ice-cream-and-shakes-valencia" },
  ],
  suggestedRoute: [
    { time: "10:30", title: "Apertura + X2", note: "El coaster estrella primero (4D). Suele tener la mayor espera." },
    { time: "11:15", title: "Twisted Colossus", note: "Híbrido de madera, justo al lado." },
    { time: "12:00", title: "Tatsu", note: "Vuelo invertido — el más alto de su tipo." },
    { time: "12:45", title: "Full Throttle", note: "El loop vertical más alto del mundo." },
    { time: "13:30", title: "Almuerzo", note: "Full Throttle Sports Bar o Johnny Rockets antes del pico." },
    { time: "14:30", title: "Goliath + Riddler's Revenge", note: "Zona central, caminata corta entre ambos." },
    { time: "15:30", title: "Superman: Escape from Krypton", note: "Caída libre de 100 m." },
    { time: "16:30", title: "Apocalypse + Batman: The Ride", note: "Sigue rotando por la zona." },
    { time: "18:00", title: "Acuáticas (Tidal Wave / Jet Stream)", note: "Para refrescar en la tarde caliente." },
    { time: "19:30", title: "Repetir favoritos", note: "Las esperas caen mucho la última hora antes del cierre." },
  ],
};

// ──────────────────────────────────────────────────────────────
//  DISNEY CALIFORNIA ADVENTURE — destino del park hop
// ──────────────────────────────────────────────────────────────
const DCA: ParkInfo = {
  id: "disney-california-adventure",
  name: "Disney California Adventure",
  hours: "8:00 AM – 10:00 PM (verano)",
  address: "1313 Disneyland Dr, Anaheim, CA",
  lng: -117.9209,
  lat: 33.8064,
  accent: "#f59e0b",
  city: "Anaheim, CA",
  queueTimesId: 17,
  officialMapUrl: "https://disneyland.disney.go.com/es-us/maps/disney-california-adventure/",
  realtimeQueueUrl: "https://queue-times.com/parks/17",
  attractions: [
    { id: "dca-red-car", name: "Red Car Trolley", land: "Buena Vista Street", type: "transport", avgWait: 10 },
    { id: "dca-monsters", name: "Monsters, Inc. Mike & Sulley to the Rescue!", land: "Hollywood Land", type: "dark", avgWait: 25 },
    { id: "dca-breakout", name: "Guardians of the Galaxy – Mission: BREAKOUT!", land: "Avengers Campus", type: "thrill", avgWait: 65 },
    { id: "dca-webslingers", name: "WEB SLINGERS: A Spider-Man Adventure", land: "Avengers Campus", type: "dark", avgWait: 55 },
    { id: "dca-racers", name: "Radiator Springs Racers", land: "Cars Land", type: "thrill", avgWait: 80 },
    { id: "dca-maters", name: "Mater's Junkyard Jamboree", land: "Cars Land", type: "family", avgWait: 25 },
    { id: "dca-luigis", name: "Luigi's Rollickin' Roadsters", land: "Cars Land", type: "family", avgWait: 25 },
    { id: "dca-incredicoaster", name: "Incredicoaster", land: "Pixar Pier", type: "coaster", avgWait: 45 },
    { id: "dca-toystory", name: "Toy Story Midway Mania!", land: "Pixar Pier", type: "dark", avgWait: 40 },
    { id: "dca-palaround", name: "Pixar Pal-A-Round", land: "Pixar Pier", type: "family", avgWait: 30 },
    { id: "dca-critter-carousel", name: "Jessie's Critter Carousel", land: "Pixar Pier", type: "family", avgWait: 15 },
    { id: "dca-inside-out", name: "Inside Out Emotional Whirlwind", land: "Pixar Pier", type: "family", avgWait: 25 },
    { id: "dca-little-mermaid", name: "The Little Mermaid ~ Ariel's Undersea Adventure", land: "Paradise Gardens Park", type: "dark", avgWait: 20 },
    { id: "dca-golden-zephyr", name: "Golden Zephyr", land: "Paradise Gardens Park", type: "family", avgWait: 15 },
    { id: "dca-goofys", name: "Goofy's Sky School", land: "Paradise Gardens Park", type: "coaster", avgWait: 30 },
    { id: "dca-jellyfish", name: "Jumpin' Jellyfish", land: "Paradise Gardens Park", type: "family", avgWait: 15 },
    { id: "dca-silly-swings", name: "Silly Symphony Swings", land: "Paradise Gardens Park", type: "family", avgWait: 20 },
    { id: "dca-grizzly", name: "Grizzly River Run", land: "Grizzly Peak", type: "water", avgWait: 40 },
    { id: "dca-soarin", name: "Soarin' Around the World", land: "Grizzly Peak", type: "thrill", avgWait: 45 },
    { id: "dca-redwood", name: "Redwood Creek Challenge Trail", land: "Grizzly Peak", type: "family", avgWait: 5 },
  ],
  dining: [
    { name: "Carthay Circle Restaurant", type: "Cena fina (sit-down)", category: "Sit-down", price: "$45–70", tier: 3, location: "Buena Vista Street", yelp: "https://www.yelp.com/biz/carthay-circle-restaurant-anaheim" },
    { name: "Lamplight Lounge", type: "Gastropub", category: "Sit-down", price: "$25–40", tier: 2, location: "Pixar Pier", yelp: "https://www.yelp.com/biz/lamplight-lounge-anaheim" },
    { name: "Wine Country Trattoria", type: "Italiana (table-service)", category: "Sit-down", price: "$28–45", tier: 3, location: "Performance Corridor", description: "Villa mediterránea con pastas, ribeye y carta de vinos extensa.", yelp: "https://www.yelp.com/biz/wine-country-trattoria-anaheim" },
    { name: "Pym Test Kitchen", type: "Comfort innovadora", category: "Quick-service", price: "$14–22", tier: 2, location: "Avengers Campus", yelp: "https://www.yelp.com/biz/pym-test-kitchen-anaheim" },
    { name: "Cocina Cucamonga Mexican Grill", type: "Mexicana", category: "Quick-service", price: "$12–18", tier: 1, location: "San Fransokyo Square", yelp: "https://www.yelp.com/biz/cocina-cucamonga-mexican-grill-anaheim" },
    { name: "Award Wieners", type: "Hot dogs", category: "Quick-service", price: "$10–15", tier: 1, location: "Hollywood Land", yelp: "https://www.yelp.com/biz/award-wieners-anaheim" },
    { name: "Flo's V8 Cafe", type: "Diner americano", category: "Quick-service", price: "$14–20", tier: 2, location: "Cars Land", yelp: "https://www.yelp.com/biz/flos-v8-cafe-anaheim" },
    { name: "Smokejumpers Grill", type: "Hamburguesas / americana", category: "Quick-service", price: "$14–20", tier: 2, location: "Grizzly Peak", yelp: "https://www.yelp.com/biz/smokejumpers-grill-anaheim" },
    { name: "Lucky Fortune Cookery", type: "Asiática", category: "Quick-service", price: "$12–18", tier: 1, location: "San Fransokyo Square", description: "Bowls de teriyaki, bulgogi y potstickers.", yelp: "https://www.yelp.com/biz/lucky-fortune-cookery-anaheim" },
    { name: "Aunt Cass Cafe", type: "Panadería & café", category: "Café", price: "$10–16", tier: 1, location: "San Fransokyo Square", description: "Bread bowls de clam chowder o mac & cheese y pastelería.", yelp: "https://www.yelp.com/biz/aunt-cass-cafe-anaheim" },
    { name: "Boardwalk Pizza & Pasta", type: "Italiana", category: "Quick-service", price: "$13–20", tier: 1, location: "Paradise Gardens Park", description: "Pizzas, pastas (spaghetti, ravioli) y ensaladas.", yelp: "https://www.yelp.com/biz/boardwalk-pizza-and-pasta-anaheim" },
    { name: "Paradise Garden Grill", type: "Estacional", category: "Quick-service", price: "$13–20", tier: 1, location: "Paradise Gardens Park", description: "Menú que rota según el festival del parque.", yelp: "https://www.yelp.com/biz/paradise-garden-grill-anaheim" },
    { name: "Port of San Fransokyo Cerveceria", type: "Bar / snacks", category: "Bar/Lounge", price: "$12–20", tier: 2, location: "San Fransokyo Square", description: "Beer garden con cervezas locales, elote y chips de ajo.", yelp: "https://www.yelp.com/biz/port-of-san-fransokyo-cerveceria-anaheim" },
    { name: "Mendocino Terrace", type: "Wine bar & lounge", category: "Bar/Lounge", price: "$15–30", tier: 2, location: "Performance Corridor", description: "Patio para catas de vino, flights y charcutería.", yelp: "https://www.yelp.com/biz/mendocino-terrace-anaheim" },
    { name: "Sonoma Terrace", type: "Cerveza & lounge", category: "Bar/Lounge", price: "$12–22", tier: 2, location: "Performance Corridor", description: "Cervezas artesanales de California, sidra, cócteles y pretzels.", yelp: "https://www.yelp.com/biz/sonoma-terrace-anaheim" },
    { name: "Bayside Brews", type: "Cerveza artesanal", category: "Bar/Lounge", price: "$10–18", tier: 1, location: "Pixar Pier", description: "Ventana con cervezas de barril, sidra y pretzels de Mickey.", yelp: "https://www.yelp.com/biz/bayside-brews-anaheim" },
    { name: "Fiddler, Fifer & Practical Cafe", type: "Café (Starbucks)", category: "Café", price: "$6–14", tier: 1, location: "Buena Vista Street", description: "El Starbucks del parque + pastelería y desayunos Disney.", yelp: "https://www.yelp.com/biz/fiddler-fifer-and-practical-cafe-anaheim" },
    { name: "Clarabelle's Hand-Scooped Ice Cream", type: "Helados", category: "Postre", price: "$6–12", tier: 1, location: "Buena Vista Street", description: "Sundaes, barras de helado bañadas al momento y floats.", yelp: "https://www.yelp.com/biz/clarabelles-hand-scooped-ice-cream-anaheim" },
    { name: "Cozy Cone Motel", type: "Snacks en cono", category: "Postre", price: "$6–12", tier: 1, location: "Cars Land", description: "5 conos temáticos: chili cone queso, popcorn, churros o soft-serve.", yelp: "https://www.yelp.com/biz/cozy-cone-motel-anaheim" },
    { name: "Schmoozies!", type: "Smoothies & dulces", category: "Postre", price: "$7–12", tier: 1, location: "Hollywood Land", description: "Smoothies de fruta, donas de temporada y café helado.", yelp: "https://www.yelp.com/biz/schmoozies-anaheim" },
    { name: "Adorable Snowman Frosted Treats", type: "Postres", category: "Postre", price: "$6–10", tier: 1, location: "Pixar Pier", description: "Soft-serve de limón sin lácteos y el 'Pixar Pier Frosty Parfait'.", yelp: "https://www.yelp.com/biz/adorable-snowman-frosted-treats-anaheim" },
    { name: "Ghirardelli Soda Fountain & Chocolate Shop", type: "Postres / chocolate", category: "Postre", price: "$8–15", tier: 1, location: "San Fransokyo Square", description: "Sundaes de hot fudge, malteadas y chocolate caliente premium.", yelp: "https://www.yelp.com/biz/ghirardelli-soda-fountain-and-chocolate-shop-anaheim" },
  ],
  suggestedRoute: [
    { time: "13:45", title: "Llegada (park hop) + Radiator Springs Racers", note: "La fila más larga de DCA — entra de una o saca Lightning Lane." },
    { time: "14:30", title: "Guardians of the Galaxy – Mission: BREAKOUT!", note: "Avengers Campus." },
    { time: "15:05", title: "WEB SLINGERS: A Spider-Man Adventure", note: "Justo al lado, en Avengers Campus." },
    { time: "15:45", title: "Incredicoaster + Toy Story Mania", note: "Pixar Pier." },
    { time: "16:45", title: "Soarin' Around the World", note: "Grizzly Peak — clásico imperdible." },
    { time: "17:30", title: "Grizzly River Run", note: "¡Te mojas! Ideal para la tarde." },
    { time: "18:15", title: "Cena en Lamplight Lounge", note: "Los Lobster Nachos son obligatorios." },
    { time: "19:30", title: "Cars Land de noche", note: "Los neones de Radiator Springs encienden — foto obligada." },
    { time: "21:00", title: "World of Color (si hay show)", note: "Espectáculo nocturno de agua y luces en Paradise Bay." },
  ],
};

export const PARKS_DATA: Record<Park, ParkInfo> = {
  disneyland: DISNEYLAND,
  "disney-california-adventure": DCA,
  "six-flags": SIX_FLAGS,
};
