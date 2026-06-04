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
//  Trip narrative — Colombia → Los Angeles → New York → home to vote
//  Anchored to the 2026 FIFA World Cup window. Trip: Jun 8–21 2026.
// ──────────────────────────────────────────────────────────────

export const SEED_USERS: AppUser[] = [
  { id: "jeronimo", name: "Jeronimo", email: "jeronimo@lanyviaje.com", role: "admin", avatarColor: "#3b82f6", initials: "JE" },
  { id: "mateo", name: "Mateo", email: "mateo@lanyviaje.com", role: "member", avatarColor: "#f5c451", initials: "MA" },
  { id: "santiago", name: "Santiago", email: "santiago@lanyviaje.com", role: "member", avatarColor: "#22d3ee", initials: "SA" },
  { id: "user4", name: "User4", email: "user4@lanyviaje.com", role: "member", avatarColor: "#a78bfa", initials: "U4" },
];

export const TRIP_START = "2026-06-08T00:00:00-05:00";
export const TRIP_END = "2026-06-21T23:59:59-05:00";
export const ELECTION_DAY = "2026-06-21T08:00:00-05:00";

export const PHASES: PhaseMeta[] = [
  { id: "pre-departure", label: "Pre-Departure", city: "Bogotá", start: "2026-05-01T00:00:00-05:00", end: "2026-06-08T05:00:00-05:00", accent: "#64748b" },
  { id: "traveling-to-la", label: "Traveling to Los Angeles", city: "In Transit", start: "2026-06-08T05:00:00-05:00", end: "2026-06-08T20:00:00-07:00", accent: "#3b82f6" },
  { id: "la-operations", label: "Los Angeles Operations", city: "Los Angeles", start: "2026-06-08T20:00:00-07:00", end: "2026-06-13T08:00:00-07:00", accent: "#f5c451" },
  { id: "disneyland-day", label: "Disneyland Day", city: "Anaheim", start: "2026-06-11T07:00:00-07:00", end: "2026-06-11T23:00:00-07:00", accent: "#ec4899" },
  { id: "traveling-to-ny", label: "Traveling to New York", city: "In Transit", start: "2026-06-13T08:00:00-07:00", end: "2026-06-13T18:00:00-04:00", accent: "#3b82f6" },
  { id: "ny-operations", label: "New York Operations", city: "New York", start: "2026-06-13T18:00:00-04:00", end: "2026-06-20T22:00:00-04:00", accent: "#22d3ee" },
  { id: "return-to-colombia", label: "Return to Colombia", city: "In Transit", start: "2026-06-20T22:00:00-04:00", end: "2026-06-21T07:00:00-05:00", accent: "#3b82f6" },
  { id: "election-day", label: "Election Day — Vote!", city: "Bogotá", start: "2026-06-21T07:00:00-05:00", end: "2026-06-21T23:59:00-05:00", accent: "#22c55e" },
];

export const SEED_LOCATIONS: TripLocation[] = [
  { id: "bog", name: "El Dorado International (BOG)", description: "Departure airport — Bogotá", category: "airport", city: "Bogotá", lng: -74.1469, lat: 4.7016 },
  { id: "lax", name: "Los Angeles International (LAX)", description: "Arrival hub in California", category: "airport", city: "Los Angeles", lng: -118.4085, lat: 33.9416 },
  { id: "jfk", name: "John F. Kennedy International (JFK)", description: "Arrival hub in New York", category: "airport", city: "New York", lng: -73.7781, lat: 40.6413 },
  { id: "la-hotel", name: "Hotel — Downtown LA", description: "Group base camp in Los Angeles", category: "hotel", city: "Los Angeles", lng: -118.2509, lat: 34.0489 },
  { id: "ny-hotel", name: "Hotel — Midtown Manhattan", description: "Group base camp in New York", category: "hotel", city: "New York", lng: -73.9845, lat: 40.7549 },
  { id: "disneyland", name: "Disneyland Park", description: "Theme park day — Anaheim", category: "theme-park", city: "Anaheim", lng: -117.9189, lat: 33.8121 },
  { id: "sixflags", name: "Six Flags Magic Mountain", description: "Coaster capital — Valencia", category: "theme-park", city: "Valencia", lng: -118.5953, lat: 34.4253 },
  { id: "sofi", name: "SoFi Stadium", description: "World Cup matches — Inglewood", category: "stadium", city: "Los Angeles", lng: -118.3392, lat: 33.9535 },
  { id: "metlife", name: "MetLife Stadium", description: "World Cup Final venue — NJ", category: "stadium", city: "New York", lng: -74.0745, lat: 40.8135 },
  { id: "la-fanfest", name: "LA Fan Festival", description: "FIFA Fan Fest — Exposition Park", category: "fan-fest", city: "Los Angeles", lng: -118.2872, lat: 34.0169 },
  { id: "ny-fanfest", name: "NYC Fan Festival", description: "FIFA Fan Fest — Liberty State Park", category: "fan-fest", city: "New York", lng: -74.0539, lat: 40.7058 },
  { id: "santa-monica", name: "Santa Monica Pier", description: "Sunset + ocean", category: "landmark", city: "Los Angeles", lng: -118.4977, lat: 34.0094 },
  { id: "times-square", name: "Times Square", description: "Neon heart of Manhattan", category: "landmark", city: "New York", lng: -73.9855, lat: 40.758 },
  { id: "grives", name: "Grandma's — Family in LA", description: "Family lunch stop", category: "family", city: "Los Angeles", lng: -118.41, lat: 34.02 },
  { id: "guelaguetza", name: "Guelaguetza", description: "Legendary Oaxacan mole", category: "restaurant", city: "Los Angeles", lng: -118.2935, lat: 34.0577 },
  { id: "joes-pizza", name: "Joe's Pizza", description: "Greenwich Village slice", category: "restaurant", city: "New York", lng: -74.0027, lat: 40.7305 },
  { id: "la-parking", name: "SoFi Lot C", description: "Match-day parking", category: "parking", city: "Los Angeles", lng: -118.337, lat: 33.951 },
];

