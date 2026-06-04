"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc, addDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { localStore } from "@/lib/local-store";

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
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    add,
    update,
    remove,
  };
}
