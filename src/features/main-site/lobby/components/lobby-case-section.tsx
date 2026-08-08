import Link from "next/link";

import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { lobbyCases } from "../data/lobby-cases";
import { CaseCatalogCard } from "./case-catalog-card";
import { ContinuationCaseCard } from "./continuation-case-card";
import { DailyCaseCard } from "./daily-case-card";

export function LobbyCaseSection() {
  return (
    <section className="bg-background py-6 sm:py-8">
      <SiteContainer>
        <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
          <DailyCaseCard />
          <ContinuationCaseCard />
        </div>

        <div className="mb-4 mt-8 flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.03em] sm:text-2xl">Kasus lain di kota<span className="text-orange">.</span></h2>
          <Link href="/cases" className="text-[9px] text-purple transition-colors hover:text-foreground sm:text-[10px]">Semua cases →</Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lobbyCases.map((item) => <CaseCatalogCard key={item.id} item={item} />)}
        </div>
      </SiteContainer>
    </section>
  );
}

