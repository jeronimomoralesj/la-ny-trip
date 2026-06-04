/**
 * Seeds Firestore with the trip data.
 *
 *   1. Firebase console → Project settings → Service accounts → Generate key
 *   2. Save it as ./serviceAccount.json  (git-ignored)
 *   3. npm run seed
 *
 * Also creates the 4 auth users (password: "worldcup2026") if they don't exist.
 */
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import {
  SEED_USERS, SEED_LOCATIONS, SEED_TIMELINE, SEED_FLIGHTS, SEED_EXPENSES,
  SEED_PHOTOS, SEED_DOCUMENTS, SEED_POSTS, SEED_CHECKLISTS, SEED_RIDES,
  SEED_FOOD, SEED_ELECTION_NOTES, SEED_ELECTION_TASKS, SEED_ANNOUNCEMENTS,
} from "../src/lib/seed-data";

const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? "./serviceAccount.json";
const serviceAccount = JSON.parse(readFileSync(path, "utf8"));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const auth = getAuth();

const COLLECTIONS: Record<string, any[]> = {
  users: SEED_USERS,
  locations: SEED_LOCATIONS,
  timelineEvents: SEED_TIMELINE,
  flights: SEED_FLIGHTS,
  expenses: SEED_EXPENSES,
  photos: SEED_PHOTOS,
  documents: SEED_DOCUMENTS,
  posts: SEED_POSTS,
  checklists: SEED_CHECKLISTS,
  rides: SEED_RIDES,
  restaurants: SEED_FOOD,
  electionNotes: SEED_ELECTION_NOTES,
  electionTasks: SEED_ELECTION_TASKS,
  announcements: SEED_ANNOUNCEMENTS,
};

async function seedFirestore() {
  for (const [name, items] of Object.entries(COLLECTIONS)) {
    const batch = db.batch();
    for (const item of items) {
      batch.set(db.collection(name).doc(item.id), item);
    }
    await batch.commit();
    console.log(`✓ ${name}: ${items.length} docs`);
  }
}

async function seedAuthUsers() {
  for (const u of SEED_USERS) {
    try {
      await auth.getUserByEmail(u.email);
      console.log(`• auth user exists: ${u.email}`);
    } catch {
      await auth.createUser({ uid: u.id, email: u.email, password: "worldcup2026", displayName: u.name });
      console.log(`✓ created auth user: ${u.email} (pw: worldcup2026)`);
    }
  }
}

async function main() {
  console.log("Seeding Firestore…");
  await seedFirestore();
  console.log("\nSeeding Auth users…");
  await seedAuthUsers();
  console.log("\n✅ Done. Login with any of the 4 emails, password: worldcup2026");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
