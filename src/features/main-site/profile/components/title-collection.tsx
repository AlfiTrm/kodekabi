"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { equipTitleAction } from "../actions/equip-title-action";
import type { UserTitle } from "../types/profile";

export function TitleCollection({ titles }: { titles: UserTitle[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function equip(titleId: string) {
    setPendingId(titleId);
    setMessage(null);
    startTransition(async () => {
      const result = await equipTitleAction(titleId);
      if (!result.success) setMessage(result.message);
      else router.refresh();
      setPendingId(null);
    });
  }

  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3"><h2 className="text-xs font-bold">Koleksi gelar</h2><span className="font-mono text-[7px] uppercase text-foreground/25">{titles.filter((title) => title.is_owned).length}/{titles.length} terbuka</span></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {titles.map((title) => {
          const locked = !title.is_equipped && (!title.is_owned || !title.can_equip);
          return <button key={title.title_id} type="button" disabled={locked || title.is_equipped || pendingId !== null} onClick={() => equip(title.title_id)} className={`rounded-full border px-4 py-2 text-left text-[10px] font-semibold transition-colors ${title.is_equipped ? "border-orange bg-orange/10 text-foreground" : locked ? "cursor-not-allowed border-dashed border-border-strong text-foreground/35" : "border-border-strong text-foreground/70 hover:border-orange hover:text-foreground"}`}>
            {locked ? "🔒 " : ""}{title.title}{!title.is_equipped && !title.is_owned ? ` · LV ${title.unlock_level}` : !title.is_equipped && locked ? " · Tidak tersedia" : pendingId === title.title_id ? " · Memakai..." : ""}
          </button>;
        })}
      </div>
      {message ? <p className="mt-3 text-[9px] text-red">{message}</p> : null}
    </section>
  );
}
