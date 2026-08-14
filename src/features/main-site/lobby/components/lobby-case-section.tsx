import Link from "next/link";

import { SiteContainer } from "@/src/shared/components/layout/site-container";

import type { UserCase } from "../../cases/types/case";
import { CaseCatalogCard } from "./case-catalog-card";
import { ContinuationCaseCard } from "./continuation-case-card";
import { DailyCaseCard } from "./daily-case-card";

type LobbyCaseSectionProps = {
  featuredCase: UserCase | null;
  continueCase: UserCase | null;
  otherCases: UserCase[];
};

export function LobbyCaseSection({ featuredCase, continueCase, otherCases }: LobbyCaseSectionProps) {
  return (
    <section className="bg-background py-6 sm:py-8">
      <SiteContainer>
        {featuredCase ? (
          <div className={continueCase ? "grid gap-4 lg:grid-cols-[1.45fr_1fr]" : "grid gap-4"}>
            <DailyCaseCard item={featuredCase} />
            {continueCase ? <ContinuationCaseCard item={continueCase} /> : null}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-surface px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground">Belum ada kasus unggulan.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Kasus baru akan muncul setelah dipublikasikan.</p>
          </div>
        )}

        {otherCases.length > 0 ? (
          <>
            <div className="mb-4 mt-8 flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.03em] sm:text-2xl">Kasus lain di kota<span className="text-orange">.</span></h2>
              <Link href="/cases" className="text-[9px] text-purple transition-colors hover:text-foreground sm:text-[10px]">Semua kasus →</Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {otherCases.map((item, index) => <CaseCatalogCard key={item.case_id} item={item} index={index} />)}
            </div>
          </>
        ) : null}
      </SiteContainer>
    </section>
  );
}
