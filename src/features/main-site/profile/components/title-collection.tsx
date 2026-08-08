import { DecorativeTitle } from "@/src/shared/components/game/decorative-title";

import type { ProfileTitle } from "../types/profile";
import { profileTitles } from "../data/profile";

type TitleCollectionProps = {
  selectedTitle: ProfileTitle;
};

export function TitleCollection({ selectedTitle }: TitleCollectionProps) {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between"><h2 className="text-xs font-bold">Koleksi gelar</h2><span className="font-mono text-[7px] uppercase text-foreground/25">dipakai: {selectedTitle.label}</span></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {profileTitles.map((title) => <span key={title.id} className={`rounded-xl border p-2 ${title.id === selectedTitle.id ? "border-orange bg-orange/8" : title.unlocked ? "border-border" : "border-dashed border-border-strong opacity-40"}`}><DecorativeTitle title={title} compact />{title.requirement ? <span className="ml-2 text-[7px] text-foreground/40">{title.requirement}</span> : null}</span>)}
      </div>
    </section>
  );
}
