import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { cityStats } from "../data/city-stats";
import { CityStatItem } from "./city-stat-item";

export function LobbyHero() {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-background sm:h-[720px]">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/video/video-town.webm" type="video/webm" />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 [background:linear-gradient(90deg,rgba(11,12,16,0.88)_0%,rgba(11,12,16,0.18)_42%,rgba(11,12,16,0.06)_62%,rgba(11,12,16,0.68)_100%),linear-gradient(180deg,rgba(11,12,16,0.5)_0%,transparent_28%,transparent_62%,rgba(11,12,16,0.92)_100%)]"
      />

      <SiteContainer className="relative z-10 h-full min-h-[720px] pt-28 sm:pt-32">
        <div className="animate-[hero-copy-in_650ms_cubic-bezier(0.16,1,0.3,1)_both]">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/65 sm:text-[10px]">
            Senin, 4 Agustus · Malam hari
          </p>
          <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] text-foreground sm:text-7xl">
            Kota Nusa<span className="text-red">.</span>
          </h1>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-red/55 bg-background/65 px-3 py-1.5 text-left text-[9px] font-bold uppercase text-foreground shadow-lg transition-colors hover:bg-red/20 sm:text-[10px] lg:absolute lg:right-10 lg:top-24 lg:mt-0"
        >
          <span className="size-2 shrink-0 rounded-full bg-red" aria-hidden="true" />
          <span className="truncate">Distrik Pasar: hoaks menyebar · lihat →</span>
        </button>

        <div className="absolute inset-x-5 bottom-7 sm:inset-x-6 sm:bottom-8 lg:inset-x-10">
          <div className="mx-auto grid max-w-xl grid-cols-2 place-items-center gap-x-3 gap-y-5 rounded-3xl border border-white/10 bg-background/55 px-3 py-4 shadow-2xl backdrop-blur-md sm:grid-cols-4 sm:rounded-none sm:border-x-0 sm:bg-background/30 sm:px-5">
            {cityStats.map((stat) => <CityStatItem key={stat.id} stat={stat} />)}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