const loc = (id: string) => SEED_LOCATIONS.find((l) => l.id === id)!;

export const SEED_TIMELINE: TimelineEvent[] = [
  { id: "t1", day: "2026-06-08", city: "Bogotá", phase: "traveling-to-la", title: "Departure — BOG → LAX", description: "Wheels up from El Dorado. 9h direct to Los Angeles.", start: "2026-06-08T06:30:00-05:00", end: "2026-06-08T12:30:00-07:00", locationId: "bog", lng: loc("bog").lng, lat: loc("bog").lat, notes: "Be at airport 3h early. Group check-in at counter 22.", icon: "Plane" },
  { id: "t2", day: "2026-06-08", city: "Los Angeles", phase: "la-operations", title: "Land at LAX + rental car", description: "Collect bags, pick up the rental, drive to Downtown base camp.", start: "2026-06-08T13:00:00-07:00", end: "2026-06-08T15:30:00-07:00", locationId: "lax", lng: loc("lax").lng, lat: loc("lax").lat, icon: "Car" },
  { id: "t3", day: "2026-06-09", city: "Los Angeles", phase: "la-operations", title: "World Cup Match @ SoFi", description: "Group-stage match. Wear the jerseys.", start: "2026-06-09T16:00:00-07:00", end: "2026-06-09T19:00:00-07:00", locationId: "sofi", lng: loc("sofi").lng, lat: loc("sofi").lat, notes: "Mobile tickets in the Documents vault.", icon: "Trophy" },
  { id: "t4", day: "2026-06-10", city: "Los Angeles", phase: "la-operations", title: "Family lunch", description: "Lunch with family in LA, then Santa Monica at sunset.", start: "2026-06-10T12:00:00-07:00", end: "2026-06-10T18:00:00-07:00", locationId: "grives", lng: loc("grives").lng, lat: loc("grives").lat, icon: "Heart" },
  { id: "t5", day: "2026-06-11", city: "Anaheim", phase: "disneyland-day", title: "Disneyland — full day", description: "Rope drop to fireworks. Track every ride.", start: "2026-06-11T07:30:00-07:00", end: "2026-06-11T22:30:00-07:00", locationId: "disneyland", lng: loc("disneyland").lng, lat: loc("disneyland").lat, notes: "Genie+ purchased. Meet at the Castle if separated.", icon: "Castle" },
  { id: "t6", day: "2026-06-12", city: "Valencia", phase: "la-operations", title: "Six Flags Magic Mountain", description: "Coaster marathon before flying east.", start: "2026-06-12T10:00:00-07:00", end: "2026-06-12T19:00:00-07:00", locationId: "sixflags", lng: loc("sixflags").lng, lat: loc("sixflags").lat, icon: "Rocket" },
  { id: "t7", day: "2026-06-13", city: "Los Angeles", phase: "traveling-to-ny", title: "Fly LAX → JFK", description: "Transcontinental hop to New York.", start: "2026-06-13T09:00:00-07:00", end: "2026-06-13T17:30:00-04:00", locationId: "lax", lng: loc("lax").lng, lat: loc("lax").lat, icon: "Plane" },
  { id: "t8", day: "2026-06-14", city: "New York", phase: "ny-operations", title: "NYC Fan Festival", description: "Liberty State Park fan fest + skyline.", start: "2026-06-14T13:00:00-04:00", end: "2026-06-14T20:00:00-04:00", locationId: "ny-fanfest", lng: loc("ny-fanfest").lng, lat: loc("ny-fanfest").lat, icon: "PartyPopper" },
  { id: "t9", day: "2026-06-16", city: "New York", phase: "ny-operations", title: "Manhattan day", description: "Times Square, Central Park, the slice at Joe's.", start: "2026-06-16T10:00:00-04:00", end: "2026-06-16T22:00:00-04:00", locationId: "times-square", lng: loc("times-square").lng, lat: loc("times-square").lat, icon: "Building2" },
  { id: "t10", day: "2026-06-19", city: "New York", phase: "ny-operations", title: "World Cup @ MetLife", description: "The big one. Last match of the trip.", start: "2026-06-19T15:00:00-04:00", end: "2026-06-19T18:30:00-04:00", locationId: "metlife", lng: loc("metlife").lng, lat: loc("metlife").lat, icon: "Trophy" },
  { id: "t11", day: "2026-06-20", city: "New York", phase: "return-to-colombia", title: "Red-eye JFK → BOG", description: "Overnight flight home.", start: "2026-06-20T23:30:00-04:00", end: "2026-06-21T06:30:00-05:00", locationId: "jfk", lng: loc("jfk").lng, lat: loc("jfk").lat, notes: "Land, drop bags, go vote.", icon: "Plane" },
  { id: "t12", day: "2026-06-21", city: "Bogotá", phase: "election-day", title: "Land + VOTE", description: "Straight from the airport to the polling station.", start: "2026-06-21T08:00:00-05:00", end: "2026-06-21T12:00:00-05:00", locationId: "bog", lng: loc("bog").lng, lat: loc("bog").lat, notes: "Bring cédula. Verify polling location the night before.", icon: "Vote" },
];

