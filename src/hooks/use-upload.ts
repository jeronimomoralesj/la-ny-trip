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
