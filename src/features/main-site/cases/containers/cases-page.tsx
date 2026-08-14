import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { CaseCard } from "../components/case-card";
import { CaseFilter } from "../components/case-filter";
import { CasesPagination } from "../components/cases-pagination";
import { getUserCases } from "../services/user-cases-service";
import type { CaseFilter as CaseFilterValue } from "../types/case";

export type CasesPageProps = {
  tab: CaseFilterValue;
  page: number;
};

export function CasesPage({ tab, page }: CasesPageProps) {
  const queryKey = `${tab}|${page}`;

  return (
    <CasesShell tab={tab}>
      <Suspense key={queryKey} fallback={<CasesLoadingGrid />}>
        <CasesResult tab={tab} page={page} />
      </Suspense>
    </CasesShell>
  );
}

async function CasesResult({ tab, page }: CasesPageProps) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  let result: Awaited<ReturnType<typeof getUserCases>>;

  try {
    result = await getUserCases({ tab, page, limit: 10 }, accessToken);
  } catch {
    return <CasesError />;
  }

  const lastPage = Math.max(1, result.pagination.total_pages);
  if (page > lastPage) redirect(tab === "all" ? `/cases?page=${lastPage}` : `/cases?tab=${tab}&page=${lastPage}`);

  if (result.cases.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
        <p className="text-sm font-semibold">Belum ada kasus pada kategori ini.</p>
        <p className="mt-2 text-xs text-foreground/45">Coba kategori lain atau kembali lagi setelah kasus baru diterbitkan.</p>
      </div>
    );
  }

  return (
    <>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {result.cases.map((item) => <CaseCard key={item.case_id} item={item} />)}
      </section>
      <CasesPagination pagination={result.pagination} tab={tab} />
    </>
  );
}

function CasesShell({ tab, children }: { tab: CaseFilterValue; children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex-1 bg-background pb-16 pt-28 sm:pt-32">
      <SiteContainer>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-[-0.04em] sm:text-6xl">Daily Cases<span className="text-red">.</span></h1>
            <div className="mt-6"><CaseFilter value={tab} /></div>
          </div>
        </div>
        {children}
      </SiteContainer>
    </main>
  );
}

function CasesError() {
  return (
    <div className="mt-8 rounded-2xl border border-red/25 bg-red/8 px-6 py-16 text-center">
      <p className="text-sm font-semibold text-red">Daftar kasus gagal dimuat.</p>
      <p className="mt-2 text-xs text-foreground/50">Periksa koneksi lalu coba muat ulang halaman.</p>
      <Link href="/cases" className="mt-5 inline-flex rounded-full border border-red/30 px-5 py-2 text-xs font-semibold text-red hover:bg-red/10">Coba lagi</Link>
    </div>
  );
}

function CasesLoadingGrid() {
  return (
    <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Memuat daftar kasus" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
          <div className="aspect-[16/7] animate-pulse bg-surface-muted motion-reduce:animate-none" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
            <div className="h-3 w-full animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </section>
  );
}