export const SEED_FLIGHTS: Flight[] = [
  { id: "f1", airline: "Avianca", flightNumber: "AV 0086", from: { code: "BOG", city: "Bogotá", lng: -74.1469, lat: 4.7016 }, to: { code: "LAX", city: "Los Angeles", lng: -118.4085, lat: 33.9416 }, departure: "2026-06-08T06:30:00-05:00", arrival: "2026-06-08T12:30:00-07:00", terminal: "Intl", gate: "B12", seat: "21A–21D", status: "scheduled", confirmation: "AVN8X2" },
  { id: "f2", airline: "Delta", flightNumber: "DL 1845", from: { code: "LAX", city: "Los Angeles", lng: -118.4085, lat: 33.9416 }, to: { code: "JFK", city: "New York", lng: -73.7781, lat: 40.6413 }, departure: "2026-06-13T09:00:00-07:00", arrival: "2026-06-13T17:30:00-04:00", terminal: "2", gate: "C34", seat: "14A–14D", status: "scheduled", confirmation: "DL5KQ9" },
  { id: "f3", airline: "Avianca", flightNumber: "AV 0245", from: { code: "JFK", city: "New York", lng: -73.7781, lat: 40.6413 }, to: { code: "BOG", city: "Bogotá", lng: -74.1469, lat: 4.7016 }, departure: "2026-06-20T23:30:00-04:00", arrival: "2026-06-21T06:30:00-05:00", terminal: "4", gate: "B22", seat: "30A–30D", status: "scheduled", confirmation: "AVN7H1" },
];

