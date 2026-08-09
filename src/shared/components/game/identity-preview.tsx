import Image from "next/image";

import type { BannerCosmetic, TitleCosmetic } from "@/src/shared/types/game-cosmetic";
import { DecorativeTitle } from "./decorative-title";

type IdentityDetective = {
  name: string;
  image: string;
};

type IdentityStats = {
  level: number;
  cases: number;
  reputation: number;
  accuracy: number;
};

type IdentityPreviewProps = {
  nickname: string;
  detective: IdentityDetective;
  title: TitleCosmetic;
  banner: BannerCosmetic;
  stats: IdentityStats;
  showMetaCopy?: boolean;
};

const bannerClasses = {
  "nusa-file": "bg-red shadow-[0_10px_0_var(--red-shadow)]",
  "night-watch": "bg-purple shadow-[0_10px_0_var(--purple-shadow)]",
} as const;

export function IdentityPreview({ nickname, detective, title, banner, stats, showMetaCopy = true }: IdentityPreviewProps) {
  return (
    <section className={`relative mx-auto w-full max-w-[380px] ${showMetaCopy ? "pt-7" : ""}`} aria-label="Pratinjau identitas pemain">
      {showMetaCopy ? <p className="absolute inset-x-0 top-0 text-center text-[10px] uppercase tracking-[0.12em] text-foreground/45">Identitas auditormu</p> : null}
      <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl text-button-ink transition-[background-color,box-shadow] duration-300 ${bannerClasses[banner.style]}`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="absolute -left-3 top-12 font-display text-[4.5rem] font-bold uppercase leading-[0.78] tracking-normal text-button-ink/10 [writing-mode:vertical-rl] sm:text-[5.25rem]">KABIKODE</span>
          <span className="absolute inset-x-5 top-16 h-px bg-button-ink/15" />
        </div>
        <div className="absolute right-5 top-5 z-20 flex flex-col items-end gap-2 text-right text-white">
          <span className="rounded-full bg-button-ink/35 px-3 py-1 font-mono text-[9px] font-bold uppercase">Lv {stats.level}</span>
          <span className="font-mono text-[9px] uppercase leading-tight text-white/75"><strong className="block font-display text-xl text-white">{stats.cases}</strong>Kasus</span>
          <span className="font-mono text-[9px] uppercase leading-tight text-white/75"><strong className="block font-display text-xl text-white">{stats.reputation}</strong>Reputasi</span>
          <span className="font-mono text-[9px] uppercase leading-tight text-white/75"><strong className="block font-display text-xl text-white">{stats.accuracy}%</strong>Akurasi</span>
        </div>
        <Image src={detective.image} alt={detective.name} width={320} height={390} className="absolute inset-x-0 bottom-24 z-10 mx-auto h-[67%] w-auto object-contain object-bottom drop-shadow-[0_8px_0_rgba(15,17,24,0.16)]" />
        <div className="absolute inset-x-5 bottom-6 z-20 flex flex-col items-center">
          <p className="mb-3 font-display text-2xl font-bold uppercase tracking-[-0.03em] text-white sm:text-3xl">{nickname || "Nama Kamu"}</p>
          <DecorativeTitle title={title} />
        </div>
      </div>
      {showMetaCopy ? <p className="mt-6 text-center text-[10px] text-foreground/45">Title dan banner bisa diganti secara independen.</p> : null}
    </section>
  );
}

