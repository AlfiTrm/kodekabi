"use client";

import { FilterSelect } from "@/src/shared/components/ui/filter-select";

import { useShopFilters } from "../hooks/use-shop-filters";
import type { ShopCategoryFilter } from "../types/shop";

const categoryOptions = [
  { value: "all", label: "Semua item" },
  { value: "avatar", label: "Avatar skin" },
];

export function ShopFilters({ search: initialSearch, category }: { search: string; category: ShopCategoryFilter }) {
  const controls = useShopFilters(initialSearch, category);

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative block min-w-0 flex-1 sm:max-w-md">
        <span className="sr-only">Cari item shop</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 fill-none stroke-current text-foreground/40">
          <circle cx="11" cy="11" r="6.5" strokeWidth="1.8" /><path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input value={controls.search} onChange={(event) => controls.setSearch(event.target.value)} type="search" placeholder="Cari skin atau item..." aria-busy={controls.pending} className="h-11 w-full rounded-xl border border-border-strong bg-surface pl-11 pr-10 text-xs outline-none transition-colors placeholder:text-foreground/35 focus:border-purple" />
        {controls.pending ? <span aria-hidden="true" className="absolute right-4 top-1/2 size-3 -translate-y-1/2 animate-spin rounded-full border-2 border-purple/25 border-t-purple motion-reduce:animate-none" /> : null}
      </label>
      <FilterSelect label="Kategori" value={category} options={categoryOptions} onChange={(value) => controls.setCategory(value as ShopCategoryFilter)} className="sm:w-52" />
    </div>
  );
}
