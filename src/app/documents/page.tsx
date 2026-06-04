"use client";

import { useRef, useState } from "react";
import {
  FileText, Plane, Hotel, Ticket, BadgeCheck, CreditCard,
  Folder, Upload, Download, Loader2, FolderLock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { uploadFile } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { SectionTitle } from "@/components/ui/misc";
import { parseISO } from "date-fns";
import { fmt } from "@/lib/utils";
import type { TravelDocument, DocumentKind } from "@/lib/types";

const KIND_ICON: Record<DocumentKind, any> = {
  flight: Plane, reservation: Hotel, ticket: Ticket, confirmation: BadgeCheck, id: CreditCard, other: FileText,
};
const FOLDERS = ["Todos", "Vuelos", "Hoteles", "Mundial", "Parques", "Transporte", "IDs"];

export default function DocumentsPage() {
  const { user } = useAuth();
  const { data: docs, add } = useCollection<TravelDocument>("documents");
  const [folder, setFolder] = useState("Todos");
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState("Vuelos");
  const fileRef = useRef<HTMLInputElement>(null);

  const folders = Array.from(new Set([...FOLDERS, ...docs.map((d) => d.folder)]));
  const filtered = folder === "Todos" ? docs : docs.filter((d) => d.folder === folder);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "documents");
      const kind: DocumentKind = file.type.includes("image") ? "ticket" : "reservation";
      add.mutate({
        name: file.name, kind, folder: newFolder, url, mimeType: file.type || "application/octet-stream",
        uploaderId: user?.id ?? "jeronimo", uploadedAt: new Date().toISOString(), sizeKb: Math.round(file.size / 1024),
      } as Omit<TravelDocument, "id">);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Operaciones"
        title="Baúl de Documentos"
        action={
          <div className="flex items-center gap-2">
            <Select value={newFolder} onChange={(e) => setNewFolder(e.target.value)} className="h-9 w-32">
              {folders.filter((f) => f !== "Todos").map((f) => <option key={f}>{f}</option>)}
            </Select>
            <Button variant="gold" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Subir
            </Button>
            <input ref={fileRef} type="file" className="hidden" onChange={onUpload} />
          </div>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${folder === f ? "border-electric-500/50 bg-electric-500/15 text-white" : "border-white/10 text-muted-foreground hover:text-foreground"}`}
          >
            <Folder className="size-3.5" /> {f}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => {
            const Icon = KIND_ICON[d.kind];
            const isImg = d.mimeType.includes("image") && d.url !== "#";
            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass glass-hover overflow-hidden rounded-2xl">
                <div className="grid h-32 place-items-center bg-gradient-to-br from-navy-700/60 to-navy-800/60">
                  {isImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.url} alt={d.name} className="h-full w-full object-cover" />
                  ) : (
                    <Icon className="size-10 text-electric-400/70" />
                  )}
                </div>
                <div className="p-4">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{d.folder} · {d.sizeKb ?? "—"} KB</span>
                    <span>{fmt(parseISO(d.uploadedAt), "d MMM")}</span>
                  </div>
                  <Button
                    variant="outline" size="sm" className="mt-3 w-full"
                    onClick={() => d.url !== "#" ? window.open(d.url, "_blank") : null}
                    disabled={d.url === "#"}
                  >
                    <Download className="size-3.5" /> {d.url === "#" ? "Ejemplo (sin archivo)" : "Abrir / Descargar"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <FolderLock className="size-8 text-muted-foreground/40" />
          <p className="text-muted-foreground">No hay documentos en esta carpeta.</p>
        </div>
      )}
    </div>
  );
}
