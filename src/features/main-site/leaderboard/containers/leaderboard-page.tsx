"use client";

import { useState } from "react";

import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { LeaderboardBoard } from "../components/leaderboard-board";
import { LeaderboardFilter } from "../components/leaderboard-filter";
import { currentUserEntry, podiumEntries, rankedEntries } from "../data/leaderboard";
import type { LeaderboardScope } from "../types/leaderboard";

export function LeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>("weekly");

  return (
    <main className="min-h-screen flex-1 bg-background pb-16 pt-28 sm:pt-32">
      <SiteContainer>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-[-0.05em] sm:text-6xl">
              Top Auditor<span className="text-purple">.</span>
            </h1>
            <div className="flex flex-col gap-2 sm:items-end">
              <p className="font-mono text-[9px] text-foreground/55">reset 2h 14m</p>
              <LeaderboardFilter value={scope} onChange={setScope} />
            </div>
          </div>

          <section className="mt-16 sm:mt-20" aria-label={`Peringkat ${scope}`}>
            <LeaderboardBoard podiumEntries={podiumEntries} rankedEntries={rankedEntries} currentUser={currentUserEntry} />
          </section>

          <p className="mt-7 text-center text-[9px] text-foreground/30 sm:text-[10px]">Naik 99 peringkat lagi untuk masuk podium. Gas!</p>
        </div>
      </SiteContainer>
    </main>
  );
}