export const SEED_EXPENSES: Expense[] = [
  { id: "e1", title: "Rental car (5 days)", amount: 420, category: "transport", payerId: "jeronimo", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-08" },
  { id: "e2", title: "Downtown LA hotel (4 nts)", amount: 1240, category: "lodging", payerId: "santiago", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-08" },
  { id: "e3", title: "Gas — LA driving", amount: 88, category: "gas", payerId: "mateo", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-10" },
  { id: "e4", title: "Guelaguetza dinner", amount: 164, category: "food", payerId: "user4", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-09" },
  { id: "e5", title: "Disneyland tickets x4", amount: 776, category: "tickets", payerId: "jeronimo", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-11" },
  { id: "e6", title: "Souvenirs — jersey", amount: 110, category: "souvenirs", payerId: "mateo", participantIds: ["mateo"], shared: false, date: "2026-06-09" },
  { id: "e7", title: "Coffee + churros", amount: 24, category: "drinks", payerId: "santiago", participantIds: ["santiago"], shared: false, date: "2026-06-11" },
  { id: "e8", title: "SoFi parking", amount: 60, category: "parking", payerId: "santiago", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-09" },
  { id: "e9", title: "Groceries / snacks", amount: 52, category: "groceries", payerId: "user4", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-10" },
  { id: "e10", title: "Uber to Santa Monica", amount: 38, category: "transport", payerId: "mateo", participantIds: ["jeronimo", "mateo", "santiago", "user4"], shared: true, date: "2026-06-10" },
];

const U = "https://images.unsplash.com/";
export const SEED_PHOTOS: Photo[] = [
  { id: "p1", url: `${U}photo-1502920917128-1aa500764cbd?w=900&q=80`, uploaderId: "jeronimo", uploadedAt: "2026-06-08T14:00:00-07:00", title: "Touchdown LA", city: "Los Angeles", tags: ["arrival", "lax"], lng: -118.4085, lat: 33.9416 },
  { id: "p2", url: `${U}photo-1605723517503-3cadb5818a0c?w=900&q=80`, uploaderId: "santiago", uploadedAt: "2026-06-09T18:00:00-07:00", title: "SoFi under lights", city: "Los Angeles", tags: ["worldcup", "stadium"], lng: -118.3392, lat: 33.9535 },
  { id: "p3", url: `${U}photo-1610833025592-7e4d9d54f50f?w=900&q=80`, uploaderId: "mateo", uploadedAt: "2026-06-10T19:30:00-07:00", title: "Santa Monica sunset", city: "Los Angeles", tags: ["beach", "sunset"], lng: -118.4977, lat: 34.0094 },
  { id: "p4", url: `${U}photo-1597466599360-3b9775841aec?w=900&q=80`, uploaderId: "user4", uploadedAt: "2026-06-11T21:00:00-07:00", title: "Castle fireworks", city: "Anaheim", tags: ["disneyland"], lng: -117.9189, lat: 33.8121 },
  { id: "p5", url: `${U}photo-1496442226666-8d4d0e62e6e9?w=900&q=80`, uploaderId: "jeronimo", uploadedAt: "2026-06-14T15:00:00-04:00", title: "Manhattan skyline", city: "New York", tags: ["nyc", "skyline"], lng: -73.9845, lat: 40.7549 },
  { id: "p6", url: `${U}photo-1534430480872-3498386e7856?w=900&q=80`, uploaderId: "santiago", uploadedAt: "2026-06-16T20:00:00-04:00", title: "Times Square neon", city: "New York", tags: ["nyc", "neon"], lng: -73.9855, lat: 40.758 },
];

export const SEED_DOCUMENTS: TravelDocument[] = [
  { id: "d1", name: "BOG→LAX Boarding Passes", kind: "flight", folder: "Flights", url: "#", mimeType: "application/pdf", uploaderId: "jeronimo", uploadedAt: "2026-06-01T10:00:00-05:00", sizeKb: 240 },
  { id: "d2", name: "Downtown LA Hotel Reservation", kind: "reservation", folder: "Hotels", url: "#", mimeType: "application/pdf", uploaderId: "santiago", uploadedAt: "2026-05-20T10:00:00-05:00", sizeKb: 180 },
  { id: "d3", name: "SoFi Match Tickets", kind: "ticket", folder: "World Cup", url: "#", mimeType: "image/png", uploaderId: "mateo", uploadedAt: "2026-05-22T10:00:00-05:00", sizeKb: 420 },
  { id: "d4", name: "Disneyland Tickets x4", kind: "ticket", folder: "Theme Parks", url: "#", mimeType: "application/pdf", uploaderId: "jeronimo", uploadedAt: "2026-05-25T10:00:00-05:00", sizeKb: 320 },
  { id: "d5", name: "Midtown NY Hotel Confirmation", kind: "confirmation", folder: "Hotels", url: "#", mimeType: "application/pdf", uploaderId: "user4", uploadedAt: "2026-05-26T10:00:00-05:00", sizeKb: 150 },
  { id: "d6", name: "Car Rental Agreement", kind: "reservation", folder: "Transport", url: "#", mimeType: "application/pdf", uploaderId: "jeronimo", uploadedAt: "2026-05-28T10:00:00-05:00", sizeKb: 200 },
];

export const SEED_POSTS: FeedPost[] = [
  { id: "fp1", authorId: "jeronimo", body: "Bags packed. See you all at El Dorado, counter 22, 3:30am sharp. ✈️", createdAt: "2026-06-07T22:00:00-05:00", reactions: { "🔥": ["mateo", "santiago"] } },
  { id: "fp2", authorId: "santiago", body: "Just landed at LAX. The rental is a black SUV — meet at door 3.", createdAt: "2026-06-08T13:10:00-07:00", reactions: { "🎉": ["jeronimo", "user4", "mateo"] } },
  { id: "fp3", authorId: "mateo", body: "SoFi is INSANE. The atmosphere is unreal 🏟️⚽", createdAt: "2026-06-09T17:30:00-07:00", reactions: { "⚽": ["jeronimo", "santiago"] } },
  { id: "fp4", authorId: "user4", body: "Meet at the Castle at 9pm for fireworks. Don't be late!", createdAt: "2026-06-11T20:00:00-07:00" },
];

export const SEED_CHECKLISTS: ChecklistItem[] = [
  { id: "c1", ownerId: "jeronimo", label: "Passport", checked: true, category: "Essentials" },
  { id: "c2", ownerId: "jeronimo", label: "US Visa", checked: true, category: "Essentials" },
  { id: "c3", ownerId: "jeronimo", label: "Cédula (for voting)", checked: true, category: "Essentials" },
  { id: "c4", ownerId: "jeronimo", label: "Chargers + power bank", checked: false, category: "Tech" },
  { id: "c5", ownerId: "jeronimo", label: "World Cup jersey", checked: true, category: "Clothing" },
  { id: "c6", ownerId: "jeronimo", label: "Sunscreen", checked: false, category: "Health" },
  { id: "c7", ownerId: "mateo", label: "Passport", checked: true, category: "Essentials" },
  { id: "c8", ownerId: "mateo", label: "Match tickets (mobile)", checked: true, category: "Essentials" },
  { id: "c9", ownerId: "mateo", label: "Comfortable shoes", checked: false, category: "Clothing" },
  { id: "c10", ownerId: "santiago", label: "Passport", checked: true, category: "Essentials" },
  { id: "c11", ownerId: "santiago", label: "Cash (USD)", checked: false, category: "Money" },
  { id: "c12", ownerId: "user4", label: "Passport", checked: false, category: "Essentials" },
  { id: "c13", ownerId: "user4", label: "Light jacket (NY)", checked: false, category: "Clothing" },
];

export const SEED_RIDES: Ride[] = [
  { id: "r1", park: "disneyland", name: "Space Mountain", land: "Tomorrowland", completed: true, rating: 5, completedBy: ["jeronimo", "mateo"] },
  { id: "r2", park: "disneyland", name: "Pirates of the Caribbean", land: "New Orleans Sq", completed: true, rating: 4, completedBy: ["jeronimo", "santiago", "user4"] },
  { id: "r3", park: "disneyland", name: "Matterhorn Bobsleds", land: "Fantasyland", completed: false },
  { id: "r4", park: "disneyland", name: "Indiana Jones Adventure", land: "Adventureland", completed: true, rating: 5, completedBy: ["mateo"] },
  { id: "r5", park: "disneyland", name: "Big Thunder Mountain", land: "Frontierland", completed: false },
  { id: "r6", park: "disneyland", name: "Haunted Mansion", land: "New Orleans Sq", completed: false },
  { id: "r7", park: "six-flags", name: "X2", land: "—", completed: true, rating: 5, completedBy: ["jeronimo", "mateo", "santiago"] },
  { id: "r8", park: "six-flags", name: "Twisted Colossus", land: "—", completed: true, rating: 4, completedBy: ["jeronimo"] },
  { id: "r9", park: "six-flags", name: "Tatsu", land: "—", completed: false },
  { id: "r10", park: "six-flags", name: "Goliath", land: "—", completed: false },
];

export const SEED_FOOD: FoodEntry[] = [
  { id: "fd1", name: "Guelaguetza", kind: "restaurant", city: "Los Angeles", rating: 5, notes: "Best mole of my life.", lng: -118.2935, lat: 34.0577, loggedBy: "user4", date: "2026-06-09", photoUrl: `${U}photo-1565299624946-b28f40a0ae38?w=600&q=80` },
  { id: "fd2", name: "Santa Monica taco stand", kind: "snack", city: "Los Angeles", rating: 4, notes: "Cheap and incredible.", lng: -118.4977, lat: 34.0094, loggedBy: "mateo", date: "2026-06-10" },
  { id: "fd3", name: "Joe's Pizza", kind: "restaurant", city: "New York", rating: 5, notes: "The classic NY slice.", lng: -74.0027, lat: 40.7305, loggedBy: "jeronimo", date: "2026-06-16", photoUrl: `${U}photo-1513104890138-7c749659a591?w=600&q=80` },
  { id: "fd4", name: "Brooklyn rooftop bar", kind: "bar", city: "New York", rating: 4, notes: "Skyline views at golden hour.", lng: -73.9903, lat: 40.7033, loggedBy: "santiago", date: "2026-06-17" },
];

export const SEED_WEATHER: WeatherSnapshot[] = [
  {
    city: "Los Angeles", temp: 26, feelsLike: 27, condition: "Sunny", icon: "01d", humidity: 45, wind: 12,
    hourly: Array.from({ length: 8 }, (_, i) => ({ time: `${(10 + i) % 24}:00`, temp: 24 + (i % 4), icon: i < 6 ? "01d" : "02d", condition: i < 6 ? "Sunny" : "Few clouds" })),
    daily: [
      { date: "2026-06-09", min: 18, max: 27, icon: "01d", condition: "Sunny" },
      { date: "2026-06-10", min: 19, max: 28, icon: "01d", condition: "Sunny" },
      { date: "2026-06-11", min: 18, max: 26, icon: "02d", condition: "Partly cloudy" },
      { date: "2026-06-12", min: 17, max: 25, icon: "01d", condition: "Sunny" },
      { date: "2026-06-13", min: 18, max: 27, icon: "01d", condition: "Sunny" },
    ],
    alerts: [],
    recommendations: ["Bring sunscreen — UV index high", "Sunglasses for the day matches", "Hydrate at the stadium"],
  },
  {
    city: "New York", temp: 22, feelsLike: 22, condition: "Partly cloudy", icon: "03d", humidity: 62, wind: 16,
    hourly: Array.from({ length: 8 }, (_, i) => ({ time: `${(10 + i) % 24}:00`, temp: 20 + (i % 3), icon: i === 4 ? "10d" : "03d", condition: i === 4 ? "Light rain" : "Clouds" })),
    daily: [
      { date: "2026-06-14", min: 16, max: 23, icon: "03d", condition: "Partly cloudy" },
      { date: "2026-06-15", min: 17, max: 24, icon: "10d", condition: "Light rain" },
      { date: "2026-06-16", min: 18, max: 25, icon: "02d", condition: "Mostly sunny" },
      { date: "2026-06-17", min: 17, max: 24, icon: "01d", condition: "Sunny" },
      { date: "2026-06-18", min: 18, max: 26, icon: "02d", condition: "Mostly sunny" },
    ],
    alerts: [{ title: "Light rain expected", description: "Showers likely on Jun 15 afternoon — pack a compact umbrella." }],
    recommendations: ["Rain expected Jun 15 — bring an umbrella", "Light jacket for evenings", "Comfortable walking shoes"],
  },
];

export const SEED_ELECTION_NOTES: ElectionNote[] = [
  { id: "en1", body: "Runoff is the morning we land. Plan: drop bags at home, head straight to the polling station together.", authorId: "jeronimo", createdAt: "2026-06-01T09:00:00-05:00" },
  { id: "en2", body: "Confirm everyone's puesto de votación on the Registraduría site before we fly out.", authorId: "santiago", createdAt: "2026-06-02T09:00:00-05:00" },
];

export const SEED_ELECTION_TASKS: ElectionTask[] = [
  { id: "et1", label: "Verify polling location (Registraduría)", done: false },
  { id: "et2", label: "Bring cédula", done: false },
  { id: "et3", label: "Flight landed on time", done: false },
  { id: "et4", label: "Head to voting station as a group", done: false },
  { id: "et5", label: "Vote!", done: false },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", title: "Departure logistics", body: "El Dorado, counter 22, 3:30am. Do not be late — boarding closes early.", createdAt: "2026-06-07T20:00:00-05:00", priority: "important" },
  { id: "a2", title: "Match day dress code", body: "Full kit for every World Cup match. We travel as one squad.", createdAt: "2026-06-06T12:00:00-05:00", priority: "info" },
  { id: "a3", title: "Election day reminder", body: "We vote the day we land. Cédula in hand-luggage, not checked bags.", createdAt: "2026-06-05T12:00:00-05:00", priority: "urgent" },
];
