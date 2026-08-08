"use client";

import { useState } from "react";

import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { CaseCard } from "../components/case-card";
import { CaseFilter } from "../components/case-filter";
import { cases } from "../data/cases";
import type { CaseFilter as CaseFilterValue } from "../types/case";

export function CasesPage() {
  const [filter, setFilter] = useState<CaseFilterValue>("all");
  const visibleCases = filter === "all" ? cases : cases.filter((item) => item.status === filter);

  return (
    <main className="min-h-screen flex-1 bg-background pb-16 pt-28 sm:pt-32">
      <SiteContainer>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-[-0.05em] sm:text-6xl">
              Daily Cases<span className="text-red">.</span>
            </h1>
            <div className="mt-6"><CaseFilter value={filter} onChange={setFilter} /></div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <span className="rounded-full border border-orange/25 bg-orange/15 px-4 py-2 text-[9px] font-bold text-orange">▲ Streak 6 hari</span>
            <span className="rounded-full border border-white/8 bg-surface px-4 py-2 font-mono text-[9px] text-foreground/55">reset 09:12:44</span>
          </div>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {visibleCases.map((item) => <CaseCard key={item.id} item={item} />)}
        </section>

        {visibleCases.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border-strong py-16 text-center text-xs text-foreground/45">Belum ada kasus pada kategori ini.</div>
        ) : null}
      </SiteContainer>
    </main>
  );
}

