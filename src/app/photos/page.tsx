"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, MapPin, Calendar, Grid3x3, Map as MapIcon, Navigation, Loader2, LocateFixed, Crosshair } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { compressImageToBase64, extractGps } from "@/hooks/use-upload";
import { notify } from "@/components/ui/toast";
import { TripMap, type MapPin as Pin } from "@/components/map/trip-map";
import { Drawer, Modal } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { SectionTitle, Avatar } from "@/components/ui/misc";
import { SEED_USERS, resolveTravelerId } from "@/lib/seed-data";
import { parseISO } from "date-fns";
import { fmt } from "@/lib/utils";
import type { Photo } from "@/lib/types";

const userName = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;

export default function PhotosPage() {
  const { user } = useAuth();
  const { data: photos, add } = useCollection<Photo>("photos");
  const [view, setView] = useState("gallery");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Estado del modal de subida
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [tags, setTags] = useState("");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);

  const sorted = [...photos].sort((a, b) => +parseISO(b.uploadedAt) - +parseISO(a.uploadedAt));
  const geo = sorted.filter((p) => p.lat && p.lng);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
    setTitle(file.name.replace(/\.[^.]+$/, ""));
    setCity(""); setTags(""); setLoc(null);
    const gps = await extractGps(file); // ubicación desde EXIF si existe
    if (gps) { setLoc(gps); notify("Ubicación detectada en la foto (EXIF)", "info"); }
    if (fileRef.current) fileRef.current.value = "";
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { notify("Geolocalización no disponible.", "error"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); notify("Ubicación actual fijada ✓", "success"); },
      () => notify("No se pudo obtener tu ubicación.", "error"),
    );
  };

  const savePhoto = async () => {
    if (!pendingFile) return;
    setSaving(true);
    try {
      const url = await compressImageToBase64(pendingFile);
      await add.mutateAsync({
        url, uploaderId: resolveTravelerId(user?.id), uploadedAt: new Date().toISOString(),
        title: title.trim() || "Foto", city: city.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        ...(loc ? { lat: loc.lat, lng: loc.lng } : {}),
      } as Omit<Photo, "id">);
      notify("Foto subida", "success");
      setPendingFile(null); setPreview("");
    } catch {
      /* el toast de error ya se muestra */
    } finally {
      setSaving(false);
    }
  };

  const byDay = sorted.reduce<Record<string, Photo[]>>((acc, p) => {
    const d = p.uploadedAt.slice(0, 10);
    (acc[d] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Recuerdos"
        title="Baúl de Fotos"
        action={
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Tabs value={view} onChange={setView} tabs={[{ id: "gallery", label: "Galería", icon: Grid3x3 }, { id: "map", label: "Mapa", icon: MapIcon }, { id: "timeline", label: "Línea", icon: Calendar }]} />
            <Button variant="gold" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" /> Subir
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
          </div>
        }
      />

      {view === "gallery" && (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
          {sorted.map((p, i) => (
            <motion.button
              key={p.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
              onClick={() => setSelected(p)}
              className="group relative block w-full overflow-hidden rounded-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.title ?? "photo"} className="w-full transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <div>
                  <div className="text-sm font-medium text-white">{p.title}</div>
                  {p.lat && <div className="flex items-center gap-1 text-[11px] text-white/70"><MapPin className="size-3" /> ubicada</div>}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {view === "map" && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <TripMap
            pins={geo.map<Pin>((p) => ({ id: p.id, lng: p.lng!, lat: p.lat!, title: p.title ?? "Photo", subtitle: p.city, color: "#ec4899" }))}
            onSelect={(id) => setSelected(photos.find((p) => p.id === id) ?? null)}
            className="h-[60vh] w-full"
          />
          {geo.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">Aún no hay fotos con ubicación. Sube imágenes con GPS (EXIF) para verlas en el mapa.</p>}
        </div>
      )}

      {view === "timeline" && (
        <div className="space-y-6">
          {Object.entries(byDay).map(([day, items]) => (
            <div key={day}>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-electric-400">
                <Calendar className="size-4" /> {fmt(parseISO(day), "EEEE d 'de' MMMM")}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                {items.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={p.url} alt={p.title ?? ""} onClick={() => setSelected(p)} className="aspect-square w-full cursor-pointer rounded-lg object-cover transition hover:opacity-80" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} eyebrow="Recuerdo" title={selected?.title}>
        {selected && (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.url} alt={selected.title ?? ""} className="w-full rounded-xl" />
            <div className="flex items-center gap-2">
              <Avatar name={userName(selected.uploaderId)} color={SEED_USERS.find((u) => u.id === selected.uploaderId)?.avatarColor} size={28} />
              <span className="text-sm">{userName(selected.uploaderId)}</span>
              <span className="text-xs text-muted-foreground">· {fmt(parseISO(selected.uploadedAt), "d MMM yyyy")}</span>
            </div>
            {selected.description && <p className="text-sm text-muted-foreground">{selected.description}</p>}
            <div className="flex flex-wrap gap-2">
              {selected.city && <Badge variant="muted"><MapPin className="size-3" /> {selected.city}</Badge>}
              {selected.tags.map((t) => <Badge key={t} variant="default">#{t}</Badge>)}
            </div>
            {selected.lat && selected.lng ? (
              <>
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <iframe
                    title="photo-map" className="h-48 w-full"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.02}%2C${selected.lat - 0.015}%2C${selected.lng + 0.02}%2C${selected.lat + 0.015}&marker=${selected.lat}%2C${selected.lng}`}
                  />
                </div>
                <Button variant="glass" className="w-full" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`, "_blank")}>
                  <Navigation className="size-4" /> Mostrar dónde se tomó
                </Button>
              </>
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 p-3 text-center text-xs text-muted-foreground">Esta foto no tiene datos de GPS.</p>
            )}
          </div>
        )}
      </Drawer>

      {/* Modal de subida con título + ubicación */}
      <Modal open={!!pendingFile} onClose={() => { setPendingFile(null); setPreview(""); }} title="Nueva foto" maxWidth="max-w-lg">
        {pendingFile && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="max-h-52 w-full rounded-xl object-cover" />
            <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Ciudad (opcional)" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input placeholder="Tags: playa, mundial…" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div className="rounded-xl border border-white/10 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Ubicación (opcional)</span>
                <Button variant="outline" size="sm" onClick={useCurrentLocation}>
                  <LocateFixed className="size-3.5" /> Mi ubicación
                </Button>
              </div>
              <div className="overflow-hidden rounded-lg border border-white/10">
                <TripMap
                  pins={loc ? [{ id: "pick", lng: loc.lng, lat: loc.lat, title: title || "Aquí", color: "#ec4899" }] : []}
                  onPick={(lng, lat) => setLoc({ lat, lng })}
                  initialCenter={loc ? [loc.lng, loc.lat] : [-118.24, 34.05]}
                  initialZoom={loc ? 13 : 9}
                  className="h-44 w-full"
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Crosshair className="size-3" /> {loc ? `Pin en ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)} — toca el mapa para mover` : "Toca el mapa para poner un pin, o usa tu ubicación / EXIF"}
              </p>
            </div>

            <Button className="w-full" onClick={savePhoto} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} {saving ? "Subiendo…" : "Subir foto"}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
