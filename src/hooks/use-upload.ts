"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase";

/** Upload a file to Firebase Storage when configured, else return a local object URL. */
export async function uploadFile(file: File, path: string): Promise<string> {
  if (isFirebaseConfigured && storage) {
    const r = ref(storage, `${path}/${Date.now()}-${file.name}`);
    await uploadBytes(r, file);
    return getDownloadURL(r);
  }
  // Demo fallback — ephemeral object URL (not persisted across reloads)
  return URL.createObjectURL(file);
}

/** Read a file as a base64 data URL (used to store documents inline, no Storage needed). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Downscale + compress an image to a base64 JPEG so it fits inline (Firestore's
 * 1MB doc limit) — no Firebase Storage required. Read GPS from the ORIGINAL
 * file first, since this re-encode strips EXIF.
 */
export async function compressImageToBase64(file: File, maxDim = 1280, quality = 0.72): Promise<string> {
  const dataUrl = await fileToBase64(file);
  const img = new Image();
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = dataUrl; });
  let { width, height } = img;
  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);
  let out = canvas.toDataURL("image/jpeg", quality);
  // Si sigue muy grande para Firestore, baja la calidad una vez más.
  if (out.length > 950_000) out = canvas.toDataURL("image/jpeg", 0.5);
  return out;
}

/** Extract GPS coordinates from an image's EXIF data, if present. */
export async function extractGps(file: File): Promise<{ lat: number; lng: number } | null> {
  try {
    const exifr = (await import("exifr")).default;
    const gps = await exifr.gps(file);
    if (gps && typeof gps.latitude === "number" && typeof gps.longitude === "number") {
      return { lat: gps.latitude, lng: gps.longitude };
    }
  } catch {
    /* no exif */
  }
  return null;
}
