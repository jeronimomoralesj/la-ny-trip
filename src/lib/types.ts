// ──────────────────────────────────────────────────────────────
//  la-ny-viaje — Firestore data model & shared TypeScript types
// ──────────────────────────────────────────────────────────────

export type Role = "admin" | "member";

/** Travelers split into two groups until they all meet in Los Angeles. */
export type TravelGroup = "bogota" | "boston" | "all";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string; // hex used for avatar gradient
  initials: string;
  group?: Exclude<TravelGroup, "all">; // which travel party they belong to
}

// ── Trip phases ───────────────────────────────────────────────
export type TripPhase =
  | "pre-departure"
  | "traveling-to-la"
  | "la-operations"
  | "disneyland-day"
  | "traveling-to-ny"
  | "ny-operations"
  | "return-to-colombia"
  | "election-day";

export interface PhaseMeta {
  id: TripPhase;
  label: string;
  city: string;
  start: string; // ISO
  end: string; // ISO
  accent: string; // hex
}

// ── Locations / Map ───────────────────────────────────────────
export type LocationCategory =
  | "airport"
  | "theme-park"
  | "fan-fest"
  | "restaurant"
  | "family"
  | "hotel"
  | "parking"
  | "stadium"
  | "landmark";

export interface TripLocation {
  id: string;
  name: string;
  description: string;
  category: LocationCategory;
  city: string;
  lng: number;
  lat: number;
}

// ── Timeline ──────────────────────────────────────────────────
export interface TimelineEvent {
  id: string;
  day: string; // ISO date (yyyy-MM-dd)
  city: string;
  phase: TripPhase;
  title: string;
  description: string;
  start: string; // ISO datetime
  end?: string; // ISO datetime
  locationId?: string;
  lng?: number;
  lat?: number;
  notes?: string;
  attachments?: { name: string; url: string }[];
  icon?: string;
  group?: TravelGroup; // which party this event applies to ("all" once together)
  suggested?: boolean; // true = optional plan suggestion for a free day
}

// ── Flights ───────────────────────────────────────────────────
export type FlightStatus = "scheduled" | "boarding" | "in-air" | "landed" | "delayed" | "cancelled";

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: { code: string; city: string; lng: number; lat: number };
  to: { code: string; city: string; lng: number; lat: number };
  departure: string; // ISO
  arrival: string; // ISO
  terminal?: string;
  gate?: string;
  seat?: string;
  status: FlightStatus;
  confirmation?: string;
  group?: TravelGroup;
}

// ── Expenses ──────────────────────────────────────────────────
export type ExpenseCategory =
  | "food"
  | "drinks"
  | "transport"
  | "lodging"
  | "tickets"
  | "souvenirs"
  | "groceries"
  | "gas"
  | "parking"
  | "other";

export interface Expense {
  id: string;
  title: string;
  amount: number; // USD
  category: ExpenseCategory;
  notes?: string;
  payerId: string;
  participantIds: string[]; // split equally among these
  shared: boolean;
  date: string; // ISO
}

// ── Photos ────────────────────────────────────────────────────
export interface Photo {
  id: string;
  url: string;
  uploaderId: string;
  uploadedAt: string; // ISO
  title?: string;
  description?: string;
  city?: string;
  tags: string[];
  lng?: number;
  lat?: number;
  width?: number;
  height?: number;
}

// ── Documents ─────────────────────────────────────────────────
export type DocumentKind = "flight" | "reservation" | "ticket" | "confirmation" | "id" | "other";

export interface TravelDocument {
  id: string;
  name: string;
  kind: DocumentKind;
  folder: string;
  url: string;
  mimeType: string;
  uploaderId: string;
  uploadedAt: string;
  sizeKb?: number;
}

// ── Group feed ────────────────────────────────────────────────
export interface FeedPost {
  id: string;
  authorId: string;
  body: string;
  imageUrl?: string;
  createdAt: string; // ISO
  reactions?: Record<string, string[]>; // emoji -> userIds
}

// ── Packing ───────────────────────────────────────────────────
export interface ChecklistItem {
  id: string;
  ownerId: string;
  label: string;
  checked: boolean;
  category?: string;
  bag?: string;   // qué maleta/bolso (carry-on, mochila, etc.)
  rfid?: string;  // etiqueta RFID/NFC opcional
}

// ── Theme parks ───────────────────────────────────────────────
export type Park = "disneyland" | "disney-california-adventure" | "six-flags";

export interface Ride {
  id: string;
  park: Park;
  name: string;
  land?: string;
  completed: boolean;
  rating?: number; // 1-5
  notes?: string;
  completedBy?: string[];
}

// ── Restaurants / food journal ────────────────────────────────
export type FoodKind = "restaurant" | "bar" | "cafe" | "snack";

export interface FoodEntry {
  id: string;
  name: string;
  kind: FoodKind;
  city: string;
  rating: number; // 1-5
  notes?: string;
  photoUrl?: string;
  lng?: number;
  lat?: number;
  loggedBy: string;
  date: string;
}

// ── Weather ───────────────────────────────────────────────────
export interface WeatherSnapshot {
  city: string;
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  hourly: { time: string; temp: number; icon: string; condition: string }[];
  daily: { date: string; min: number; max: number; icon: string; condition: string }[];
  alerts: { title: string; description: string }[];
  recommendations: string[];
}

// ── Elections ─────────────────────────────────────────────────
export interface ElectionNote {
  id: string;
  body: string;
  authorId: string;
  createdAt: string;
}

export interface ElectionTask {
  id: string;
  label: string;
  done: boolean;
}

// ── Group announcements ───────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  priority: "info" | "important" | "urgent";
}

// ── Settlement (computed) ─────────────────────────────────────
export interface Balance {
  userId: string;
  paid: number;
  owed: number;
  net: number; // paid - owed
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}
