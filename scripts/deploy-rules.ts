/**
 * Publica las reglas de Firestore SIN necesidad del firebase CLI ni login.
 * Solo necesita el serviceAccount.json (el mismo del seed).
 *
 *   1. Guarda la llave en ./serviceAccount.json
 *   2. npm run deploy:rules
 *
 * (Habilitar el inicio de sesión Anónimo SÍ debe hacerse en la consola:
 *  Authentication → Sign-in method → Anónimo → Habilitar.)
 */
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getSecurityRules } from "firebase-admin/security-rules";

const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? "./serviceAccount.json";
const serviceAccount = JSON.parse(readFileSync(path, "utf8"));
const rules = readFileSync("./firestore.rules", "utf8");

const app = initializeApp({ credential: cert(serviceAccount) });

async function main() {
  console.log("Publicando reglas de Firestore…");
  await getSecurityRules(app).releaseFirestoreRulesetFromSource(rules);
  console.log("✅ Reglas publicadas. Ahora cualquier usuario autenticado puede leer/escribir.");
  console.log("⚠️  Falta solo: Authentication → Sign-in method → habilitar 'Anónimo' (y 'Correo/Contraseña').");
  process.exit(0);
}

main().catch((e) => { console.error("Error:", e?.message ?? e); process.exit(1); });
