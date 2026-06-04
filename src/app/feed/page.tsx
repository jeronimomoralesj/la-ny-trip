"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ImagePlus, Loader2 } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { useAuth } from "@/lib/auth-context";
import { compressImageToBase64 } from "@/hooks/use-upload";
import { notify } from "@/components/ui/toast";
import { SEED_USERS, resolveTravelerId } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { SectionTitle, Avatar } from "@/components/ui/misc";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { FeedPost } from "@/lib/types";

const user = (id: string) => SEED_USERS.find((u) => u.id === id);
const REACTIONS = ["🔥", "⚽", "🎉", "❤️", "😂"];

export default function FeedPage() {
  const { user: me } = useAuth();
  const { data: posts, add, update } = useCollection<FeedPost>("posts");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sorted = [...posts].sort((a, b) => +parseISO(b.createdAt) - +parseISO(a.createdAt));

  const post = async () => {
    if (!body.trim() && !image) return;
    setPosting(true);
    try {
      const imageUrl = image ? await compressImageToBase64(image) : undefined;
      await add.mutateAsync({
        authorId: resolveTravelerId(me?.id), body: body.trim(), createdAt: new Date().toISOString(),
        reactions: {}, ...(imageUrl ? { imageUrl } : {}),
      } as Omit<FeedPost, "id">);
      setBody(""); setImage(null);
    } catch {
      /* el toast de error ya se muestra */
    } finally {
      setPosting(false);
    }
  };

  const myId = resolveTravelerId(me?.id);
  const react = (p: FeedPost, emoji: string) => {
    const reactions = { ...(p.reactions ?? {}) };
    const list = new Set(reactions[emoji] ?? []);
    list.has(myId) ? list.delete(myId) : list.add(myId);
    reactions[emoji] = Array.from(list);
    update.mutate({ id: p.id, patch: { reactions } });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionTitle eyebrow="Escuadrón" title="Feed del Grupo" />

      <div className="glass rounded-2xl p-4">
        <div className="flex gap-3">
          <Avatar name={me?.name ?? ""} color={me?.avatarColor} size={40} />
          <div className="flex-1">
            <Textarea placeholder="Comparte algo con el escuadrón…" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[60px] border-0 bg-transparent focus-visible:ring-0" />
            {image && <div className="mt-1 text-xs text-electric-400">📎 {image.name}</div>}
            <div className="mt-2 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
                <ImagePlus className="size-4" /> Foto
              </Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
              <Button size="sm" onClick={post} disabled={posting}>
                {posting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {sorted.map((p) => {
            const u = user(p.authorId);
            return (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={u?.name ?? ""} color={u?.avatarColor} size={40} />
                  <div>
                    <div className="text-sm font-semibold">{u?.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(p.createdAt), { addSuffix: true, locale: es })}</div>
                  </div>
                </div>
                {p.body && <p className="mt-3 whitespace-pre-wrap text-sm">{p.body}</p>}
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className="mt-3 w-full rounded-xl" />
                )}
                <div className="mt-3 flex items-center gap-1.5">
                  {REACTIONS.map((emoji) => {
                    const count = p.reactions?.[emoji]?.length ?? 0;
                    const mine = p.reactions?.[emoji]?.includes(myId);
                    return (
                      <button
                        key={emoji}
                        onClick={() => react(p, emoji)}
                        className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm transition ${mine ? "border-electric-500/50 bg-electric-500/15" : "border-white/10 hover:bg-white/5"} ${count === 0 ? "opacity-50" : ""}`}
                      >
                        {emoji} {count > 0 && <span className="text-xs">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
