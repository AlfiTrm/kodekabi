"use client";

import { useState } from "react";

import { LeaderboardBoard } from "@/src/features/main-site/leaderboard/components/leaderboard-board";
import { podiumEntries, rankedEntries } from "@/src/features/main-site/leaderboard/data/leaderboard";
import type { LeaderboardEntry } from "@/src/features/main-site/leaderboard/types/leaderboard";
import { SiteContainer } from "@/src/shared/components/layout/site-container";
import { Button } from "@/src/shared/components/ui/button";
import { FilterChip } from "@/src/shared/components/ui/filter-chip";

const periods = ["Minggu ini", "Bulan ini", "Sepanjang masa"] as const;
type Period = (typeof periods)[number];

const publicEntries: LeaderboardEntry[] = [
  ...rankedEntries,
  { rank: 8, username: "laila_faktual", initial: "L", level: 6, points: 1310, tone: "blue" },
];

export function PublicLeaderboardPage() {
  const [period, setPeriod] = useState<Period>("Minggu ini");

  return (
    <main className="flex-1 bg-background pb-20">
      <SiteContainer className="pt-10 sm:pt-14 lg:pt-16">
        <div className="mx-auto max-w-4xl">
          <header className="text-center">
            <p className="font-mono text-[9px] text-foreground/45">Season 1 · Minggu ke-4 · reset Senin 00.00 WIB</p>
            <h1 className="mt-3 text-balance font-display text-5xl font-bold uppercase leading-none tracking-[-0.035em] sm:text-7xl">
              Top <span className="text-purple">auditor.</span>
            </h1>
            <p className="mt-4 text-sm text-foreground/55">Para pemburu hoaks paling jeli se-Kota Nusa minggu ini.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Periode peringkat">
              {periods.map((item) => <FilterChip key={item} selected={period === item} onClick={() => setPeriod(item)}>{item}</FilterChip>)}
            </div>
          </header>

          <section className="mt-14 sm:mt-18" aria-label={`Peringkat ${period}`}>
            <LeaderboardBoard podiumEntries={podiumEntries} rankedEntries={publicEntries} />
          </section>

          <aside className="mt-7 flex flex-col gap-5 rounded-2xl bg-purple px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.025em]">Namamu belum di sini.</h2>
              <p className="mt-1 text-xs text-white/70">Daftar sekarang, kasus pertamamu menunggu.</p>
            </div>
            <Button href="/register" variant="solid" className="shrink-0">Main Gratis</Button>
          </aside>
        </div>
      </SiteContainer>
    </main>
  );
}
