"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc, addDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { localStore } from "@/lib/local-store";
import { notify } from "@/components/ui/toast";

function explain(err: any): string {
  const code = String(err?.code ?? err?.message ?? "");
  if (code.includes("permission-denied") || code.includes("insufficient"))
    return "Permiso denegado por Firestore. Revisa las reglas de seguridad (deben permitir lectura/escritura a usuarios autenticados).";
  if (code.includes("unavailable") || code.includes("network"))
    return "Sin conexión con Firestore. Revisa tu internet.";
  if (code.includes("not-found"))
    return "La base de datos Firestore no existe todavía. Créala en la consola de Firebase.";
  return "No se pudo guardar. " + code;
}

/**
 * One generic data hook for every Firestore collection.
 * - Firebase configured → real Firestore reads/writes.
 * - Otherwise           → local-first store (localStorage), seeded with the trip.
 */
export function useCollection<T extends { id: string }>(name: string) {
  const qc = useQueryClient();

  const query = useQuery<T[]>({
    queryKey: [name],
    queryFn: async () => {
      if (isFirebaseConfigured && db) {
        const snap = await getDocs(collection(db, name));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T[];
      }
      return localStore.list<T>(name);
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: [name] });

  const add = useMutation({
    mutationFn: async (item: Omit<T, "id"> & { id?: string }) => {
      if (isFirebaseConfigured && db) {
        if (item.id) {
          await setDoc(doc(db, name, item.id), item as any);
          return { ...(item as any), id: item.id } as T;
        }
        const ref = await addDoc(collection(db, name), item as any);
        return { ...(item as any), id: ref.id } as T;
      }
      return localStore.add<T>(name, item as any);
    },
    onSuccess: invalidate,
    onError: (e) => notify(explain(e), "error"),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<T> }) => {
      if (isFirebaseConfigured && db) {
        await updateDoc(doc(db, name, id), patch as any);
      } else {
        localStore.update<T>(name, id, patch);
      }
      return { id, patch };
    },
    onSuccess: invalidate,
    onError: (e) => notify(explain(e), "error"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, name, id));
      } else {
        localStore.remove(name, id);
      }
      return id;
    },
    onSuccess: invalidate,
    onError: (e) => notify(explain(e), "error"),
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    add,
    update,
    remove,
  };
}
