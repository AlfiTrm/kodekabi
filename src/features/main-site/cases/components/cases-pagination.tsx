import Link from "next/link";

import type { CaseFilter, UserCasesPagination } from "../types/case";

function hrefFor(tab: CaseFilter, page: number) {
  const query = new URLSearchParams();
  if (tab !== "all") query.set("tab", tab);
  if (page > 1) query.set("page", String(page));
  const suffix = query.toString();
  return suffix ? `/cases?${suffix}` : "/cases";
}

export function CasesPagination({ pagination, tab }: { pagination: UserCasesPagination; tab: CaseFilter }) {
  if (pagination.total_pages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Halaman kasus">
      {pagination.page > 1 ? <Link href={hrefFor(tab, pagination.page - 1)} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/60 hover:text-foreground">Sebelumnya</Link> : null}
      <span className="px-2 font-mono text-[10px] text-foreground/45">{pagination.page} / {pagination.total_pages}</span>
      {pagination.page < pagination.total_pages ? <Link href={hrefFor(tab, pagination.page + 1)} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/60 hover:text-foreground">Berikutnya</Link> : null}
    </nav>
  );
}
