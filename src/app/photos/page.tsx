"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, MapPin, Calendar, Grid3x3, Map as MapIcon, Navigation, Loader2 } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { uploadFile, extractGps } from "@/hooks/use-upload";
import { TripMap, type MapPin as Pin } from "@/components/map/trip-map";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { SectionTitle, Avatar } from "@/components/ui/misc";
import { SEED_USERS } from "@/lib/seed-data";
import { format, parseISO } from "date-fns";
import type { Photo } from "@/lib/types";

const userName = (id: string) => SEED_USERS.find((u) => u.id === id)?.name ?? id;

export default function PhotosPage() {
  const { user } = useAuth();
  const { data: photos, add } = useCollection<Photo>("photos");
  const [view, setView] = useState("gallery");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sorted = [...photos].sort((a, b) => +parseISO(b.uploadedAt) - +parseISO(a.uploadedAt));
  const geo = sorted.filter((p) => p.lat && p.lng);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const [url, gps] = await Promise.all([uploadFile(file, "photos"), extractGps(file)]);
      add.mutate({
        url, uploaderId: user?.id ?? "jeronimo", uploadedAt: new Date().toISOString(),
        title: file.name.replace(/\.[^.]+$/, ""), tags: [], city: "",
        ...(gps ? { lat: gps.lat, lng: gps.lng } : {}),
      } as Omit<Photo, "id">);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
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
        eyebrow="Memories"
        title="Photo Vault"
        action={
          <div className="flex items-center gap-2">
            <Tabs value={view} onChange={setView} tabs={[{ id: "gallery", label: "Gallery", icon: Grid3x3 }, { id: "map", label: "Map", icon: MapIcon }, { id: "timeline", label: "Timeline", icon: Calendar }]} />
            <Button variant="gold" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
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
                  {p.lat && <div className="flex items-center gap-1 text-[11px] text-white/70"><MapPin className="size-3" /> located</div>}
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
          {geo.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No geotagged photos yet. Upload images with EXIF GPS to map them.</p>}
        </div>
      )}

      {view === "timeline" && (
        <div className="space-y-6">
          {Object.entries(byDay).map(([day, items]) => (
            <div key={day}>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-electric-400">
                <Calendar className="size-4" /> {format(parseISO(day), "EEEE, MMMM d")}
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

      <Drawer open={!!selected} onClose={() => setSelected(null)} eyebrow="Memory" title={selected?.title}>
        {selected && (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.url} alt={selected.title ?? ""} className="w-full rounded-xl" />
            <div className="flex items-center gap-2">
              <Avatar name={userName(selected.uploaderId)} color={SEED_USERS.find((u) => u.id === selected.uploaderId)?.avatarColor} size={28} />
              <span className="text-sm">{userName(selected.uploaderId)}</span>
              <span className="text-xs text-muted-foreground">· {format(parseISO(selected.uploadedAt), "MMM d, yyyy")}</span>
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
                  <Navigation className="size-4" /> Show where this was taken
                </Button>
              </>
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 p-3 text-center text-xs text-muted-foreground">No GPS data found in this photo.</p>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
