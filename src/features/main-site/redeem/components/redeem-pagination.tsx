import Link from "next/link";

import type { RedeemFilter, RedeemPagination as Pagination } from "../types/redeem";

function hrefFor(page: number, search: string, filter: RedeemFilter) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (filter !== "all") params.set("filter", filter);
  if (page > 1) params.set("page", String(page));
  return `/shop/redeem${params.size ? `?${params.toString()}` : ""}`;
}

export function RedeemPagination({ pagination, search, filter }: { pagination: Pagination; search: string; filter: RedeemFilter }) {
  if (pagination.total_pages <= 1) return null;

  return (
    <nav aria-label="Halaman redeem" className="mt-9 flex items-center justify-center gap-3">
      {pagination.page > 1 ? <Link href={hrefFor(pagination.page - 1, search, filter)} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/55 hover:text-foreground">Sebelumnya</Link> : null}
      <span className="font-mono text-[10px] text-foreground/45">{pagination.page} / {pagination.total_pages}</span>
      {pagination.page < pagination.total_pages ? <Link href={hrefFor(pagination.page + 1, search, filter)} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/55 hover:text-foreground">Berikutnya</Link> : null}
    </nav>
  );
}
