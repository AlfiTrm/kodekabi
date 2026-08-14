import Link from "next/link";

import type { ShopCategoryFilter, ShopPagination as Pagination } from "../types/shop";

function hrefFor(category: ShopCategoryFilter, page: number) {
  const query = new URLSearchParams();
  if (category !== "all") query.set("category", category);
  if (page > 1) query.set("page", String(page));
  const suffix = query.toString();
  return suffix ? `/shop?${suffix}` : "/shop";
}

export function ShopPagination({ pagination, category }: { pagination: Pagination; category: ShopCategoryFilter }) {
  if (pagination.total_pages <= 1) return null;

  return (
    <nav className="mt-9 flex items-center justify-center gap-3" aria-label="Halaman shop">
      {pagination.page > 1 ? <Link href={hrefFor(category, pagination.page - 1)} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/60 hover:text-foreground">Sebelumnya</Link> : null}
      <span className="font-mono text-[10px] text-foreground/45">{pagination.page} / {pagination.total_pages}</span>
      {pagination.page < pagination.total_pages ? <Link href={hrefFor(category, pagination.page + 1)} className="rounded-full border border-border-strong px-4 py-2 text-xs text-foreground/60 hover:text-foreground">Berikutnya</Link> : null}
    </nav>
  );
}
